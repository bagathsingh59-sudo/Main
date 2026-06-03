import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Reads a pre-rendered transparent variant of the brand logo from disk at
 * build time and returns a data-URL suitable for `<img>` tags inside
 * `next/og` `ImageResponse` templates.
 *
 * The variants are produced by `scripts/process-logo.mjs` — drop a fresh
 * `public/brand/logo-raw.png` and re-run the script to refresh every size.
 */
export type LogoSize = 32 | 64 | 128 | 180 | 256 | 512 | "full";

const cache = new Map<LogoSize, string>();

export async function getLogoDataUrl(size: LogoSize = "full"): Promise<string> {
  const cached = cache.get(size);
  if (cached) return cached;

  const filename = size === "full" ? "logo.png" : `logo-${size}.png`;
  const buffer = await readFile(join(process.cwd(), "public", "brand", filename));
  const url = `data:image/png;base64,${buffer.toString("base64")}`;
  cache.set(size, url);
  return url;
}
