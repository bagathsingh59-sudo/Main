"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, Field, Input, PageHeader, SaveBar, Select, Textarea, Toggle } from "../../../_components/Fields";
import { ImageUpload } from "../../../_components/ImageUpload";
import { KeywordEditor } from "../../../_components/KeywordEditor";
import { MarkdownEditor } from "../../../_components/MarkdownEditor";
import { useSettings } from "../../../_components/useSettings";
import { readingTimeMinutes, slugify } from "../../../_components/blogUtils";
import type { BlogPost, BlogPostSeo } from "@/services/settings";

interface Props {
  postId: string;
}

const TABS = ["Content", "SEO", "Settings"] as const;
type Tab = (typeof TABS)[number];

export function BlogEditor({ postId }: Props) {
  const router = useRouter();
  const { settings, loading, error, savePartial } = useSettings();
  const [draft, setDraft] = useState<BlogPost | null>(null);
  const [resolved, setResolved] = useState(false);
  const [tab, setTab] = useState<Tab>("Content");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });

  useEffect(() => {
    if (!settings) return;
    const post = settings.blog.posts.find((p) => p.id === postId);
    setDraft(post ?? null);
    setResolved(true);
  }, [settings, postId]);

  if (loading || !settings || !resolved) return <p className="p-6 text-slate-500">Loading…</p>;
  if (error) return <p className="p-6 text-rose-600">Couldn&apos;t load: {error}</p>;
  if (!draft) {
    return (
      <div className="p-6">
        <p className="text-rose-600">Post not found.</p>
        <Link href="/admin/blog" className="mt-3 inline-block text-[0.85rem] font-medium text-navy-600 hover:underline">
          ← Back to all posts
        </Link>
      </div>
    );
  }

  const original = settings.blog.posts.find((p) => p.id === postId);
  const dirty = JSON.stringify(draft) !== JSON.stringify(original);
  const minutes = readingTimeMinutes(draft.content);

  function patch(p: Partial<BlogPost>) {
    setDraft((d) => (d ? { ...d, ...p } : d));
    setStatus({ kind: "idle" });
  }
  function patchSeo(p: Partial<BlogPostSeo>) {
    setDraft((d) => (d ? { ...d, seo: { ...d.seo, ...p } } : d));
    setStatus({ kind: "idle" });
  }

  async function save(opts: { publish?: boolean } = {}) {
    if (!draft || !settings) return;
    if (!draft.title.trim() || !draft.slug.trim() || !draft.content.trim()) {
      setStatus({ kind: "error", message: "Title, slug, and content are required" });
      setTab("Content");
      return;
    }
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const now = new Date().toISOString();
      const next: BlogPost = {
        ...draft,
        updatedAt: now,
        ...(opts.publish ? { isDraft: false, publishedAt: original?.publishedAt ?? now } : {}),
      };
      const nextPosts = settings.blog.posts.map((p) => (p.id === draft.id ? next : p));
      await savePartial({ blog: { ...settings.blog, posts: nextPosts } });
      setDraft(next);
      setStatus({
        kind: "ok",
        message: opts.publish ? "Published. Live within ~30 seconds." : "Saved.",
      });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!settings || !draft) return;
    if (!confirm(`Delete "${draft.title || "(untitled)"}" permanently? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const nextPosts = settings.blog.posts.filter((p) => p.id !== draft.id);
      await savePartial({ blog: { ...settings.blog, posts: nextPosts } });
      router.push("/admin/blog");
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Delete failed" });
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-[0.82rem] text-slate-500 dark:text-slate-400">
        <Link href="/admin/blog" className="font-medium hover:text-navy-600 dark:hover:text-teal-300">
          ← All posts
        </Link>
        <span>·</span>
        <span>{minutes} min read</span>
        <span>·</span>
        <span>{draft.isDraft ? "Draft" : "Published"}</span>
      </div>

      <PageHeader title={draft.title || "Untitled post"} description={draft.slug ? `/insights/${draft.slug}` : "No slug yet"} />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-[0.82rem] font-medium ${
              tab === t
                ? "bg-navy-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Content" && <ContentTab draft={draft} patch={patch} />}
      {tab === "SEO" && <SeoTab draft={draft} patchSeo={patchSeo} />}
      {tab === "Settings" && (
        <SettingsTab
          draft={draft}
          patch={patch}
          categories={settings.blog.categories}
        />
      )}

      <SaveBar
        dirty={dirty}
        saving={saving}
        status={status}
        onSave={() => save()}
        onReset={() => {
          if (original) setDraft(original);
          setStatus({ kind: "idle" });
        }}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-900/60">
        <button
          type="button"
          onClick={remove}
          disabled={deleting || saving}
          className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40 dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-900/30"
        >
          {deleting ? "Deleting…" : "Delete post"}
        </button>
        <div className="flex gap-2">
          {draft.slug && !draft.isDraft && (
            <Link
              href={`/insights/${draft.slug}`}
              target="_blank"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              View live ↗
            </Link>
          )}
          {draft.isDraft && (
            <button
              type="button"
              onClick={() => save({ publish: true })}
              disabled={saving || !draft.title || !draft.slug || !draft.content}
              className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[0.82rem] font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
            >
              {saving ? "Publishing…" : "Save & Publish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────  Content tab  ────────────────────────── */

function ContentTab({
  draft,
  patch,
}: {
  draft: BlogPost;
  patch: (p: Partial<BlogPost>) => void;
}) {
  const [autoSlug, setAutoSlug] = useState(draft.slug === "" || draft.slug === slugify(draft.title));

  function setTitle(title: string) {
    patch({ title, ...(autoSlug ? { slug: slugify(title) } : {}) });
  }

  return (
    <>
      <Card title="Headline & summary">
        <div className="space-y-4">
          <Field label="Title" hint="Becomes the page <h1> and default SEO title.">
            <Input value={draft.title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Field label="Slug" hint="Lowercase a-z, 0-9, hyphens. Powers the URL.">
              <Input
                value={draft.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  patch({ slug: slugify(e.target.value) });
                }}
                placeholder="epf-registration-process-india"
              />
            </Field>
            <label className="flex items-end gap-2 pb-2 text-[0.78rem] text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={autoSlug}
                onChange={(e) => {
                  setAutoSlug(e.target.checked);
                  if (e.target.checked) patch({ slug: slugify(draft.title) });
                }}
              />
              Auto-slug
            </label>
          </div>
          <Field label="Excerpt" hint="1-2 sentences. Shows on cards and as the default meta description.">
            <Textarea
              value={draft.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
              maxLength={400}
              rows={2}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Cover image"
        description="Used on the post list, the article hero, and as the default OG image."
      >
        <ImageUpload
          purpose="blog-cover"
          value={draft.coverImage}
          onChange={(url) => patch({ coverImage: url })}
          hint="Recommended: 1600×900 (16:9). PNG, JPG, or WebP. Max 2 MB."
          aspect="wide"
        />
      </Card>

      <Card
        title="Body"
        description="Headings, lists, links, bold/italic, code, tables, inline images. Use the toolbar — or click Preview to see the rendered post."
      >
        <div className="mb-3 flex items-center justify-end">
          <span className="text-[0.78rem] text-slate-600 dark:text-slate-400">
            {readingTimeMinutes(draft.content)} min read
          </span>
        </div>
        <MarkdownEditor
          value={draft.content}
          onChange={(v) => patch({ content: v })}
          rows={24}
          uploadPurpose="blog-content"
          maxLength={50000}
          placeholder={
            "## Introduction\n\nWrite your article. Use the toolbar for **bold**, *italic*, lists, headings, and inline images.\n\n### Subsection\n\n- bullet 1\n- bullet 2\n\n> Quote or callout"
          }
        />
      </Card>
    </>
  );
}

/* ────────────────  SEO tab  ─────────────────────────────── */

function SeoTab({ draft, patchSeo }: { draft: BlogPost; patchSeo: (p: Partial<BlogPostSeo>) => void }) {
  const seoTitle = draft.seo.title || draft.title;
  const seoDesc = draft.seo.description || draft.excerpt;
  return (
    <>
      <Card
        title="Search engine appearance"
        description="Overrides for what shows on Google and social cards. Leave blank to use the headline + excerpt."
      >
        <div className="space-y-4">
          <Field label="SEO title override" hint="50-60 chars ideal. Falls back to the post title.">
            <Input
              value={draft.seo.title}
              onChange={(e) => patchSeo({ title: e.target.value })}
              maxLength={80}
              placeholder={draft.title}
            />
          </Field>
          <Field label="Meta description override" hint="120-160 chars ideal. Falls back to the excerpt.">
            <Textarea
              value={draft.seo.description}
              onChange={(e) => patchSeo({ description: e.target.value })}
              maxLength={320}
              rows={2}
              placeholder={draft.excerpt}
            />
          </Field>
          <Field label="Keywords" hint="Comma-separated or click + Bulk add.">
            <KeywordEditor value={draft.seo.keywords} onChange={(next) => patchSeo({ keywords: next })} />
          </Field>
          <Field label="OG image override" hint="Leave empty to use the cover image.">
            <Input value={draft.seo.ogImage} onChange={(e) => patchSeo({ ogImage: e.target.value })} placeholder={draft.coverImage} />
          </Field>
        </div>
      </Card>

      <Card title="Live Google preview">
        <div className="rounded-lg border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="text-[0.75rem] text-emerald-700 dark:text-emerald-400">
            vaishnaviconsultant.com/insights/{draft.slug || "your-slug-here"}
          </div>
          <div className="mt-0.5 truncate text-[1.05rem] font-medium text-[#1a0dab] dark:text-blue-300">
            {seoTitle || "Your title"}
          </div>
          <div className="mt-1 line-clamp-2 text-[0.85rem] text-slate-600 dark:text-slate-300">
            {seoDesc || "Your excerpt or description appears here…"}
          </div>
        </div>
      </Card>
    </>
  );
}

/* ────────────────  Settings tab  ────────────────────────── */

function SettingsTab({
  draft,
  patch,
  categories,
}: {
  draft: BlogPost;
  patch: (p: Partial<BlogPost>) => void;
  categories: readonly string[];
}) {
  return (
    <>
      <Card title="Visibility">
        <Toggle
          checked={!draft.isDraft}
          onChange={(v) => patch({ isDraft: !v })}
          label="Published"
          description="When off, the post is a draft — not indexed, not in the listing, not in the sitemap. You can still preview it via the admin link."
        />
      </Card>

      <Card title="Metadata">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Author">
            <Input value={draft.author} onChange={(e) => patch({ author: e.target.value })} maxLength={100} />
          </Field>
          <Field label="Category" hint="Common ones suggested. Type a new value to add.">
            <Select value={draft.category} onChange={(e) => patch({ category: e.target.value })}>
              <option value="">— None —</option>
              {(categories.includes(draft.category) || !draft.category
                ? categories
                : [draft.category, ...categories]
              ).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Published date" hint="ISO timestamp — controls the article's date in JSON-LD.">
            <Input
              type="datetime-local"
              value={draft.publishedAt ? draft.publishedAt.slice(0, 16) : ""}
              onChange={(e) => {
                const v = e.target.value;
                patch({ publishedAt: v ? new Date(v).toISOString() : "" });
              }}
            />
          </Field>
          <Field label="Tags" hint="Used as on-page chips and meta keywords.">
            <KeywordEditor value={draft.tags} onChange={(next) => patch({ tags: next })} />
          </Field>
        </div>
      </Card>
    </>
  );
}
