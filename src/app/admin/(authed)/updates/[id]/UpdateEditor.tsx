"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Field, Input, PageHeader, SaveBar, Select, Textarea, Toggle } from "../../../_components/Fields";
import { MarkdownEditor } from "../../../_components/MarkdownEditor";
import { useSettings } from "../../../_components/useSettings";
import { slugify } from "../../../_components/blogUtils";
import type { UpdateItem, SiteSettings } from "@/services/settings";

export function UpdateEditor({ updateId }: { updateId: string }) {
  const { settings, loading, error, savePartial } = useSettings();
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [autoSlug, setAutoSlug] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!settings) return;
    const has = settings.updates.items.some((u) => u.id === updateId);
    if (has) {
      setDraft(settings);
      return;
    }
    // Fallback: UpdatesList just created this update and stashed it in
    // sessionStorage. Merge it into the local draft so the editor renders
    // immediately, sidestepping the Blob CDN propagation window.
    try {
      const stashed = sessionStorage.getItem(`vc-fresh-update-${updateId}`);
      if (stashed) {
        const parsed = JSON.parse(stashed) as UpdateItem;
        if (parsed && parsed.id === updateId) {
          setDraft({
            ...settings,
            updates: { ...settings.updates, items: [parsed, ...settings.updates.items] },
          });
          sessionStorage.removeItem(`vc-fresh-update-${updateId}`);
          return;
        }
      }
    } catch {
      /* swallow */
    }
    setDraft(settings);
  }, [settings, updateId]);

  // Blob CDN propagation safety net — silently re-fetch up to 3 times
  // if the update isn't visible yet, before showing "Update not found".
  useEffect(() => {
    if (!draft || retryCount >= 3) return;
    const exists = draft.updates.items.some((u) => u.id === updateId);
    if (exists) return;
    const delay = 600 * (retryCount + 1);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const json = (await res.json()) as { ok: boolean; settings?: SiteSettings };
        if (json.ok && json.settings) {
          const hit = json.settings.updates.items.some((u) => u.id === updateId);
          if (hit) {
            setDraft(json.settings);
            return;
          }
        }
      } catch {
        /* swallow */
      }
      setRetryCount((c) => c + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [draft, retryCount, updateId]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!draft || !settings) return null;

  const update = draft.updates.items.find((u) => u.id === updateId);
  const original = settings.updates.items.find((u) => u.id === updateId);

  if (!update) {
    if (retryCount < 3) return <p className="text-slate-500">Loading update…</p>;
    return (
      <div>
        <PageHeader title="Update not found" description="This compliance update no longer exists." />
        <Link href="/admin/updates" className="text-navy-600 hover:underline dark:text-teal-300">
          ← Back to updates
        </Link>
      </div>
    );
  }

  const dirty = JSON.stringify(update) !== JSON.stringify(original);

  function patch(partial: Partial<UpdateItem>) {
    setDraft((d) =>
      d
        ? {
            ...d,
            updates: {
              ...d.updates,
              items: d.updates.items.map((u) =>
                u.id === updateId ? { ...u, ...partial, updatedAt: new Date().toISOString() } : u,
              ),
            },
          }
        : d,
    );
    setStatus({ kind: "idle" });
  }

  function setTitle(title: string) {
    patch({ title, ...(autoSlug ? { slug: slugify(title) } : {}) });
  }

  async function onSave() {
    if (!draft) return;
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      await savePartial({ updates: draft.updates });
      setStatus({ kind: "ok", message: "Update saved. Live within ~30 seconds." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!settings || deleting) return;
    if (!confirm(`Delete "${update?.title || "this update"}" permanently?`)) return;
    setDeleting(true);
    try {
      await savePartial({
        updates: { items: settings.updates.items.filter((u) => u.id !== updateId) },
      });
      window.location.href = "/admin/updates";
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Delete failed" });
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={update.title || "(untitled update)"}
          description={update.isDraft ? "Draft — not yet visible publicly." : "Published — live on /insights and /insights/updates/[slug]."}
        />
        <Link
          href="/admin/updates"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ← Back to updates
        </Link>
      </div>

      <Card title="Headline">
        <div className="grid gap-4">
          <Field label="Title" hint="One-line summary of the update.">
            <Input value={update.title} onChange={(e) => setTitle(e.target.value)} maxLength={280} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Field label="Slug" hint="URL on /insights/updates/[slug]. Auto-generated from the title.">
              <Input
                value={update.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  patch({ slug: slugify(e.target.value) });
                }}
              />
            </Field>
            <Field label="">
              <label className="flex h-10 items-center gap-2 text-[0.82rem] text-slate-600 dark:text-slate-400">
                <input type="checkbox" checked={autoSlug} onChange={(e) => setAutoSlug(e.target.checked)} />
                Auto from title
              </label>
            </Field>
          </div>
          <Field label="Summary" hint="1–2 lines shown on the /insights list card.">
            <Textarea value={update.summary} onChange={(e) => patch({ summary: e.target.value })} rows={2} maxLength={400} />
          </Field>
        </div>
      </Card>

      <Card title="Metadata">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Display date" hint='e.g. "28 May 2026". Shown on the card.'>
            <Input value={update.date} onChange={(e) => patch({ date: e.target.value })} />
          </Field>
          <Field label="Tag" hint='e.g. "GST", "EPF", "Labour Law".'>
            <Input value={update.tag} onChange={(e) => patch({ tag: e.target.value })} maxLength={40} />
          </Field>
          <Field label="Severity" hint="Drives the colored pill on the card.">
            <Select value={update.severity} onChange={(e) => patch({ severity: e.target.value as UpdateItem["severity"] })}>
              <option value="low">Low (green)</option>
              <option value="medium">Medium (amber)</option>
              <option value="high">High (red)</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card
        title="Briefing body"
        description="Full markdown content shown on /insights/updates/[slug]. Use the toolbar for formatting, lists, links, and inline images."
      >
        <MarkdownEditor
          value={update.content}
          onChange={(v) => patch({ content: v })}
          rows={18}
          uploadPurpose="blog-content"
          maxLength={50000}
          placeholder={"## Background\n\nWhat changed and why it matters.\n\n## Impact\n\n- Who is affected\n- When it takes effect\n\n## Action items\n\n1. Step one\n2. Step two"}
        />
      </Card>

      <Card title="Publish">
        <Toggle
          checked={!update.isDraft}
          onChange={(v) => patch({ isDraft: !v })}
          label="Publish this update"
          description="Drafts are hidden from /insights and the detail page returns 404. Toggle on to make live."
        />
      </Card>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-900/20">
        <div>
          <div className="font-semibold text-rose-900 dark:text-rose-200">Danger zone</div>
          <div className="text-[0.82rem] text-rose-700 dark:text-rose-300">Deleting removes the briefing permanently.</div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="rounded-lg bg-rose-600 px-3.5 py-2 text-[0.82rem] font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete update"}
        </button>
      </div>

      <SaveBar
        dirty={dirty}
        saving={saving}
        status={status}
        onSave={onSave}
        onReset={() => {
          setDraft(settings);
          setStatus({ kind: "idle" });
        }}
      />
    </div>
  );
}
