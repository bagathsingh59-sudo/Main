/**
 * Runtime-editable site settings.
 *
 * Stored in Vercel Edge Config. The shape is versioned so we can safely
 * migrate when fields are added/renamed without breaking running
 * deployments — the reader falls back to defaults if the stored version
 * doesn't match.
 */

import { z } from "zod";

export const CURRENT_VERSION = 2 as const;

/* ─────────────────────────  schemas  ─────────────────────── */

export const automationSchema = z.object({
  /**
   * Lead → auto-reply behaviour.
   *  • manual    — staff must click the green Approve button in the
   *                notification email before the lead receives a reply.
   *  • immediate — auto-reply fires the moment the form is submitted.
   *                Notification email shows "Auto-reply sent ✓" badge
   *                and keeps the blue Reply mailto button so staff can
   *                still send a personal follow-up.
   */
  autoReplyMode: z.enum(["manual", "immediate"]),
  /** Override LEAD_TO env var when set. Empty string = use env default. */
  notificationTo: z.string(),
  /** Override MAIL_FROM_NAME env var when set. Empty = use env default. */
  fromName: z.string(),
  /** Override MAIL_FROM_ADDRESS env var when set. Empty = use env default. */
  fromAddress: z.string(),
});

export const rateLimitSchema = z.object({
  perIpMax: z.number().int().min(1).max(100),
  perIpWindowMinutes: z.number().int().min(1).max(120),
  globalMax: z.number().int().min(1).max(500),
  globalWindowSeconds: z.number().int().min(10).max(600),
});

export const contactInfoSchema = z.object({
  phone: z.string(),
  altPhone: z.string(),
  email: z.string(),
  supportEmail: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  state: z.string(),
  pin: z.string(),
  hours: z.string(),
});

export const formConfigSchema = z.object({
  /** Service options shown in the contact form dropdown. */
  services: z.array(z.string().min(1).max(80)).min(1).max(20),
  /** Company-size brackets shown in the contact form. */
  sizes: z.array(z.string().min(1).max(40)).min(1).max(10),
});

export const bannerSchema = z.object({
  enabled: z.boolean(),
  message: z.string().max(200),
  linkUrl: z.string(),
  linkLabel: z.string().max(40),
  tone: z.enum(["info", "warning", "success"]),
});

export const maintenanceSchema = z.object({
  /** When true, contact form returns 503 with a polite message. */
  formsDisabled: z.boolean(),
  message: z.string().max(280),
});

/* ── SEO ─────────────────────────────────────────────────── */

export const pageSeoSchema = z.object({
  title: z.string().max(70),
  description: z.string().max(200),
  keywords: z.array(z.string().min(1).max(60)).max(15),
  ogImage: z.string(),
});

export const seoSchema = z.object({
  siteName: z.string().max(60),
  titleTemplate: z.string().max(80),
  defaultDescription: z.string().max(200),
  defaultKeywords: z.array(z.string().min(1).max(60)).max(15),
  defaultOgImage: z.string(),
  twitterHandle: z.string().max(40),
  pages: z.object({
    home: pageSeoSchema,
    about: pageSeoSchema,
    services: pageSeoSchema,
    industries: pageSeoSchema,
    insights: pageSeoSchema,
    contact: pageSeoSchema,
  }),
});

/* ── Branding ────────────────────────────────────────────── */

export const brandingSchema = z.object({
  /** URL of uploaded logo (overrides bundled /public/brand/logo.png). */
  logoUrl: z.string(),
  /** URL of uploaded favicon. Empty = bundled default. */
  faviconUrl: z.string(),
  /** Default Open Graph image (1200×630). Empty = bundled default. */
  ogImageUrl: z.string(),
});

/* ── Navigation (navbar + footer) ────────────────────────── */

export const navLinkSchema = z.object({
  label: z.string().min(1).max(40),
  href: z.string().min(1).max(200),
  /** When false, link is hidden from the public site. */
  visible: z.boolean(),
});

export const footerColumnSchema = z.object({
  title: z.string().min(1).max(30),
  links: z.array(navLinkSchema).max(10),
});

export const socialLinkSchema = z.object({
  platform: z.enum(["linkedin", "twitter", "instagram", "youtube", "facebook"]),
  url: z.string(),
});

export const navigationSchema = z.object({
  navbarLinks: z.array(navLinkSchema).max(8),
  footerColumns: z.array(footerColumnSchema).max(4),
  footerTagline: z.string().max(160),
  copyright: z.string().max(120),
  socialLinks: z.array(socialLinkSchema).max(8),
});

export const siteSettingsSchema = z.object({
  version: z.literal(CURRENT_VERSION),
  automation: automationSchema,
  rateLimit: rateLimitSchema,
  contactInfo: contactInfoSchema,
  formConfig: formConfigSchema,
  banner: bannerSchema,
  maintenance: maintenanceSchema,
  seo: seoSchema,
  branding: brandingSchema,
  navigation: navigationSchema,
});

/* ─────────────────────────  types  ───────────────────────── */

export type Automation = z.infer<typeof automationSchema>;
export type RateLimitSettings = z.infer<typeof rateLimitSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type FormConfig = z.infer<typeof formConfigSchema>;
export type Banner = z.infer<typeof bannerSchema>;
export type Maintenance = z.infer<typeof maintenanceSchema>;
export type PageSeo = z.infer<typeof pageSeoSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Branding = z.infer<typeof brandingSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
export type FooterColumn = z.infer<typeof footerColumnSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Navigation = z.infer<typeof navigationSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

/** Page keys we support per-page SEO for. */
export type SeoPageKey = keyof Seo["pages"];
