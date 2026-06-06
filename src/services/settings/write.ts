/**
 * Write site settings to Vercel Blob (single JSON file).
 *
 * Migrated from Vercel Edge Config because Hobby Edge Config caps a
 * single item at ~8 KB. Blob has no such cap (1 GB free), already-
 * configured BLOB_READ_WRITE_TOKEN handles both reads & writes, and
 * the JSON file lives at a deterministic public URL.
 */

import { put } from "@vercel/blob";
import { invalidateSettingsCache, SETTINGS_BLOB_PATHNAME } from "./read";
import { siteSettingsSchema, type SiteSettings } from "./types";

export type WriteResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "validation" | "api_error"; detail?: string };

export async function updateSiteSettings(next: SiteSettings): Promise<WriteResult> {
  const parsed = siteSettingsSchema.safeParse(next);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "validation",
      detail: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      reason: "not_configured",
      detail: "BLOB_READ_WRITE_TOKEN env var must be set. In Vercel: Storage → Blob → Connect to project.",
    };
  }

  try {
    await put(SETTINGS_BLOB_PATHNAME, JSON.stringify(parsed.data), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    invalidateSettingsCache();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "api_error",
      detail: err instanceof Error ? err.message : "unknown",
    };
  }
}
