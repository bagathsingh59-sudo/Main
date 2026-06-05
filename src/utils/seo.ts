import type { Metadata } from "next";
import { COMPANY } from "@/constants/company";
import { getSiteSettings, type SeoPageKey } from "@/services/settings";
import { SITE_URL } from "./jsonLd";

export { SITE_URL } from "./jsonLd";
// Re-export for backwards compatibility
export { organizationSchema as organizationJsonLd } from "./jsonLd";

const DEFAULT_KEYWORDS = [
  "Tax Consulting India",
  "EPF Compliance",
  "ESI Compliance",
  "Payroll Management Bangalore",
  "GST Filing",
  "Labour Law Compliance",
  "Virtual CFO",
  "Statutory Filings",
  "TDS Return Filing",
  "Income Tax Return Filing",
  "Vaishnavi Consultants",
  "Compliance Consulting Bengaluru",
];

/* ────────────────────────────────────────────────
   Root site metadata — applied to <RootLayout>
   ──────────────────────────────────────────────── */
export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} — Tax & Compliance Consulting`,
    template: `%s · ${COMPANY.name}`,
  },
  description: COMPANY.description,
  applicationName: COMPANY.name,
  authors: [{ name: COMPANY.name, url: SITE_URL }],
  creator: COMPANY.name,
  publisher: COMPANY.legalName,
  generator: "Next.js",
  keywords: DEFAULT_KEYWORDS,
  category: "Business · Tax & Compliance Consulting",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/" },
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description: COMPANY.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description: COMPANY.description,
    creator: "@vaishnaviconsult",
    site: "@vaishnaviconsult",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /**
   * Search-engine verification — replace the placeholder values with real codes
   * from Search Console / Bing Webmaster Tools / Yandex etc.
   * Falls back to env vars so CI/CD can inject per-environment values.
   */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "google-site-verification=REPLACE_ME",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION ?? "",
      "facebook-domain-verification": process.env.NEXT_PUBLIC_FACEBOOK_VERIFICATION ?? "",
    },
  },
  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "32x32" },
      { url: "/brand/logo.png", type: "image/png", sizes: "1600x1444" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon"],
  },
  formatDetection: { telephone: true, email: true, address: true },
};

/* ────────────────────────────────────────────────
   Per-page metadata factory
   ──────────────────────────────────────────────── */
interface PageMetaOpts {
  title: string;
  description: string;
  /** Path without trailing slash, e.g. "/services". */
  path: string;
  keywords?: string[];
  imageAlt?: string;
}

export function buildPageMetadata({ title, description, path, keywords, imageAlt }: PageMetaOpts): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...(keywords ?? [])],
    alternates: { canonical: path, languages: { "en-IN": path } },
    openGraph: {
      type: "website",
      url,
      siteName: COMPANY.name,
      title: `${title} · ${COMPANY.name}`,
      description,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${COMPANY.name}`,
      description,
      site: "@vaishnaviconsult",
    },
    other: imageAlt ? { "og:image:alt": imageAlt } : undefined,
  };
}

/**
 * Build metadata for a page driven by admin-editable settings. Each page
 * calls this from its `generateMetadata()` function. Static fallbacks in
 * `buildPageMetadata` remain available for pages that don't (yet) have
 * an entry under `seo.pages`.
 */
export async function buildPageMetadataFromSettings(
  pageKey: SeoPageKey,
  path: string,
): Promise<Metadata> {
  const settings = await getSiteSettings();
  const { seo } = settings;
  const page = seo.pages[pageKey];

  const title = page.title || seo.titleTemplate.replace("%s", pageKey);
  const description = page.description || seo.defaultDescription;
  const allKeywords = [...seo.defaultKeywords, ...page.keywords];
  const ogImage = page.ogImage || seo.defaultOgImage;
  const url = `${SITE_URL}${path}`;
  const titleWithSite = title.includes(seo.siteName) ? title : `${title} · ${seo.siteName}`;

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: { canonical: path, languages: { "en-IN": path } },
    openGraph: {
      type: "website",
      url,
      siteName: seo.siteName,
      title: titleWithSite,
      description,
      locale: "en_IN",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titleWithSite,
      description,
      site: seo.twitterHandle || "@vaishnaviconsult",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
