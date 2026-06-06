"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "../../_components/Fields";
import { useSettings } from "../../_components/useSettings";
import { emptyPost, formatDate } from "../../_components/blogUtils";
import type { BlogPost } from "@/services/settings";

type Filter = "all" | "published" | "drafts";

export function BlogList() {
  const { settings, loading, error, savePartial } = useSettings();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-rose-600">Couldn&apos;t load settings: {error}</p>;
  if (!settings) return null;

  const posts = settings.blog.posts.slice().sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
  const filtered = posts
    .filter((p) =>
      filter === "all" ? true : filter === "drafts" ? p.isDraft : !p.isDraft,
    )
    .filter((p) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

  async function newPost() {
    if (!settings || creating) return;
    setCreating(true);
    const now = new Date().toISOString();
    const post = emptyPost(now);
    const next = [post, ...settings.blog.posts];
    try {
      await savePartial({ blog: { ...settings.blog, posts: next } });
      window.location.href = `/admin/blog/${post.id}`;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't create post");
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Blog"
          description="Long-form content with full SEO control. Each post lives at /insights/[slug] and emits Article JSON-LD for rich Google results."
        />
        <button
          type="button"
          onClick={newPost}
          disabled={creating || posts.length >= 200}
          className="rounded-lg bg-navy-600 px-4 py-2 text-[0.88rem] font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
        >
          {creating ? "Creating…" : "+ New post"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5">
          {(["all", "published", "drafts"] as Filter[]).map((f) => (
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
                {f === "all"
                  ? posts.length
                  : f === "drafts"
                    ? posts.filter((p) => p.isDraft).length
                    : posts.filter((p) => !p.isDraft).length}
              </span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, slug, category, tags…"
          className="ml-auto block w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.85rem] text-slate-900 outline-none placeholder:text-slate-400 focus:border-navy-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            ✎
          </div>
          <h3 className="text-[1rem] font-semibold text-slate-900 dark:text-slate-100">
            {posts.length === 0 ? "No posts yet" : "No matches"}
          </h3>
          <p className="mt-1.5 text-[0.85rem] text-slate-600 dark:text-slate-400">
            {posts.length === 0 ? "Click + New post to write your first one." : "Try a different filter or search."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50/60 text-[0.75rem] uppercase tracking-[0.08em] text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Category</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Updated</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PostRow({ post }: { post: BlogPost }) {
  return (
    <tr className="border-b border-slate-100 last:border-b-0 dark:border-slate-800">
      <td className="px-5 py-3">
        <Link
          href={`/admin/blog/${post.id}`}
          className="font-semibold text-slate-900 hover:text-navy-600 dark:text-slate-100 dark:hover:text-teal-300"
        >
          {post.title || "(untitled)"}
        </Link>
        <div className="mt-0.5 text-[0.78rem] text-slate-500 dark:text-slate-400">
          {post.slug ? <code className="text-[0.75rem]">/insights/{post.slug}</code> : <em>no slug yet</em>}
        </div>
      </td>
      <td className="hidden px-5 py-3 text-[0.85rem] text-slate-700 dark:text-slate-300 sm:table-cell">
        {post.category || "—"}
      </td>
      <td className="hidden px-5 py-3 text-[0.8rem] text-slate-600 dark:text-slate-400 md:table-cell">
        {formatDate(post.updatedAt)}
      </td>
      <td className="px-5 py-3">
        {post.isDraft ? (
          <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.72rem] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Draft
          </span>
        ) : (
          <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.72rem] font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Published
          </span>
        )}
      </td>
    </tr>
  );
}
