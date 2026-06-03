import { COMPANY } from "@/constants/company";

/**
 * Canonical production URL — the value that drives every sitemap entry,
 * canonical tag, OG URL and JSON-LD `@id`. **Must** exactly match the
 * verified Search Console property, or sitemap URLs will be rejected.
 *
 * Override per-environment via `NEXT_PUBLIC_SITE_URL` (set in Vercel
 * Project Settings → Environment Variables) without touching code.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vaishnaviconsultant.com";

/* ────────────────────────────────────────────────
   Generic structured-data shape
   ──────────────────────────────────────────────── */
export type JsonLdSchema = Record<string, unknown>;

/* ────────────────────────────────────────────────
   Organisation / brand
   ──────────────────────────────────────────────── */
export const organizationSchema = (): JsonLdSchema => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
  "@id": `${SITE_URL}#organization`,
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  alternateName: COMPANY.shortName,
  description: COMPANY.description,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  image: `${SITE_URL}/opengraph-image`,
  telephone: COMPANY.contact.phone,
  email: COMPANY.contact.email,
  foundingDate: String(COMPANY.foundedYear),
  slogan: COMPANY.tagline,
  numberOfEmployees: { "@type": "QuantitativeValue", value: 120, unitText: "people" },
  knowsAbout: [
    "Tax compliance",
    "Payroll management",
    "EPF compliance",
    "ESI compliance",
    "GST returns",
    "Labour law compliance",
    "Statutory filings",
    "Virtual CFO advisory",
    "TDS filing",
    "Income tax return filing",
  ],
  areaServed: { "@type": "Country", name: "India" },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY.contact.address.line1}, ${COMPANY.contact.address.line2}`,
    addressLocality: COMPANY.contact.address.city,
    addressRegion: COMPANY.contact.address.state,
    postalCode: COMPANY.contact.address.pin,
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: COMPANY.contact.phone,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "kn", "ta", "te"],
    },
    {
      "@type": "ContactPoint",
      telephone: COMPANY.contact.altPhone,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:30",
    closes: "19:00",
  },
  sameAs: Object.values(COMPANY.social),
  award: ["Compliance Firm of the Year — South India, 2024", "Top 50 Tax Consulting Firms in India, 2024"],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", name: "ICAI Registered Firm", credentialCategory: "Professional licence" },
    { "@type": "EducationalOccupationalCredential", name: "ISO 27001:2022", credentialCategory: "Information security certification" },
    { "@type": "EducationalOccupationalCredential", name: "ISO 9001:2015", credentialCategory: "Quality management certification" },
  ],
});

/* ────────────────────────────────────────────────
   Site-wide WebSite (enables sitelinks search)
   ──────────────────────────────────────────────── */
export const websiteSchema = (): JsonLdSchema => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  name: COMPANY.name,
  url: SITE_URL,
  description: COMPANY.description,
  publisher: { "@id": `${SITE_URL}#organization` },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

/* ────────────────────────────────────────────────
   Per-page WebPage
   ──────────────────────────────────────────────── */
export const webPageSchema = (opts: {
  path: string;
  title: string;
  description: string;
}): JsonLdSchema => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}${opts.path}#webpage`,
  url: `${SITE_URL}${opts.path}`,
  name: opts.title,
  description: opts.description,
  isPartOf: { "@id": `${SITE_URL}#website` },
  about: { "@id": `${SITE_URL}#organization` },
  inLanguage: "en-IN",
});

/* ────────────────────────────────────────────────
   Breadcrumbs
   ──────────────────────────────────────────────── */
export const breadcrumbSchema = (
  items: { name: string; path: string }[],
): JsonLdSchema => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

/* ────────────────────────────────────────────────
   FAQ — surfaces "People also ask"
   ──────────────────────────────────────────────── */
export const faqSchema = (faqs: { question: string; answer: string }[]): JsonLdSchema => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

/* ────────────────────────────────────────────────
   Service (one per service) — surfaces in rich results
   ──────────────────────────────────────────────── */
export const serviceListSchema = (services: { id: string; title: string; summary: string }[]): JsonLdSchema => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      "@id": `${SITE_URL}/services#${s.id}`,
      name: s.title,
      description: s.summary,
      provider: { "@id": `${SITE_URL}#organization` },
      areaServed: { "@type": "Country", name: "India" },
    },
  })),
});

/* ────────────────────────────────────────────────
   Article-style schema for resources / case studies
   ──────────────────────────────────────────────── */
export const articleSchema = (a: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  category?: string;
}): JsonLdSchema => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  url: `${SITE_URL}${a.path}`,
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${a.path}` },
  publisher: { "@id": `${SITE_URL}#organization` },
  inLanguage: "en-IN",
  ...(a.datePublished && { datePublished: a.datePublished }),
  ...(a.category && { articleSection: a.category }),
});
