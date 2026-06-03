import { ImageResponse } from "next/og";

/**
 * Dynamic 32x32 favicon — Next.js convention.
 * Auto-injected into <head> as <link rel="icon">.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: "-1px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        VC
      </div>
    ),
    { ...size },
  );
}
