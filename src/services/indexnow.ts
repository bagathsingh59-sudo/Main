/**
 * IndexNow protocol — pings Bing/Yandex/Seznam to re-crawl URLs after
 * admin saves SEO/branding/navigation/etc. Google doesn't participate
 * yet, but accepts the same signal indirectly via Bing.
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

const PUBLIC_URLS = ["/", "/about", "/services", "/industries", "/insights", "/contact"];

export async function pingIndexNow(): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key || key.length < 8) {
    // Not configured — no-op.
    return;
  }

  const host = new URL(SITE_URL).host;
  const body = {
    host,
    key,
    keyLocation: `${SITE_URL}/api/indexnow-key`,
    urlList: PUBLIC_URLS.map((p) => `${SITE_URL}${p}`),
  };

  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json", Host: "api.indexnow.org" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn(`[indexnow] ping non-OK: ${res.status} ${await res.text().catch(() => "")}`);
    }
  } catch (err) {
    console.warn("[indexnow] ping failed:", err instanceof Error ? err.message : err);
  }
}
