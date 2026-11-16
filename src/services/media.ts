/**
 * Uploaded files (logos, favicons, blog covers, team photos …).
 *
 *   DATABASE_URL set → bytes in the PostgreSQL `media` table, served by
 *                      the /media/[...path] route as `/media/<pathname>`
 *   otherwise        → Vercel Blob (public URL on *.blob.vercel-storage.com)
 *
 * Callers only see `{ url, pathname }`, so pages and settings work the
 * same with either store.
 */

import { del, list, put, type ListBlobResult } from "@vercel/blob";
import { isDbConfigured, query } from "./db";

export const MEDIA_ROUTE = "/media/";

export interface MediaInfo {
  pathname: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export function isMediaConfigured(): boolean {
  return isDbConfigured() || !!process.env.BLOB_READ_WRITE_TOKEN;
}

export const mediaUrl = (pathname: string) => `${MEDIA_ROUTE}${pathname}`;

/** Store a file; returns the URL to save in settings. */
export async function putMedia(pathname: string, file: Blob, contentType: string): Promise<{ url: string; pathname: string }> {
  if (isDbConfigured()) {
    const bytes = Buffer.from(await file.arrayBuffer());
    await query(
      `INSERT INTO media (pathname, content_type, size, data, uploaded_at) VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (pathname) DO UPDATE SET content_type = EXCLUDED.content_type, size = EXCLUDED.size, data = EXCLUDED.data, uploaded_at = now()`,
      [pathname, contentType, bytes.length, bytes],
    );
    return { url: mediaUrl(pathname), pathname };
  }
  const blob = await put(pathname, file, { access: "public", contentType, addRandomSuffix: false });
  return { url: blob.url, pathname: blob.pathname };
}

/** One stored file with its bytes (database store only). */
export async function getMedia(pathname: string): Promise<{ contentType: string; data: Buffer; uploadedAt: Date } | null> {
  if (!isDbConfigured()) return null;
  const rows = await query<{ content_type: string; data: Buffer; uploaded_at: Date }>(
    "SELECT content_type, data, uploaded_at FROM media WHERE pathname = $1",
    [pathname],
  );
  return rows[0] ? { contentType: rows[0].content_type, data: rows[0].data, uploadedAt: rows[0].uploaded_at } : null;
}

/** Every file under the given folder prefixes. Errors are collected, not thrown. */
export async function listMedia(prefixes: string[]): Promise<{ files: MediaInfo[]; errors: string[] }> {
  const files: MediaInfo[] = [];
  const errors: string[] = [];

  if (isDbConfigured()) {
    try {
      const rows = await query<{ pathname: string; size: number; uploaded_at: Date }>(
        "SELECT pathname, size, uploaded_at FROM media WHERE pathname LIKE ANY($1) ORDER BY uploaded_at DESC",
        [prefixes.map((p) => `${p.replace(/[%_]/g, "\\$&")}%`)],
      );
      for (const r of rows) files.push({ pathname: r.pathname, url: mediaUrl(r.pathname), size: r.size, uploadedAt: new Date(r.uploaded_at) });
    } catch (err) {
      errors.push(`media: ${err instanceof Error ? err.message : "unknown"}`);
    }
    return { files, errors };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) return { files, errors: ["No media store configured (DATABASE_URL or BLOB_READ_WRITE_TOKEN)"] };
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
      for (const b of res.blobs) files.push({ pathname: b.pathname, url: b.url, size: b.size, uploadedAt: new Date(b.uploadedAt) });
      cursor = res.cursor;
    } while (cursor);
  }
  return { files, errors };
}

/** Delete one file by the URL that was handed out for it. */
export async function deleteMedia(url: string): Promise<void> {
  if (isDbConfigured()) {
    const pathname = url.startsWith(MEDIA_ROUTE) ? url.slice(MEDIA_ROUTE.length) : null;
    if (!pathname) throw new Error("Not a database media URL");
    await query("DELETE FROM media WHERE pathname = $1", [decodeURIComponent(pathname)]);
    return;
  }
  await del(url);
}
