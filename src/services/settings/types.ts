/**
 * Runtime-editable site settings.
 *
 * Stored in Vercel Edge Config. The shape is versioned so we can safely
 * migrate when fields are added/renamed without breaking running
 * deployments — the reader falls back to defaults if the stored version
 * doesn't match.
 */

import { z } from "zod";

export const CURRENT_VERSION = 6 as const;

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
  /**
   * Google Maps embed URL (the `src` attribute from the iframe Google
   * generates for "Embed a map"). Empty string = no map rendered.
   * Validated client-side: only accept URLs from google.com/maps/embed.
   */
  mapEmbedUrl: z.string().max(2000),
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
  // Google typically truncates titles around 60 chars but accepts longer
  // for OG/social previews. 80 gives room without becoming spam.
  title: z.string().max(80),
  // Google's snippet shows ~155 chars on desktop, but some contexts
  // (FAQ rich results, news rich cards) use up to ~320. The longer
  // version is also reused for OG description which can be longer.
  description: z.string().max(320),
  // Per-page list can hold up to 50 keywords (long-tail + local-geo
  // mixes can run that deep before becoming meta-spam).
  keywords: z.array(z.string().min(1).max(60)).max(50),
  ogImage: z.string(),
});

export const seoSchema = z.object({
  siteName: z.string().max(60),
  titleTemplate: z.string().max(80),
  defaultDescription: z.string().max(320),
  // Site-wide defaults cap at 100 — bigger lists hit diminishing returns
  // and risk being treated as keyword stuffing.
  defaultKeywords: z.array(z.string().min(1).max(60)).max(100),
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

/* ── Email templates (text content only) ─────────────────── */

export const leadNotificationTemplateSchema = z.object({
  /** Subject line. Tokens: {firstName}, {lastName}, {service}. */
  subjectPattern: z.string().min(5).max(160),
  /** Pill text at top of email. */
  badge: z.string().min(2).max(40),
  /** Title pattern. Tokens: {name}, {service}. */
  titlePattern: z.string().min(5).max(180),
  /** First paragraph below the title. */
  intro: z.string().min(10).max(400),
  /** Footer microcopy under the card. */
  footerNote: z.string().min(10).max(280),
});

export const autoReplyTemplateSchema = z.object({
  /** Subject. Tokens: {firstName}. */
  subjectPattern: z.string().min(5).max(160),
  badge: z.string().min(2).max(40),
  /** Title pattern. Tokens: {firstName}. */
  titlePattern: z.string().min(5).max(180),
  /** First paragraph. */
  intro: z.string().min(10).max(400),
  /** Second paragraph. */
  introSecondary: z.string().min(0).max(400),
  /** Three "what happens next" rows. */
  steps: z.array(z.object({ when: z.string().min(2).max(60), description: z.string().min(2).max(280) })).length(3),
  /** Phone-fallback line. Tokens: {phone}, {hours}. */
  phoneFallback: z.string().min(10).max(280),
  footerNote: z.string().min(10).max(280),
});

export const emailTemplatesSchema = z.object({
  leadNotification: leadNotificationTemplateSchema,
  autoReply: autoReplyTemplateSchema,
});

/* ── FAQ (powers the /insights FAQ section + FAQ JSON-LD) ── */

export const faqItemSchema = z.object({
  question: z.string().min(5).max(280),
  // Empty allowed during draft (admin pastes 30 questions, fills answers later).
  answer: z.string().max(2000),
});

export const faqSettingsSchema = z.object({
  items: z.array(faqItemSchema).max(100),
});

/* ── Blog (CMS for /insights/[slug] posts) ──────────────── */

const SLUG_RE = /^[a-z0-9-]+$/;

export const blogPostSeoSchema = z.object({
  /** Override for <title>. Falls back to post title when empty. */
  title: z.string().max(80),
  /** Meta description for SERP snippet. Falls back to excerpt. */
  description: z.string().max(320),
  /** Per-post keywords (max 30, each ≤60 chars). */
  keywords: z.array(z.string().min(1).max(60)).max(30),
  /** OG image override. Falls back to coverImage, then site default. */
  ogImage: z.string().max(500),
});

export const blogPostSchema = z.object({
  /** Stable internal id (cuid-style, never displayed). */
  id: z.string().min(6).max(40),
  /** Public URL slug — lowercase, alphanumeric + hyphens. */
  slug: z.string().min(3).max(120).regex(SLUG_RE, "Slug must be lowercase a-z, 0-9, and hyphens only"),
  title: z.string().min(3).max(200),
  /** 1-2 line summary for cards + meta description fallback. */
  excerpt: z.string().max(400),
  /** Markdown body — rendered with react-markdown + remark-gfm. */
  content: z.string().max(50000),
  /** Hero/cover image URL (uploaded via /admin/blog or external). */
  coverImage: z.string().max(500),
  author: z.string().max(100),
  /** Free-form category. Use a few consistent values for filtering. */
  category: z.string().max(60),
  /** Tags surface in card meta + can feed faceted filtering later. */
  tags: z.array(z.string().min(1).max(40)).max(10),
  /** ISO 8601 timestamp — published date (initial publish). */
  publishedAt: z.string(),
  /** ISO 8601 timestamp — last edit. */
  updatedAt: z.string(),
  /** Drafts don't render publicly and are skipped from sitemap. */
  isDraft: z.boolean(),
  seo: blogPostSeoSchema,
});

export const blogSettingsSchema = z.object({
  posts: z.array(blogPostSchema).max(200),
  /** Optional category list (drives suggested category dropdown). */
  categories: z.array(z.string().min(1).max(60)).max(30),
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
  emailTemplates: emailTemplatesSchema,
  faq: faqSettingsSchema,
  blog: blogSettingsSchema,
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
export type LeadNotificationTemplate = z.infer<typeof leadNotificationTemplateSchema>;
export type AutoReplyTemplate = z.infer<typeof autoReplyTemplateSchema>;
export type EmailTemplates = z.infer<typeof emailTemplatesSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqSettings = z.infer<typeof faqSettingsSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogPostSeo = z.infer<typeof blogPostSeoSchema>;
export type BlogSettings = z.infer<typeof blogSettingsSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

/** Page keys we support per-page SEO for. */
export type SeoPageKey = keyof Seo["pages"];
