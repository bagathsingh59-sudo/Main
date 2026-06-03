import { ImageResponse } from "next/og";
import { getLogoDataUrl } from "@/utils/brandAsset";

/**
 * Apple touch icon (180×180) — embeds the actual transparent Vaishnavi logo
 * over a white background so iOS home-screen icons render crisply with the
 * standard rounded mask.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logo = await getLogoDataUrl(256);

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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={154} height={154} style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...size },
  );
}
