import { ImageResponse } from "next/og";
import { getLogoDataUrl } from "@/utils/brandAsset";
import { getSiteSettings } from "@/services/settings";

/**
 * Dynamic favicon — 32x32 PNG that wraps the user-supplied brand logo
 * (transparent, pre-trimmed) on a soft white card so the navy ink stays
 * legible on both light and dark browser tab strips.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const settings = await getSiteSettings();
  // Admin-uploaded favicon takes precedence; falls back to bundled logo.
  const logo = settings.branding.faviconUrl?.trim()
    ? settings.branding.faviconUrl
    : await getLogoDataUrl(64);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderRadius: 6,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={30} height={30} style={{ objectFit: "contain" }} />
      </div>
    ),
    {
      ...size,
      headers: {
        // Short edge cache so admin uploads propagate within minutes
        // rather than the multi-day default. Browsers still cache more
        // aggressively for favicons — see UI notes for the cache-busting
        // workflow.
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
