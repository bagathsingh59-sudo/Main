"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../_components/Fields";

interface FileReference {
  path: string;
  label: string;
}

interface BlobFile {
  pathname: string;
  url: string;
  size: number;
  uploadedAt: string;
  isProtected: boolean;
  references: FileReference[];
}

type Filter = "all" | "referenced" | "orphans" | "protected";

const MB = 1024 * 1024;
const fmt = (b: number) => {
  if (b >= MB) return `${(b / MB).toFixed(1)} MB`;
  if (b >= 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
};
const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};
function isImage(pathname: string): boolean {
  return /\.(png|jpe?g|webp|svg|gif|ico)$/i.test(pathname);
}

export function FilesManager() {
  const [files, setFiles] = useState<BlobFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blob-files", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; files: BlobFile[]; message?: string };
      if (!res.ok || !json.ok) {
        setError(json.message ?? `HTTP ${res.status}`);
        return;
      }
      setFiles(json.files);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const folders = useMemo(() => {
    if (!files) return [] as string[];
    const s = new Set<string>();
    for (const f of files) {
      const top = f.pathname.split("/")[0];
      if (top) s.add(top);
    }
    return Array.from(s).sort();
  }, [files]);

  const filtered = useMemo(() => {
    if (!files) return [] as BlobFile[];
    return files
      .filter((f) => {
        if (filter === "referenced") return f.references.length > 0;
        if (filter === "orphans") return f.references.length === 0 && !f.isProtected;
        if (filter === "protected") return f.isProtected;
        return true;
      })
      .filter((f) => folderFilter === "all" || f.pathname.startsWith(`${folderFilter}/`))
      .filter((f) => !query.trim() || f.pathname.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (b.uploadedAt > a.uploadedAt ? 1 : -1));
  }, [files, filter, folderFilter, query]);

  const totals = useMemo(() => {
    if (!files) return { count: 0, bytes: 0, referenced: 0, orphans: 0, protected: 0 };
    return {
      count: files.length,
      bytes: files.reduce((s, f) => s + f.size, 0),
      referenced: files.filter((f) => f.references.length > 0).length,
      orphans: files.filter((f) => f.references.length === 0 && !f.isProtected).length,
      protected: files.filter((f) => f.isProtected).length,
    };
  }, [files]);

  function toggleOne(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }
  function toggleAll() {
    const deletable = filtered.filter((f) => !f.isProtected).map((f) => f.url);
    setSelected((prev) => {
      const allSelected = deletable.every((u) => prev.has(u));
      const next = new Set(prev);
      if (allSelected) deletable.forEach((u) => next.delete(u));
      else deletable.forEach((u) => next.add(u));
      return next;
    });
  }

  async function deleteUrls(urls: string[]) {
    if (urls.length === 0 || deleting) return;
    if (!confirm(`Permanently delete ${urls.length} file${urls.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
    setDeleting(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/blob-files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        report?: { deleted: number; failed: number; protectedCount: number; errors: string[] };
        message?: string;
      };
      if (!res.ok || !json.ok || !json.report) {
        setStatusMsg(`✕ ${json.message ?? `HTTP ${res.status}`}`);
        return;
      }
      const r = json.report;
      const parts: string[] = [`✓ Deleted ${r.deleted} file${r.deleted === 1 ? "" : "s"}`];
      if (r.failed > 0) parts.push(`${r.failed} failed`);
      if (r.protectedCount > 0) parts.push(`${r.protectedCount} protected (skipped)`);
      setStatusMsg(parts.join(" · "));
      setSelected(new Set());
      await load();
    } catch (err) {
      setStatusMsg(`✕ ${err instanceof Error ? err.message : "Delete failed"}`);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load files: {error}</p>;
  if (!files) return null;

  const allSelectedInView =
    filtered.filter((f) => !f.isProtected).length > 0 &&
    filtered.filter((f) => !f.isProtected).every((f) => selected.has(f.url));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Files"
          description="Every file in Vercel Blob. Delete orphaned uploads, browse references, or sweep folders. Auto-cleanup also runs after uploads and settings saves."
        />
        <Link
          href="/admin/storage"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ← Storage overview
        </Link>
      </div>

      {/* Summary row */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total files" value={totals.count.toString()} sub={fmt(totals.bytes)} />
        <Stat label="Referenced" value={totals.referenced.toString()} sub="In use" tone="emerald" />
        <Stat label="Orphans" value={totals.orphans.toString()} sub="Safe to delete" tone="amber" />
        <Stat label="Protected" value={totals.protected.toString()} sub="Settings files" tone="slate" />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "referenced", "orphans", "protected"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-[0.78rem] font-medium capitalize ${
                filter === f
                  ? "bg-navy-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {f}
              <span className="ml-1.5 opacity-60">
                {f === "all" ? totals.count : f === "referenced" ? totals.referenced : f === "orphans" ? totals.orphans : totals.protected}
              </span>
            </button>
          ))}
        </div>
        <select
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="all">All folders</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}/
            </option>
          ))}
        </select>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pathname…"
          className="ml-auto block w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.85rem] text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Batch action bar */}
      {selected.size > 0 && (
        <div className="sticky top-2 z-10 mb-3 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 dark:border-rose-900/40 dark:bg-rose-900/20">
          <span className="text-[0.85rem] text-rose-900 dark:text-rose-200">
            {selected.size} selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => deleteUrls(Array.from(selected))}
              disabled={deleting}
              className="rounded-md bg-rose-600 px-3 py-1.5 text-[0.82rem] font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : `Delete ${selected.size}`}
            </button>
          </div>
        </div>
      )}

      {statusMsg && (
        <div className="mb-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.82rem] dark:border-slate-700 dark:bg-slate-800">
          {statusMsg}
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
          <p className="text-[0.92rem] text-slate-600 dark:text-slate-400">
            {files.length === 0 ? "No files uploaded yet." : "No files match the current filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50/60 text-[0.75rem] uppercase tracking-[0.08em] text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelectedInView}
                    onChange={toggleAll}
                    aria-label="Select all visible"
                  />
                </th>
                <th className="w-16 px-4 py-3 font-semibold">Preview</th>
                <th className="px-4 py-3 font-semibold">File</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Used in</th>
                <th className="hidden px-4 py-3 text-right font-semibold sm:table-cell">Size</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Uploaded</th>
                <th className="w-16 px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file) => (
                <FileRow
                  key={file.url}
                  file={file}
                  selected={selected.has(file.url)}
                  onToggle={() => toggleOne(file.url)}
                  onDelete={() => deleteUrls([file.url])}
                  disabled={deleting}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FileRow({
  file,
  selected,
  onToggle,
  onDelete,
  disabled,
}: {
  file: BlobFile;
  selected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const status = file.isProtected ? "protected" : file.references.length > 0 ? "referenced" : "orphan";
  return (
    <tr className="border-b border-slate-100 align-middle last:border-b-0 dark:border-slate-800">
      <td className="px-4 py-3">
        {file.isProtected ? (
          <span className="text-slate-300 dark:text-slate-700" title="Protected">
            🔒
          </span>
        ) : (
          <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Select ${file.pathname}`} />
        )}
      </td>
      <td className="px-4 py-3">
        {isImage(file.pathname) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.url}
            alt=""
            className="h-10 w-10 rounded-md border border-slate-200 bg-slate-50 object-cover dark:border-slate-700 dark:bg-slate-800"
            loading="lazy"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-[0.75rem] uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            {file.pathname.split(".").pop()?.slice(0, 4) ?? "—"}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-mono text-[0.78rem] text-slate-700 hover:text-navy-600 dark:text-slate-300 dark:hover:text-teal-300"
        >
          {file.pathname}
        </a>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={status} />
          <span className="text-[0.72rem] text-slate-500 dark:text-slate-400 sm:hidden">{fmt(file.size)}</span>
        </div>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        {file.references.length === 0 ? (
          <span className="text-[0.78rem] text-slate-400 dark:text-slate-500">—</span>
        ) : (
          <ul className="space-y-0.5">
            {file.references.slice(0, 3).map((r) => (
              <li key={r.path} className="text-[0.78rem] text-slate-700 dark:text-slate-300">
                {r.label}
              </li>
            ))}
            {file.references.length > 3 && (
              <li className="text-[0.72rem] text-slate-500 dark:text-slate-400">
                +{file.references.length - 3} more
              </li>
            )}
          </ul>
        )}
      </td>
      <td className="hidden px-4 py-3 text-right text-[0.82rem] text-slate-700 dark:text-slate-300 sm:table-cell">
        {fmt(file.size)}
      </td>
      <td className="hidden px-4 py-3 text-[0.78rem] text-slate-600 dark:text-slate-400 lg:table-cell">
        {fmtDate(file.uploadedAt)}
      </td>
      <td className="px-4 py-3 text-right">
        {file.isProtected ? (
          <span className="text-[0.78rem] text-slate-400 dark:text-slate-500" title="Cannot delete settings files">
            —
          </span>
        ) : (
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="rounded-md border border-rose-200 bg-white px-2.5 py-1 text-[0.78rem] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40 dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-900/30"
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: "protected" | "referenced" | "orphan" }) {
  const styles = {
    protected: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    referenced: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    orphan: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  } as const;
  const labels = { protected: "Protected", referenced: "Referenced", orphan: "Orphan" } as const;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function Stat({
  label,
  value,
  sub,
  tone = "navy",
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "navy" | "emerald" | "amber" | "slate";
}) {
  const toneClass = {
    navy: "text-navy-700 dark:text-navy-300",
    emerald: "text-emerald-700 dark:text-emerald-400",
    amber: "text-amber-700 dark:text-amber-400",
    slate: "text-slate-700 dark:text-slate-300",
  }[tone];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-[0.72rem] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-1 text-[1.6rem] font-bold ${toneClass}`}>{value}</div>
      <div className="mt-0.5 text-[0.78rem] text-slate-500 dark:text-slate-400">{sub}</div>
    </div>
  );
}
