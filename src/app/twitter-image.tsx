/**
 * Twitter card image — same 1200×630 frame as the OG image.
 * Next.js auto-injects this as <meta name="twitter:image">.
 *
 * Re-exports the OG component to keep a single source of truth for the share
 * artwork (size, alt text, layout).
 */
export { default, alt, size, contentType } from "./opengraph-image";
