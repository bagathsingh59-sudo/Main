/**
 * Read site settings from Vercel Blob (single JSON file).
 *
 * Why Blob (not Edge Config): Hobby Edge Config caps a single item at
 * ~8 KB. Our settings — once you add 168 keywords + 7 SEO pages + email
 * templates + nav + everything — exceed that and silently fail every
 * save. Blob has no such cap (1 GB free) and is already wired up.
 *
 * Read path: fetch the JSON from the deterministic Blob URL, in-memory
 * cache for 30 seconds inside the serverless function instance.
 *
 * The reader never throws — site rendering must never break because
 * of a config issue. Worst case, defaults are used.
 */

import { DEFAULT_SETTINGS } from "./defaults";
import { siteSettingsSchema, type SiteSettings } from "./types";

/** Deterministic pathname inside the Blob store. */
export const SETTINGS_BLOB_PATHNAME = "vc-config/site-settings.json";

/** Read once per request, with a tiny in-memory cache inside the
 * serverless function instance. Blob reads are ~50-100 ms; the cache
 * trims warm calls to ~0. */
let cached: { at: number; value: SiteSettings } | null = null;
const TTL_MS = 30_000;

/**
 * Parse the Vercel Blob store URL out of the read-write token.
 * Token format: `vercel_blob_rw_<storeId>_<random>` → URL is
 * `https://<storeId>.public.blob.vercel-storage.com`.
 *
 * Falls back to optional NEXT_PUBLIC_BLOB_STORE_URL so the reader still
 * works in environments where only the public token is exposed (e.g.
 * Next.js client RSC fallbacks that never need writes).
 */
export function getBlobStoreUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_BLOB_STORE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const m = token.match(/^vercel_blob_rw_([a-z0-9]+)_/i);
  if (!m) return null;
  return `https://${m[1].toLowerCase()}.public.blob.vercel-storage.com`;
}

/**
 * Forward-migrate older stored shapes into the current schema. We
 * keep this lenient: anything that matches a current sub-schema is
 * preserved; everything else falls back to defaults.
 */
function migrate(raw: unknown): SiteSettings {
  if (!raw || typeof raw !== "object") return DEFAULT_SETTINGS;
  const obj = raw as Record<string, unknown>;
  return {
    ...DEFAULT_SETTINGS,
    automation: { ...DEFAULT_SETTINGS.automation, ...(obj.automation as object) },
    rateLimit: { ...DEFAULT_SETTINGS.rateLimit, ...(obj.rateLimit as object) },
    contactInfo: { ...DEFAULT_SETTINGS.contactInfo, ...(obj.contactInfo as object) },
    formConfig: { ...DEFAULT_SETTINGS.formConfig, ...(obj.formConfig as object) },
    banner: { ...DEFAULT_SETTINGS.banner, ...(obj.banner as object) },
    maintenance: { ...DEFAULT_SETTINGS.maintenance, ...(obj.maintenance as object) },
    seo: obj.seo ? { ...DEFAULT_SETTINGS.seo, ...(obj.seo as object) } : DEFAULT_SETTINGS.seo,
    branding: obj.branding
      ? { ...DEFAULT_SETTINGS.branding, ...(obj.branding as object) }
      : DEFAULT_SETTINGS.branding,
    navigation: obj.navigation
      ? { ...DEFAULT_SETTINGS.navigation, ...(obj.navigation as object) }
      : DEFAULT_SETTINGS.navigation,
    emailTemplates: obj.emailTemplates
      ? { ...DEFAULT_SETTINGS.emailTemplates, ...(obj.emailTemplates as object) }
      : DEFAULT_SETTINGS.emailTemplates,
    faq: obj.faq ? { ...DEFAULT_SETTINGS.faq, ...(obj.faq as object) } : DEFAULT_SETTINGS.faq,
    blog: obj.blog ? { ...DEFAULT_SETTINGS.blog, ...(obj.blog as object) } : DEFAULT_SETTINGS.blog,
    team: obj.team ? { ...DEFAULT_SETTINGS.team, ...(obj.team as object) } : DEFAULT_SETTINGS.team,
    services: obj.services
      ? { ...DEFAULT_SETTINGS.services, ...(obj.services as object) }
      : DEFAULT_SETTINGS.services,
    founder: obj.founder ? { ...DEFAULT_SETTINGS.founder, ...(obj.founder as object) } : DEFAULT_SETTINGS.founder,
    updates: obj.updates ? { ...DEFAULT_SETTINGS.updates, ...(obj.updates as object) } : DEFAULT_SETTINGS.updates,
  };
}

export interface GetSettingsOptions {
  /**
   * Bypass the in-memory cache and read directly from Blob storage.
   * Use this for admin reads where freshness matters more than latency —
   * particularly right after a save, to avoid the multi-instance staleness
   * window where another serverless function may serve a pre-write value.
   */
  skipCache?: boolean;
}

export async function getSiteSettings(opts: GetSettingsOptions = {}): Promise<SiteSettings> {
  const now = Date.now();
  if (!opts.skipCache && cached && now - cached.at < TTL_MS) return cached.value;

  const storeUrl = getBlobStoreUrl();
  if (!storeUrl) {
    cached = { at: now, value: DEFAULT_SETTINGS };
    return DEFAULT_SETTINGS;
  }

  try {
    // When skipCache is set (admin reads), append a unique query string
    // so the Vercel Blob CDN cannot serve a stale edge-cached copy from a
    // node that hasn't yet seen the latest write. `cache: "no-store"` only
    // bypasses Next.js's fetch cache — it doesn't influence the CDN layer
    // between us and origin. A cache-busting param forces a cache miss.
    const url = opts.skipCache
      ? `${storeUrl}/${SETTINGS_BLOB_PATHNAME}?_t=${Date.now()}`
      : `${storeUrl}/${SETTINGS_BLOB_PATHNAME}`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      // 404 means no settings have been saved yet — use defaults.
      cached = { at: now, value: DEFAULT_SETTINGS };
      return DEFAULT_SETTINGS;
    }
    const raw = (await res.json()) as unknown;
    const parsed = siteSettingsSchema.safeParse(raw);
    if (parsed.success) {
      cached = { at: now, value: parsed.data };
      return parsed.data;
    }
    // Older shape — soft-migrate, then re-validate.
    const migrated = migrate(raw);
    const reparsed = siteSettingsSchema.safeParse(migrated);
    const value = reparsed.success ? reparsed.data : DEFAULT_SETTINGS;
    cached = { at: now, value };
    return value;
  } catch (err) {
    console.error("[settings] Blob read failed:", err instanceof Error ? err.message : err);
    return DEFAULT_SETTINGS;
  }
}

/** Force the next call to bypass the in-memory cache. Used after writes. */
export function invalidateSettingsCache() {
  cached = null;
}
