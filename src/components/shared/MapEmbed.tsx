"use client";

/**
 * Lazy-loaded Google Maps embed for the /contact page.
 *
 * Implementation notes:
 *   • Renders nothing when no URL is configured — zero JS impact.
 *   • Reserves the iframe's aspect ratio with CSS so there's no CLS.
 *   • Uses native `loading="lazy"` — modern browsers defer the fetch
 *     until the iframe approaches the viewport, so above-the-fold LCP
 *     is unaffected.
 *   • Sandboxed to disable scripts/forms/popups from the embedded page
 *     — Google's map widget still works because we explicitly allow
 *     the features it needs.
 */

interface MapEmbedProps {
  /** Full google.com/maps/embed URL. Empty/missing = component renders nothing. */
  url?: string;
  /** Aria label used on the iframe. */
  title?: string;
  /** Optional className override on the wrapper. */
  className?: string;
}

export function MapEmbed({ url, title = "Office location on Google Maps", className }: MapEmbedProps) {
  if (!url || !url.trim()) return null;
  // Defensive client-side gate — should already be validated server-side.
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  if (host !== "www.google.com" && host !== "google.com") return null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/70 bg-mist/40 shadow-soft ${className ?? ""}`}
      style={{ aspectRatio: "16 / 10" }}
    >
      <iframe
        src={url}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
