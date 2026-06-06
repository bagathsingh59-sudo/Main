/**
 * Vercel Blob storage hygiene — keep usage well under the 1 GB free
 * cap so there's always headroom for future settings/uploads.
 *
 * Targets:
 *   • TOTAL_BUDGET     1.00 GB (Hobby plan)
 *   • SAFE_LIMIT       0.80 GB (reject new uploads above this; 200 MB reserve)
 *   • WARN_THRESHOLD   0.60 GB (UI warns user)
 *
 * Two cleanup primitives:
 *   • `listOrphans(refs)`  — files in branding/ + blog/ not referenced
 *                            in current settings AND older than 1 hour
 *                            (so in-flight edits aren't yanked away)
 *   • `cleanupOrphans()`   — convenience: runs listOrphans + deletes
 *
 * The settings JSON at vc-config/site-settings.json is never touched
 * by either function.
 */

import { del, list, type ListBlobResult } from "@vercel/blob";
import { getSiteSettings } from "./settings";

export const TOTAL_BUDGET_BYTES = 1024 * 1024 * 1024; // 1 GB Hobby cap
export const SAFE_LIMIT_BYTES = 800 * 1024 * 1024; // 800 MB — 200 MB reserved
export const WARN_THRESHOLD_BYTES = 600 * 1024 * 1024; // 600 MB
export const ORPHAN_AGE_MS = 60 * 60 * 1000; // 1 hour grace window

const SETTINGS_PREFIX = "vc-config/";
const CLEANABLE_PREFIXES = ["branding/", "blog-cover/", "blog/"];

