/**
 * Write site settings to Vercel Edge Config.
 *
 * Edge Config writes go through Vercel's REST API (not the Edge Config
 * SDK, which is read-only). Requires:
 *   • VERCEL_API_TOKEN  — account-level token from vercel.com/account/tokens
 *   • EDGE_CONFIG       — connection string Vercel auto-provisions when
 *                         you link a config store to the project. The
 *                         config id is parsed from this string.
 *
 * Edge Config writes propagate globally in seconds. The reader's
 * 30-second in-memory cache means an admin save may not reflect for
 * up to ~30s in already-warm functions; we invalidate the cache in
 * the writing function instance so saves feel instant there.
 */

import { invalidateSettingsCache } from "./read";
import { siteSettingsSchema, type SiteSettings } from "./types";

const KEY = "siteSettings";

function getConfigId(): string | null {
  const conn = process.env.EDGE_CONFIG;
  if (!conn) return null;
  // EDGE_CONFIG looks like: https://edge-config.vercel.com/ecfg_xxx?token=yyy
  const m = conn.match(/\/(ecfg_[A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

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

  const configId = getConfigId();
  const apiToken = process.env.VERCEL_API_TOKEN;
  if (!configId || !apiToken) {
    return { ok: false, reason: "not_configured", detail: "EDGE_CONFIG and VERCEL_API_TOKEN must be set" };
  }

  const team = process.env.VERCEL_TEAM_ID;
  const url = team
    ? `https://api.vercel.com/v1/edge-config/${configId}/items?teamId=${team}`
    : `https://api.vercel.com/v1/edge-config/${configId}/items`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ operation: "upsert", key: KEY, value: parsed.data }],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, reason: "api_error", detail: `${res.status} ${text}` };
    }

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
