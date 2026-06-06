"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import { makeId, formatDate } from "../../_components/blogUtils";
import type { UpdateItem } from "@/services/settings";

const SEVERITY: Record<"low" | "medium" | "high", string> = {
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

export function UpdatesList() {
  const { settings, loading, error, savePartial } = useSettings();
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!settings) return null;

  const items = settings.updates.items
    .slice()
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
  const filtered = items.filter((u) =>
    filter === "all" ? true : filter === "drafts" ? u.isDraft : !u.isDraft,
  );

  async function newUpdate() {
    if (!settings || creating) return;
    setCreating(true);
    const now = new Date().toISOString();
    const id = makeId();
    const item: UpdateItem = {
      id,
      slug: `untitled-${id}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      tag: "GST",
      severity: "medium",
      title: "Untitled compliance update",
      summary: "",
      content: "",
      publishedAt: now,
      updatedAt: now,
      isDraft: true,
    };
    try {
      await savePartial({ updates: { items: [item, ...settings.updates.items] } });
      window.location.href = `/admin/updates/${id}`;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't create update");
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Compliance updates"
          description="Briefings shown in the 'Latest compliance updates' section on /insights. Each published item gets its own /insights/updates/[slug] page."
        />
        <button
          type="button"
          onClick={newUpdate}
          disabled={creating || items.length >= 200}
          className="rounded-lg bg-navy-600 px-4 py-2 text-[0.88rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
        >
          {creating ? "Creating…" : "+ New update"}
        </button>
      </div>

      <div className="mb-4 flex gap-1.5">
        {(["all", "published", "drafts"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-[0.78rem] font-medium capitalize ${
              filter === f
                ? "bg-navy-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {f}{" "}
            <span className="opacity-60">
              {f === "all" ? items.length : f === "drafts" ? items.filter((i) => i.isDraft).length : items.filter((i) => !i.isDraft).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <p className="text-[0.92rem] text-slate-600 dark:text-slate-400">
            {items.length === 0 ? "No updates yet. Click + New update to add your first." : "Nothing in this filter."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((u) => (
            <li key={u.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[0.72rem]">
                    <span className="font-mono text-slate-500 dark:text-slate-400">{u.date}</span>
                    <span className={`rounded-full px-2 py-0.5 font-bold ${SEVERITY[u.severity]}`}>{u.tag}</span>
                    {u.isDraft ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        Draft
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Published
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/admin/updates/${u.id}`}
                    className="block font-semibold text-slate-900 hover:text-navy-600 dark:text-slate-100 dark:hover:text-teal-300"
                  >
                    {u.title || "(untitled)"}
                  </Link>
                  {u.summary && (
                    <p className="mt-1 text-[0.85rem] text-slate-600 dark:text-slate-400">{u.summary}</p>
                  )}
                  <div className="mt-1 text-[0.72rem] text-slate-500 dark:text-slate-500">
                    {u.slug ? <code>/insights/updates/{u.slug}</code> : <em>no slug</em>} · updated {formatDate(u.updatedAt)}
                  </div>
                </div>
                <Link
                  href={`/admin/updates/${u.id}`}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
