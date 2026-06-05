import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteMetadata } from "@/utils/seo";
import { organizationSchema, websiteSchema } from "@/utils/jsonLd";
import { JsonLd } from "@/components/shared/JsonLd";
import "./globals.css";

/**
 * GA4 Measurement ID. Defaults to the production property
 * `G-G7S430DQW4` but can be overridden per-environment via
 * `NEXT_PUBLIC_GA_ID` (e.g. a staging measurement ID in Preview deploys).
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-G7S430DQW4";

// Only the weights actually used in the codebase — drops ~80 KB of font bytes
// vs. shipping the full 300-900 range. `font-light` (300) and `font-black`
// (900) are not referenced anywhere.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// Every `<em>` in the codebase has `not-italic` applied, so DM Serif's italic
// variant is never rendered — shipping only the normal style.
const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef2ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1f3a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${display.variable}`}>
      <head>
        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Site-wide structured data */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        {children}
        {/* Vercel — Web Analytics (pageviews) + Speed Insights (Core Web Vitals) */}
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics 4 — Search-Console-associable property. The
            @next/third-parties wrapper defers the gtag script until after
            hydration so LCP / first paint are not impacted. */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
