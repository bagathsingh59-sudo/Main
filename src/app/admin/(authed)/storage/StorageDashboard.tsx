"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, PageHeader } from "../../_components/Fields";

interface StatsResponse {
  ok: boolean;
  stats: {
    totalBytes: number;
    totalFiles: number;
    byFolder: Record<string, { bytes: number; files: number }>;
    budgets: { safeLimit: number; warnThreshold: number; totalBudget: number };
    status: "ok" | "warn" | "near-limit" | "over-limit";
    errors: string[];
  };
  orphans: { count: number; bytes: number; skippedRecent: number };
  message?: string;
}

interface CleanupResponse {
  ok: boolean;
  report?: { deleted: number; reclaimedBytes: number; failed: number; errors: string[] };
  message?: string;
}

const MB = 1024 * 1024;
const fmt = (b: number) => {
  if (b >= 1024 * MB) return `${(b / (1024 * MB)).toFixed(2)} GB`;
  if (b >= MB) return `${(b / MB).toFixed(1)} MB`;
  if (b >= 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
};
const pct = (a: number, b: number) => Math.min(100, Math.max(0, (a / b) * 100));

export function StorageDashboard() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [cleanupMsg, setCleanupMsg] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blob-stats", { cache: "no-store" });
      const json = (await res.json()) as StatsResponse;
      if (!res.ok || !json.ok) {
        setError(json.message ?? `HTTP ${res.status}`);
        return;
      }
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  async function runCleanup() {
    if (cleaning) return;
    if (!confirm("Delete unreferenced files older than 1 hour? Files still in use are safe.")) return;
    setCleaning(true);
    setCleanupMsg(null);
    try {
      const res = await fetch("/api/admin/blob-stats", { method: "POST" });
      const json = (await res.json()) as CleanupResponse;
      if (!res.ok || !json.ok || !json.report) {
        setCleanupMsg(`✕ ${json.message ?? `HTTP ${res.status}`}`);
        return;
      }
      const r = json.report;
      setCleanupMsg(
        `✓ Deleted ${r.deleted} file${r.deleted === 1 ? "" : "s"} · reclaimed ${fmt(r.reclaimedBytes)}` +
          (r.failed > 0 ? ` · ${r.failed} failed` : ""),
      );
      await fetchStats();
    } catch (err) {
      setCleanupMsg(`✕ ${err instanceof Error ? err.message : "Cleanup failed"}`);
    } finally {
      setCleaning(false);
    }
  }

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load stats: {error}</p>;
  if (!data) return null;

  const { stats, orphans } = data;
  const usedPct = pct(stats.totalBytes, stats.budgets.totalBudget);
  const safePct = pct(stats.budgets.safeLimit, stats.budgets.totalBudget);
  const warnPct = pct(stats.budgets.warnThreshold, stats.budgets.totalBudget);

  const STATUS_COPY: Record<typeof stats.status, { label: string; klass: string }> = {
    ok: { label: "Healthy", klass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
    warn: { label: "Getting full", klass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
    "near-limit": { label: "Near limit", klass: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300" },
    "over-limit": { label: "OVER safe limit", klass: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300" },
  };
  const statusCopy = STATUS_COPY[stats.status];

  return (
    <div>
      <PageHeader
        title="Storage"
        description="Vercel Blob — 1 GB free tier with a 200 MB reserved for headroom (safe limit: 800 MB). New uploads are auto-blocked above the safe limit, and orphaned files are pruned 1 hour after they stop being referenced."
      />

      {/* Status badge + usage bar */}
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[2.2rem] font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {fmt(stats.totalBytes)}
            </div>
            <div className="mt-0.5 text-[0.85rem] text-slate-600 dark:text-slate-400">
              {stats.totalFiles} file{stats.totalFiles === 1 ? "" : "s"} · {fmt(stats.budgets.totalBudget)} budget
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-[0.78rem] font-semibold ${statusCopy.klass}`}>
            {statusCopy.label}
          </span>
        </div>

        <div className="relative mt-5 h-6 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {/* Filled */}
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all ${
              stats.status === "over-limit"
                ? "bg-rose-500"
                : stats.status === "near-limit"
                  ? "bg-orange-500"
                  : stats.status === "warn"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
            }`}
            style={{ width: `${usedPct}%` }}
          />
          {/* Warn marker */}
          <div className="absolute inset-y-0 border-l-2 border-amber-400/60" style={{ left: `${warnPct}%` }} />
          {/* Safe-limit marker */}
          <div className="absolute inset-y-0 border-l-2 border-rose-500/70" style={{ left: `${safePct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[0.72rem] text-slate-500 dark:text-slate-400">
          <span>0</span>
          <span style={{ marginLeft: `calc(${warnPct}% - 4ch)` }}>
            Warn {fmt(stats.budgets.warnThreshold)}
          </span>
          <span style={{ marginLeft: `calc(${safePct - warnPct}% - 4ch)` }}>
            Safe limit {fmt(stats.budgets.safeLimit)}
          </span>
          <span>{fmt(stats.budgets.totalBudget)}</span>
        </div>
      </Card>

      {/* Folder breakdown */}
      <Card title="By folder" description="How storage is distributed across upload categories.">
        {Object.keys(stats.byFolder).length === 0 ? (
          <p className="text-[0.88rem] text-slate-500 dark:text-slate-400">No files yet.</p>
        ) : (
          <ul className="space-y-3">
            {Object.entries(stats.byFolder)
              .sort(([, a], [, b]) => b.bytes - a.bytes)
              .map(([folder, info]) => {
                const folderPct = stats.totalBytes > 0 ? (info.bytes / stats.totalBytes) * 100 : 0;
                return (
                  <li key={folder}>
                    <div className="flex justify-between text-[0.85rem]">
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{folder}/</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {fmt(info.bytes)} · {info.files} file{info.files === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-navy-500"
                        style={{ width: `${folderPct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </Card>

      {/* Orphan cleanup */}
      <Card
        title="Orphan cleanup"
        description="Files no longer referenced by settings (replaced logos, deleted post covers, etc.). The 1-hour grace window protects work-in-progress uploads."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Orphan files" value={orphans.count.toString()} />
          <Stat label="Reclaimable" value={fmt(orphans.bytes)} />
          <Stat label="Recently uploaded (skipped)" value={orphans.skippedRecent.toString()} />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.82rem] text-slate-600 dark:text-slate-400">
            Cleanup runs automatically after every settings save. Use this for an on-demand sweep.
          </p>
          <button
            type="button"
            onClick={runCleanup}
            disabled={cleaning || orphans.count === 0}
            className="rounded-lg bg-navy-600 px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-40"
          >
            {cleaning ? "Cleaning…" : orphans.count === 0 ? "Nothing to clean" : `Clean up ${orphans.count} file${orphans.count === 1 ? "" : "s"}`}
          </button>
        </div>
        {cleanupMsg && (
          <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-[0.82rem] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {cleanupMsg}
          </div>
        )}
      </Card>

      {stats.errors.length > 0 && (
        <Card title="Warnings">
          <ul className="space-y-1 text-[0.85rem] text-amber-700 dark:text-amber-400">
            {stats.errors.map((e, i) => (
              <li key={i}>⚠ {e}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="text-[0.72rem] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-[1.4rem] font-bold text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}
