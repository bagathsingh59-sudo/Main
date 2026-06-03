#!/usr/bin/env node
/**
 * One-shot logo processor.
 *
 * Reads the original raster logo at public/brand/logo-raw.png (the user's
 * uploaded asset), removes the white background via a soft alpha threshold,
 * trims surrounding whitespace and emits a clean transparent PNG plus a few
 * pre-sized variants used by the icon / manifest / PWA flows.
 *
 * Run with:  node scripts/process-logo.mjs
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { copyFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "public", "brand");

// If logo-raw.png doesn't exist yet, seed it from whatever the existing logo.png is —
// so re-runs keep working without depending on the original 1MB Logo-svg.svg.
const RAW = join(brandDir, "logo-raw.png");
if (!existsSync(RAW)) {
  await mkdir(brandDir, { recursive: true });
  await copyFile(join(brandDir, "logo.png"), RAW);
  console.log("· seeded logo-raw.png from current logo.png");
}

// ──────────────────────────────────────────────────
// 1. Chroma-key the white background out
// ──────────────────────────────────────────────────
const src = sharp(RAW).ensureAlpha();
const { data, info } = await src.raw().toBuffer({ resolveWithObject: true });

const buf = Buffer.from(data);
const channels = info.channels; // expected to be 4 after ensureAlpha

// Soft threshold — pixels brighter than `floor` become semi/fully transparent.
// Using max(r,g,b) catches both pure-white and bright-cream regions while
// preserving the navy + gold ink, which never goes above this value.
const FLOOR = 232;
for (let i = 0; i < buf.length; i += channels) {
  const r = buf[i];
  const g = buf[i + 1];
  const b = buf[i + 2];
  const m = Math.max(r, g, b);
  if (m >= FLOOR) {
    const alpha = Math.max(0, Math.round(((255 - m) * 255) / (255 - FLOOR)));
    buf[i + 3] = alpha;
  }
}

const transparent = sharp(buf, {
  raw: { width: info.width, height: info.height, channels },
});

// ──────────────────────────────────────────────────
// 2. Trim surrounding alpha, then emit variants
// ──────────────────────────────────────────────────
const trimmed = await transparent
  .clone()
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 5 })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(trimmed).toFile(join(brandDir, "logo.png"));
console.log("✓ public/brand/logo.png  (transparent, trimmed)");

const sizes = [
  { px: 512, name: "logo-512.png" },
  { px: 256, name: "logo-256.png" },
  { px: 180, name: "logo-180.png" },
  { px: 128, name: "logo-128.png" },
  { px: 64, name: "logo-64.png" },
  { px: 32, name: "logo-32.png" },
];

for (const { px, name } of sizes) {
  await sharp(trimmed)
    .resize(px, px, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(join(brandDir, name));
  console.log(`✓ public/brand/${name}`);
}

console.log("\nDone. Re-run anytime after replacing logo-raw.png with a fresh upload.");
