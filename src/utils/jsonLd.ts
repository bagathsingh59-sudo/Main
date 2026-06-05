import { COMPANY } from "@/constants/company";
import type { Branding, ContactInfo, Navigation } from "@/services/settings";

interface SchemaOverrides {
  contactInfo?: ContactInfo;
  branding?: Branding;
  navigation?: Navigation;
}

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
export const organizationSchema = (overrides: SchemaOverrides = {}): JsonLdSchema => {
  const ci = overrides.contactInfo;
  const phone = ci?.phone || COMPANY.contact.phone;
  const altPhone = ci?.altPhone || COMPANY.contact.altPhone;
  const email = ci?.email || COMPANY.contact.email;
  const line1 = ci?.addressLine1 || COMPANY.contact.address.line1;
  const line2 = ci?.addressLine2 || COMPANY.contact.address.line2;
  const city = ci?.city || COMPANY.contact.address.city;
  const state = ci?.state || COMPANY.contact.address.state;
  const pin = ci?.pin || COMPANY.contact.address.pin;
  const logo = overrides.branding?.logoUrl || `${SITE_URL}/brand/logo.png`;
  const ogImage = overrides.branding?.ogImageUrl || `${SITE_URL}/opengraph-image`;
  // Pull social URLs from admin if any are set; fall back to COMPANY constants.
  const socialUrls =
    overrides.navigation?.socialLinks?.filter((s) => s.url).map((s) => s.url) ?? Object.values(COMPANY.social);

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}#organization`,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    alternateName: COMPANY.shortName,
    description: COMPANY.description,
    url: SITE_URL,
    logo,
    image: ogImage,
    telephone: phone,
    email,
    foundingDate: String(COMPANY.foundedYear),
    slogan: COMPANY.tagline,
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 10, unitText: "people" },
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
      streetAddress: `${line1}, ${line2}`,
      addressLocality: city,
      addressRegion: state,
      postalCode: pin,
      addressCountry: "IN",
    },
    contactPoint: [
      { "@type": "ContactPoint", telephone: phone, contactType: "customer service", areaServed: "IN", availableLanguage: ["en", "hi", "kn", "te"] },
      { "@type": "ContactPoint", telephone: altPhone, contactType: "sales", areaServed: "IN", availableLanguage: ["en", "hi", "kn"] },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "19:00",
    },
    sameAs: socialUrls,
  };
};

/* ────────────────────────────────────────────────
   LocalBusiness — explicit local-SEO schema
   Helps appear in Google Maps & local-pack listings.
   ──────────────────────────────────────────────── */
export const localBusinessSchema = (overrides: SchemaOverrides = {}): JsonLdSchema => {
  const ci = overrides.contactInfo;
  const phone = ci?.phone || COMPANY.contact.phone;
  const line1 = ci?.addressLine1 || COMPANY.contact.address.line1;
  const line2 = ci?.addressLine2 || COMPANY.contact.address.line2;
  const city = ci?.city || COMPANY.contact.address.city;
  const state = ci?.state || COMPANY.contact.address.state;
  const pin = ci?.pin || COMPANY.contact.address.pin;

  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": `${SITE_URL}#localbusiness`,
    name: COMPANY.name,
    image: overrides.branding?.logoUrl || `${SITE_URL}/brand/logo.png`,
    priceRange: "₹₹",
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${line1}, ${line2}`,
      addressLocality: city,
      addressRegion: state,
      postalCode: pin,
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "19:00",
    },
    areaServed: COMPANY.contact.serviceAreas.map((area) => ({ "@type": "City", name: area })),
  };
};

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
