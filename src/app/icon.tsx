import { ImageResponse } from "next/og";
import { getLogoDataUrl } from "@/utils/brandAsset";

/**
 * Dynamic favicon — 32x32 PNG that wraps the user-supplied brand logo.
 * Auto-injected into <head> as <link rel="icon">.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const logo = await getLogoDataUrl();

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
        <img
          src={logo}
          alt=""
          width={28}
          height={28}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
