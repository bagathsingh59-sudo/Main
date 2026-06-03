import type { Metadata } from "next";
import { COMPANY } from "@/constants/company";

const SITE_URL = "https://vaishnaviconsultants.in";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} — Tax & Compliance Consulting`,
    template: `%s · ${COMPANY.name}`,
  },
  description: COMPANY.description,
  applicationName: COMPANY.name,
  authors: [{ name: COMPANY.name, url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "Tax Consulting India",
    "EPF Compliance",
    "ESI Compliance",
    "Payroll Management Bangalore",
    "GST Filing",
    "Labour Law Compliance",
    "Virtual CFO",
    "Statutory Filings",
    "Vaishnavi Consultants",
  ],
  alternates: { canonical: "/" },
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
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  description: COMPANY.description,
  url: SITE_URL,
  telephone: COMPANY.contact.phone,
  email: COMPANY.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY.contact.address.line1}, ${COMPANY.contact.address.line2}`,
    addressLocality: COMPANY.contact.address.city,
    addressRegion: COMPANY.contact.address.state,
    postalCode: COMPANY.contact.address.pin,
    addressCountry: "IN",
  },
  foundingDate: String(COMPANY.foundedYear),
  areaServed: "India",
  sameAs: Object.values(COMPANY.social),
};
