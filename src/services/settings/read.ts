/**
 * Read site settings from Vercel Edge Config with a safe defaults
 * fallback. The reader never throws — site rendering must never break
 * because of a config issue. Worst case, defaults are used.
 */

import { get } from "@vercel/edge-config";
import { DEFAULT_SETTINGS } from "./defaults";
import { siteSettingsSchema, type SiteSettings } from "./types";

const KEY = "siteSettings";

/** Read once per request, with a tiny in-memory cache inside the
 * serverless function instance. Edge Config reads are sub-30ms but
 * the cache trims them to ~0 on warm calls. */
let cached: { at: number; value: SiteSettings } | null = null;
const TTL_MS = 30_000;

export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (cached && now - cached.at < TTL_MS) return cached.value;

  if (!process.env.EDGE_CONFIG) {
    cached = { at: now, value: DEFAULT_SETTINGS };
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = await get(KEY);
    if (!raw) {
      cached = { at: now, value: DEFAULT_SETTINGS };
      return DEFAULT_SETTINGS;
    }
    const parsed = siteSettingsSchema.safeParse(raw);
    if (!parsed.success) {
      console.warn("[settings] stored settings failed schema validation — using defaults");
      cached = { at: now, value: DEFAULT_SETTINGS };
      return DEFAULT_SETTINGS;
    }
    cached = { at: now, value: parsed.data };
    return parsed.data;
  } catch (err) {
    console.error("[settings] Edge Config read failed:", err);
    return DEFAULT_SETTINGS;
  }
}

/** Force the next call to bypass the in-memory cache. Used after writes. */
export function invalidateSettingsCache() {
  cached = null;
}