interface BlobInfo {
  pathname: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

interface ListResult {
  blobs: BlobInfo[];
  /** Errors encountered listing (logged, not thrown — callers see what we got). */
  errors: string[];
}

/* ─────────────────  Listing  ─────────────────────────────── */

function isConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/**
 * List every blob under both the cleanable prefixes (branding/, blog/)
 * AND the settings prefix. Auto-paginates if more than 1000 entries
 * exist (Hobby cap is well below that, but defensive).
 */
async function listAll(): Promise<ListResult> {
  if (!isConfigured()) return { blobs: [], errors: ["BLOB_READ_WRITE_TOKEN not set"] };
  const blobs: BlobInfo[] = [];
  const errors: string[] = [];

  const prefixes = [SETTINGS_PREFIX, ...CLEANABLE_PREFIXES];
  for (const prefix of prefixes) {
    let cursor: string | undefined;
    do {
      let res: ListBlobResult;
      try {
        res = await list({ prefix, cursor, limit: 1000 });
      } catch (err) {
        errors.push(`list(${prefix}): ${err instanceof Error ? err.message : "unknown"}`);
        break;
      }
      for (const b of res.blobs) {
        blobs.push({
          pathname: b.pathname,
          url: b.url,
          size: b.size,
          uploadedAt: new Date(b.uploadedAt),
        });
      }
      cursor = res.cursor;
    } while (cursor);
  }

  return { blobs, errors };
}

/* ─────────────────  Stats  ───────────────────────────────── */

export interface BlobStats {
  totalBytes: number;
  totalFiles: number;
  /** Bytes broken down by top-level folder. */
  byFolder: Record<string, { bytes: number; files: number }>;
  /** Budget thresholds for the UI. */
  budgets: {
    safeLimit: number;
    warnThreshold: number;
    totalBudget: number;
  };
  status: "ok" | "warn" | "near-limit" | "over-limit";
  errors: string[];
}

export async function getBlobStats(): Promise<BlobStats> {
  const { blobs, errors } = await listAll();
  const byFolder: Record<string, { bytes: number; files: number }> = {};
  let totalBytes = 0;
  for (const b of blobs) {
    const top = b.pathname.split("/")[0] || "(root)";
    if (!byFolder[top]) byFolder[top] = { bytes: 0, files: 0 };
    byFolder[top].bytes += b.size;
    byFolder[top].files += 1;
    totalBytes += b.size;
  }

  const status: BlobStats["status"] =
    totalBytes >= SAFE_LIMIT_BYTES
      ? "over-limit"
      : totalBytes >= WARN_THRESHOLD_BYTES
        ? "near-limit"
        : totalBytes >= WARN_THRESHOLD_BYTES * 0.75
          ? "warn"
          : "ok";

  return {
    totalBytes,
    totalFiles: blobs.length,
    byFolder,
    budgets: {
      safeLimit: SAFE_LIMIT_BYTES,
      warnThreshold: WARN_THRESHOLD_BYTES,
      totalBudget: TOTAL_BUDGET_BYTES,
    },
    status,
    errors,
  };
}

/* ─────────────────  Orphan detection  ───────────────────── */

/** Collect every URL currently referenced by site settings. */
async function collectReferencedUrls(): Promise<Set<string>> {
  const s = await getSiteSettings();
  const set = new Set<string>();
  const add = (u: string | undefined | null) => {
    if (u && typeof u === "string" && u.startsWith("http")) set.add(u);
  };

  // Branding
  add(s.branding.logoUrl);
  add(s.branding.faviconUrl);
  add(s.branding.ogImageUrl);

  // SEO — global + per-page OG images
  add(s.seo.defaultOgImage);
  for (const page of Object.values(s.seo.pages)) add(page.ogImage);

  // Blog covers + per-post OG overrides
  for (const post of s.blog.posts) {
    add(post.coverImage);
    add(post.seo.ogImage);
  }

  return set;
}

export interface OrphanReport {
  orphans: BlobInfo[];
  bytes: number;
  skippedRecent: number;
  errors: string[];
}

/**
 * Find blobs in cleanable folders that:
 *   1. Are not referenced anywhere in current settings, AND
 *   2. Are older than ORPHAN_AGE_MS (so in-flight edits are safe).
 */
export async function listOrphans(): Promise<OrphanReport> {
  if (!isConfigured()) {
    return { orphans: [], bytes: 0, skippedRecent: 0, errors: ["BLOB_READ_WRITE_TOKEN not set"] };
  }
  const refs = await collectReferencedUrls();
  const { blobs, errors } = await listAll();
  const now = Date.now();
  const orphans: BlobInfo[] = [];
  let bytes = 0;
  let skippedRecent = 0;

  for (const b of blobs) {
    // Never touch the settings JSON or anything under vc-config/.
    if (b.pathname.startsWith(SETTINGS_PREFIX)) continue;
    if (!CLEANABLE_PREFIXES.some((p) => b.pathname.startsWith(p))) continue;
    if (refs.has(b.url)) continue;
    if (now - b.uploadedAt.getTime() < ORPHAN_AGE_MS) {
      skippedRecent++;
      continue;
    }
    orphans.push(b);
    bytes += b.size;
  }
  return { orphans, bytes, skippedRecent, errors };
}

export interface CleanupReport {
  deleted: number;
  reclaimedBytes: number;
  failed: number;
  errors: string[];
}

/**
 * Find orphans and delete them. Failures are counted but don't abort
 * the rest of the deletion run.
 */
export async function cleanupOrphans(): Promise<CleanupReport> {
  const { orphans, errors } = await listOrphans();
  let deleted = 0;
  let reclaimedBytes = 0;
  let failed = 0;
  const failures: string[] = [...errors];

  for (const o of orphans) {
    try {
      await del(o.url);
      deleted++;
      reclaimedBytes += o.size;
    } catch (err) {
      failed++;
      failures.push(`${o.pathname}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }
  return { deleted, reclaimedBytes, failed, errors: failures };
}

/* ─────────────────  Pre-upload guard  ────────────────────── */

export interface QuotaCheck {
  ok: boolean;
  currentBytes: number;
  projectedBytes: number;
  safeLimit: number;
  message?: string;
}

/**
 * Decide whether a new upload of `incomingBytes` would push storage
 * past the safe limit. Conservative — counts current usage as-is.
 */
export async function checkQuotaFor(incomingBytes: number): Promise<QuotaCheck> {
  const stats = await getBlobStats();
  const projectedBytes = stats.totalBytes + incomingBytes;
  if (projectedBytes <= SAFE_LIMIT_BYTES) {
    return {
      ok: true,
      currentBytes: stats.totalBytes,
      projectedBytes,
      safeLimit: SAFE_LIMIT_BYTES,
    };
  }
  return {
    ok: false,
    currentBytes: stats.totalBytes,
    projectedBytes,
    safeLimit: SAFE_LIMIT_BYTES,
    message:
      `Storage budget reached: ${formatMB(stats.totalBytes)} used of ${formatMB(SAFE_LIMIT_BYTES)} safe limit ` +
      `(1 GB total cap, 200 MB reserved). Free up space at /admin/storage before uploading.`,
  };
}

function formatMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
