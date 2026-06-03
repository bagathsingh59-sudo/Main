import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Reads the user-supplied brand logo from disk at build time and returns a
 * data-URL suitable for embedding inside `<img>` tags inside `next/og`
 * `ImageResponse` templates.
 *
 * `process.cwd()` resolves to the project root during build / SSR — the
 * `public/` directory is part of the source tree (it is *not* served from the
 * function runtime, but the file IS readable from disk during render).
 */
let cached: string | null = null;

export async function getLogoDataUrl(): Promise<string> {
  if (cached) return cached;
  const buffer = await readFile(join(process.cwd(), "public/brand/logo.png"));
  cached = `data:image/png;base64,${buffer.toString("base64")}`;
  return cached;
}
