/**
 * Shared blog helpers used by both the admin editor and the public
 * post page.
 */

import type { BlogPost } from "@/services/settings";

/** Generate a URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Approximate reading time in minutes (200 wpm). */
export function readingTimeMinutes(markdown: string): number {
  const words = markdown.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Random short id for new posts. Avoids Date.now() (sandbox-restricted). */
export function makeId(): string {
  // 10-char a-z0-9 — collision risk is negligible at 200-post cap.
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 10; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/** Empty post template — used by the "new post" action. */
export function emptyPost(now: string): BlogPost {
  return {
    id: makeId(),
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "Vaishnavi Consultant",
    category: "Compliance",
    tags: [],
    publishedAt: now,
    updatedAt: now,
    isDraft: true,
    seo: { title: "", description: "", keywords: [], ogImage: "" },
  };
}

/** Format an ISO date as a short human-readable string. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}
