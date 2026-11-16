/**
 * PostgreSQL connection + schema for admin-editable data.
 *
 *   DATABASE_URL=postgresql://user:password@host:5432/dbname
 *
 * When DATABASE_URL is set, site settings and uploaded images live in
 * PostgreSQL (see settings/read.ts, settings/write.ts, media.ts). Without
 * it the older Vercel Blob / JSON-file stores are used.
 *
 * Tables (created automatically on first use, safe to run repeatedly):
 *   site_settings  one row per settings document (key 'site'), JSONB
 *   media          uploaded files: bytes + content type, keyed by path
 */

import { Pool } from "pg";

export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

/* One pool per server process — reused across hot reloads in dev. */
const globalForDb = globalThis as unknown as { __vcPool?: Pool; __vcSchema?: Promise<void> };

function pool(): Pool {
  if (!globalForDb.__vcPool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    globalForDb.__vcPool = new Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 30_000,
      // Managed databases usually require TLS; a local / private-network one does not.
      ssl: /sslmode=require/.test(url) ? { rejectUnauthorized: false } : undefined,
    });
  }
  return globalForDb.__vcPool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS site_settings (
  key        text PRIMARY KEY,
  data       jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS media (
  pathname     text PRIMARY KEY,
  content_type text NOT NULL,
  size         integer NOT NULL,
  data         bytea NOT NULL,
  uploaded_at  timestamptz NOT NULL DEFAULT now()
);
`;

/** Create the tables once per process. */
function ensureSchema(): Promise<void> {
  if (!globalForDb.__vcSchema) {
    globalForDb.__vcSchema = pool()
      .query(SCHEMA)
      .then(() => undefined)
      .catch((err) => {
        globalForDb.__vcSchema = undefined; // retry on the next call
        throw err;
      });
  }
  return globalForDb.__vcSchema;
}

/** Run a parameterised query after making sure the schema exists. */
export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  await ensureSchema();
  const res = await pool().query(text, params);
  return res.rows as T[];
}
