#!/usr/bin/env node
/**
 * Copy site settings (and the images they reference) from Vercel Blob
 * into PostgreSQL.
 *
 *   node --env-file=.env.local scripts/db/import-settings.mjs <settings.json URL or file>
 *
 *   e.g. https://<store>.public.blob.vercel-storage.com/vc-config/site-settings.json
 *
 * • Every https://<store>.public.blob.vercel-storage.com/... URL found in
 *   the settings is downloaded into the `media` table and rewritten to
 *   /media/<same path>, so pages keep showing the same images.
 * • The settings document is upserted as row 'site' in `site_settings`.
 * • Files that no longer exist on Blob (HTTP 404) are cleared from the
 *   settings (set to ""), so pages fall back to their defaults instead of
 *   showing broken images. They are listed so they can be re-uploaded.
 * • Safe to run again: rows are overwritten, never duplicated.
 *
 * Needs DATABASE_URL. The app creates the tables on first use; this
 * script creates them too, so it can run before the app ever starts.
 */
import { readFile } from "node:fs/promises";
import pg from "pg";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node --env-file=.env.local scripts/db/import-settings.mjs <settings.json URL or file>");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const BLOB_URL = /https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[^\s"'<>)]+/gi;

const raw = /^https?:/.test(source) ? await (await fetch(source, { cache: "no-store" })).text() : await readFile(source, "utf8");
let settings = JSON.parse(raw);

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: /sslmode=require/.test(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : undefined });
await pool.query(`
  CREATE TABLE IF NOT EXISTS site_settings (key text PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE IF NOT EXISTS media (pathname text PRIMARY KEY, content_type text NOT NULL, size integer NOT NULL, data bytea NOT NULL, uploaded_at timestamptz NOT NULL DEFAULT now());
`);

/* Copy every referenced upload into the media table. */
const urls = [...new Set(JSON.stringify(settings).match(BLOB_URL) ?? [])];
const rewrite = new Map();
let copied = 0;
for (const url of urls) {
  const pathname = decodeURIComponent(new URL(url).pathname.replace(/^\//, ""));
  if (pathname.startsWith("vc-config/")) continue;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  missing on Blob (HTTP ${res.status}), cleared — re-upload: ${pathname}`);
    rewrite.set(url, "");
    continue;
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  const type = res.headers.get("content-type") || "application/octet-stream";
  await pool.query(
    `INSERT INTO media (pathname, content_type, size, data) VALUES ($1, $2, $3, $4)
     ON CONFLICT (pathname) DO UPDATE SET content_type = EXCLUDED.content_type, size = EXCLUDED.size, data = EXCLUDED.data, uploaded_at = now()`,
    [pathname, type, bytes.length, bytes],
  );
  rewrite.set(url, `/media/${pathname}`);
  copied++;
  console.log(`  copied ${pathname} (${(bytes.length / 1024).toFixed(0)} KB)`);
}

/* Point the settings at the copied files. */
let json = JSON.stringify(settings);
for (const [from, to] of rewrite) json = json.split(from).join(to);
settings = JSON.parse(json);

await pool.query(
  `INSERT INTO site_settings (key, data, updated_at) VALUES ('site', $1::jsonb, now())
   ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
  [JSON.stringify(settings)],
);
await pool.end();
console.log(`Imported settings (version ${settings.version ?? "?"}) and ${copied} file(s) into PostgreSQL.`);
