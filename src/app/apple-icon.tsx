import { ImageResponse } from "next/og";
import { getLogoDataUrl } from "@/utils/brandAsset";

/**
 * Apple touch icon — used when users add the site to iOS home screen.
 * Embeds the user's actual brand logo so the home-screen shortcut shows the
 * Vaishnavi mark instead of a screenshot of the page.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt=""
          width={150}
          height={150}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
