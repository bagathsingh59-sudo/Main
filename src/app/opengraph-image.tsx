import { ImageResponse } from "next/og";

/**
 * Default Open Graph share image (1200×630) — Next.js convention.
 * Auto-served at /opengraph-image and auto-injected as <meta property="og:image">.
 *
 * NOTE on Satori constraints:
 *   - We avoid comma-stacked radial gradients (Satori parses single gradients).
 *   - We avoid non-ASCII glyphs (₹ etc.) so Satori doesn't try to dynamically
 *     fetch a font for them — we use "Rs " in their place instead.
 */
export const alt = "Vaishnavi Consultants — Tax & Compliance Consulting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundImage:
            "linear-gradient(135deg, #06122a 0%, #0b1f3a 35%, #1442a8 70%, #0e7490 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Glow accent — single radial, no comma-stack */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 600,
            height: 400,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at center, rgba(34,211,238,0.30) 0%, rgba(34,211,238,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 700,
            height: 500,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at center, rgba(58,100,245,0.32) 0%, rgba(58,100,245,0) 70%)",
          }}
        />

        {/* Top: monogram + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, position: "relative" }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: "linear-gradient(135deg, #3a64f5 0%, #22d3ee 100%)",
              boxShadow: "0 14px 44px rgba(58,100,245,0.45)",
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: "-3px",
            }}
          >
            VC
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Vaishnavi Consultants
            </div>
            <div
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.7)",
                marginTop: 4,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Tax · Payroll · EPF · ESI · GST
            </div>
          </div>
        </div>

        {/* Middle: hero line */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              display: "flex",
              flexWrap: "wrap",
              color: "#ffffff",
            }}
          >
            EPF, ESI &amp; Tax compliance — on autopilot.
          </div>
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 860,
              marginTop: 18,
            }}
          >
            850+ Indian businesses · 15+ years of practice · zero-penalty track record.
          </div>
        </div>

        {/* Bottom: stat strip + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: 22 }}>
            {[
              { v: "850+", l: "Clients" },
              { v: "Rs 4,200Cr+", l: "Saved" },
              { v: "0", l: "Penalties" },
              { v: "18", l: "Cities" },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "14px 22px",
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    letterSpacing: "-1px",
                    color: "#ffffff",
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    marginTop: 4,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
              vaishnaviconsultants.in
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              ICAI 010742S · ISO 27001:2022
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
