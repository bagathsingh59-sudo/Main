/**
 * IndexNow protocol — pings Bing / Yandex / Seznam / DuckDuckGo to
 * re-crawl URLs after the admin saves anything that changes the
 * public site.
 *
 * Google does not officially participate in IndexNow, but they
 * read the same sitemap.xml that we surface, and Bing-discovered
 * pages frequently get picked up by Google within a day or two.
 *
 * Setup:
 *   1. Generate a key: `openssl rand -hex 16`
 *   2. Set INDEXNOW_KEY in Vercel env vars (32+ hex chars).
 *   3. Submitted endpoint: GET /api/indexnow-key returns the key as
 *      plain text — that's the `keyLocation` we cite in pings.
 *
 * Fails silently when not configured; never throws to callers.
 */

import { SITE_URL } from "@/utils/jsonLd";
import { getSiteSettings } from "./settings";

/**
 * Core marketing pages — always submitted on every ping. Cheap to
 * include and reasserts their freshness whenever navigation, SEO,
 * branding or banner copy changes.
 */
const CORE_URLS = ["/", "/about", "/services", "/industries", "/insights", "/contact"] as const;

/**
 * Build the complete URL list from current settings — core pages plus
 * every published blog post and compliance update. Drafts are filtered
 * out so a notice-of-intent doesn't leak into search engines before
 * the author publishes.
 */
async function buildUrlList(): Promise<string[]> {
  try {
    const settings = await getSiteSettings();
    const blog = settings.blog.posts
      .filter((p) => !p.isDraft && p.slug)
      .map((p) => `/insights/${p.slug}`);
    const updates = settings.updates.items
      .filter((u) => !u.isDraft && u.slug)
      .map((u) => `/insights/updates/${u.slug}`);
    return [...CORE_URLS, ...blog, ...updates];
  } catch {
    // Settings read failed — still ping the core URLs.
    return [...CORE_URLS];
  }
}

// IndexNow allows up to 10,000 URLs per request — we'll never hit
// that. Chunked defensively at 1000 to keep payloads small.
const CHUNK_SIZE = 1000;

export async function pingIndexNow(): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key || key.length < 8) {
    // Not configured — no-op.
    return;
  }

  const host = new URL(SITE_URL).host;
  const paths = await buildUrlList();
  const urls = paths.map((p) => `${SITE_URL}${p}`);

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE);
    const body = {
      host,
      key,
      keyLocation: `${SITE_URL}/api/indexnow-key`,
      urlList: chunk,
    };

    try {
      const res = await fetch("https://api.indexnow.org/IndexNow", {
        method: "POST",
        headers: { "Content-Type": "application/json", Host: "api.indexnow.org" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.warn(
          `[indexnow] ping non-OK: ${res.status} ${await res.text().catch(() => "")}`,
        );
      }
    } catch (err) {
      console.warn("[indexnow] ping failed:", err instanceof Error ? err.message : err);
    }
  }
}
