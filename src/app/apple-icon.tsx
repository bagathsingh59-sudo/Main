import { ImageResponse } from "next/og";

/**
 * Apple touch icon — used when users add the site to iOS home screen.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a56db 0%, #0891b2 100%)",
          color: "#ffffff",
          fontSize: 90,
          fontWeight: 900,
          letterSpacing: "-6px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        VC
      </div>
    ),
    { ...size },
  );
}
