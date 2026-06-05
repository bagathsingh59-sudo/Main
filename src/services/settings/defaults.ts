/**
 * Fallback settings — used when Edge Config isn't configured yet OR
 * when no settings have been saved by an admin yet. Mirrors what was
 * previously hard-coded in `src/constants/` and the API routes.
 */

import { COMPANY } from "@/constants/company";
import { CURRENT_VERSION, type PageSeo, type SiteSettings } from "./types";

const DEFAULT_KEYWORDS = [
  "Tax Consulting India",
  "EPF Compliance",
  "ESI Compliance",
  "Payroll Management",
  "GST Filing",
  "Labour Law Compliance",
  "Virtual CFO",
  "Statutory Filings",
  "TDS Return Filing",
  "Income Tax Return Filing",
  "Vaishnavi Consultant",
  "Compliance Consulting Kalaburagi",
];

function pageSeo(title: string, description: string, extraKeywords: string[] = []): PageSeo {
  return { title, description, keywords: extraKeywords, ogImage: "" };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  version: CURRENT_VERSION,

  automation: {
    autoReplyMode: "immediate",
    notificationTo: "",
    fromName: "",
    fromAddress: "",
  },

  rateLimit: {
    perIpMax: 5,
    perIpWindowMinutes: 10,
    globalMax: 30,
    globalWindowSeconds: 60,
  },

  contactInfo: {
    phone: COMPANY.contact.phone,
    altPhone: COMPANY.contact.altPhone,
    email: COMPANY.contact.email,
    supportEmail: COMPANY.contact.supportEmail,
    addressLine1: COMPANY.contact.address.line1,
    addressLine2: COMPANY.contact.address.line2,
    city: COMPANY.contact.address.city,
    state: COMPANY.contact.address.state,
    pin: COMPANY.contact.address.pin,
    hours: COMPANY.contact.hours,
  },

  formConfig: {
    services: [
      "Payroll & Statutory Compliance",
      "EPF & ESI Compliance",
      "GST Compliance",
      "Income Tax Advisory",
      "Labour Law Compliance",
      "Virtual CFO Advisory",
      "Audit & Assurance",
      "Full Compliance Suite",
    ],
    sizes: ["1-10", "11-50", "51-250", "250+"],
  },

  banner: {
    enabled: false,
    message: "",
    linkUrl: "",
    linkLabel: "",
    tone: "info",
  },

  maintenance: {
    formsDisabled: false,
    message:
      "Our contact forms are briefly offline for maintenance. Please email connect@vaishnaviconsultant.com or call +91 97422 22976 in the meantime.",
  },

  seo: {
    siteName: COMPANY.name,
    titleTemplate: `%s · ${COMPANY.name}`,
    defaultDescription: COMPANY.description,
    defaultKeywords: DEFAULT_KEYWORDS,
    defaultOgImage: "",
    twitterHandle: "@vaishnaviconsult",
    pages: {
      home: pageSeo(
        `${COMPANY.name} — Tax & Compliance Consulting`,
        COMPANY.description,
        ["tax consultant", "compliance services"],
      ),
      about: pageSeo(
        "About Us — Vaishnavi Consultant",
        "Meet the team behind Vaishnavi Consultant — 25+ years of combined practitioner experience across payroll, EPF, ESI, GST, and labour compliance.",
        ["about Vaishnavi", "compliance team", "Kalaburagi consultant"],
      ),
      services: pageSeo(
        "Compliance Services — Payroll, EPF, ESI, GST, Labour Law",
        "End-to-end compliance services for growing Indian businesses. Payroll, EPF, ESI, GST, TDS, income tax, labour law, and virtual CFO advisory.",
        ["compliance services", "payroll outsourcing", "EPF ESI registration"],
      ),
      industries: pageSeo(
        "Industries We Serve — Manufacturing, IT, Healthcare, Retail",
        "Trusted compliance partner for manufacturing, IT, healthcare, retail, and professional services across Karnataka, Telangana, and pan-India.",
        ["industry compliance", "sector-specific compliance"],
      ),
      insights: pageSeo(
        "Insights & Regulatory Updates",
        "Stay ahead of compliance changes — regulatory updates, deadline reminders, case studies, and practical guides from our senior consultants.",
        ["compliance updates", "regulatory news", "tax insights India"],
      ),
      contact: pageSeo(
        "Contact — Book a Free 45-Minute Consultation",
        "Reach Vaishnavi Consultant for a free 45-minute compliance consultation. Senior CA replies within one working day, guaranteed.",
        ["contact Vaishnavi", "book consultation", "compliance advice"],
      ),
    },
  },

  branding: {
    logoUrl: "",
    faviconUrl: "",
    ogImageUrl: "",
  },

  navigation: {
    navbarLinks: [
      { label: "Services", href: "/services", visible: true },
      { label: "Industries", href: "/industries", visible: true },
      { label: "About", href: "/about", visible: true },
      { label: "Insights", href: "/insights", visible: true },
      { label: "Contact", href: "/contact", visible: true },
    ],
    footerColumns: [
      {
        title: "Services",
        links: [
          { label: "Payroll Management", href: "/services#payroll", visible: true },
          { label: "EPF & ESI Compliance", href: "/services#epf-esi", visible: true },
          { label: "GST Advisory", href: "/services#gst", visible: true },
          { label: "Income Tax", href: "/services#income-tax", visible: true },
          { label: "Labour Law Compliance", href: "/services#labour-law", visible: true },
          { label: "CFO Advisory", href: "/services#cfo", visible: true },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about", visible: true },
          { label: "Founder's Message", href: "/about#founder", visible: true },
          { label: "Our Journey", href: "/about#journey", visible: true },
          { label: "Team", href: "/about#team", visible: true },
          { label: "Awards", href: "/about#awards", visible: true },
          { label: "Trust & Security", href: "/about#trust", visible: true },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Compliance Calculator", href: "/services#calculator", visible: true },
          { label: "Blogs & Insights", href: "/insights", visible: true },
          { label: "Latest Updates", href: "/insights#updates", visible: true },
          { label: "Case Studies", href: "/industries#case-studies", visible: true },
          { label: "FAQs", href: "/insights#faq", visible: true },
          { label: "Help Centre", href: "/contact", visible: true },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy", visible: true },
          { label: "Terms of Service", href: "/terms", visible: true },
          { label: "Cookie Policy", href: "/cookies", visible: true },
          { label: "Data Security", href: "/about#trust", visible: true },
          { label: "Disclaimer", href: "/disclaimer", visible: true },
        ],
      },
    ],
    footerTagline: COMPANY.tagline,
    copyright: `© ${new Date().getFullYear()} ${COMPANY.legalName}. All rights reserved.`,
    socialLinks: [
      { platform: "linkedin", url: COMPANY.social.linkedin },
      { platform: "twitter", url: COMPANY.social.twitter },
      { platform: "instagram", url: COMPANY.social.instagram },
      { platform: "youtube", url: COMPANY.social.youtube },
    ],
  },

  emailTemplates: {
    leadNotification: {
      subjectPattern: "New enquiry · {firstName} {lastName} — {service}",
      badge: "New website enquiry",
      titlePattern: "{name} wants to talk about {service}.",
      intro:
        "A new enquiry just landed in your inbox. Reply within one working day to honour the site promise.",
      footerNote: "This is an automated notification from the contact form on vaishnaviconsultant.com.",
    },
    autoReply: {
      subjectPattern: `Thanks for reaching out to ${COMPANY.name}, {firstName}`,
      badge: "We received your message",
      titlePattern: "Thanks for reaching out, {firstName}.",
      intro:
        "Your message landed safely with our team. A senior consultant has read it personally and will reply to you within one working day — that's a promise we honour for every enquiry.",
      introSecondary: "In the meantime, here's what happens next:",
      steps: [
        { when: "Within 24 hours", description: "A senior consultant studies your context and emails you back with first thoughts." },
        { when: "Within 3 days", description: "We schedule a free 45-minute compliance audit if it's a fit." },
        { when: "No pressure", description: "No sales follow-up unless you ask for one. We mean it." },
      ],
      phoneFallback:
        "If you'd rather talk first, our partners are reachable directly on {phone}, {hours}.",
      footerNote:
        "You're receiving this because you sent us an enquiry through vaishnaviconsultant.com. We don't share your details with anyone outside our team.",
    },
  },
};
