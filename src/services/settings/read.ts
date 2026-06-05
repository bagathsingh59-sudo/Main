/**
 * Read site settings from Vercel Edge Config with a safe defaults
 * fallback. The reader never throws — site rendering must never break
 * because of a config issue. Worst case, defaults are used.
 */

import { get } from "@vercel/edge-config";
import { DEFAULT_SETTINGS } from "./defaults";
import { siteSettingsSchema, type SiteSettings } from "./types";

const KEY = "siteSettings";

/**
 * Forward-migrate older stored shapes into the current schema. We
 * keep this lenient: anything that matches a current sub-schema is
 * preserved; everything else falls back to defaults. That way the
 * admin's previously saved automation/contact-info edits survive
 * across schema bumps.
 */
function migrate(raw: unknown): SiteSettings {
  if (!raw || typeof raw !== "object") return DEFAULT_SETTINGS;
  const obj = raw as Record<string, unknown>;
  const merged: SiteSettings = {
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
  };
  return merged;
}

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
    console.error("[settings] Edge Config read failed:", err);
    return DEFAULT_SETTINGS;
  }
}

/** Force the next call to bypass the in-memory cache. Used after writes. */
export function invalidateSettingsCache() {
  cached = null;
}
