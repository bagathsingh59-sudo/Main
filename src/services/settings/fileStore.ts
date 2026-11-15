/**
 * Local JSON-file store for site settings.
 *
 * Used when `SETTINGS_FILE` is set and no Vercel Blob token is present:
 * local development, and self-hosting (Docker / Dokploy — mount the
 * folder as a volume so saves survive redeploys) until settings move to
 * PostgreSQL.
 *
 *   SETTINGS_FILE=.data/site-settings.json
 *
 * Relative paths resolve from the app's working directory.
 *
 * The settings module is also imported by client components (for its
 * schemas), so Node built-ins are loaded lazily and hidden from the
 * bundler — they only ever run on the server.
 */

type Fs = typeof import("node:fs/promises");
type Path = typeof import("node:path");

const loadFs = () => import(/* webpackIgnore: true */ "node:fs/promises") as Promise<Fs>;
const loadPath = () => import(/* webpackIgnore: true */ "node:path") as Promise<Path>;

/** Settings file as configured, or null when file storage is off. */
export function settingsFilePath(): string | null {
  if (process.env.BLOB_READ_WRITE_TOKEN) return null; // Blob wins when configured
  return process.env.SETTINGS_FILE?.trim() || null;
}

async function resolve(file: string) {
  const path = await loadPath();
  return path.resolve(process.cwd(), file);
}

/** Parsed JSON, or null when nothing has been saved yet. */
export async function readSettingsFile(file: string): Promise<unknown | null> {
  const fs = await loadFs();
  try {
    return JSON.parse(await fs.readFile(await resolve(file), "utf8")) as unknown;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

/** Atomic write: temp file + rename, so a crash never leaves half a file. */
export async function writeSettingsFile(file: string, data: unknown): Promise<void> {
  const [fs, path] = await Promise.all([loadFs(), loadPath()]);
  const target = await resolve(file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target);
}
