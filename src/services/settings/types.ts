/**
 * Runtime-editable site settings.
 *
 * Stored in Vercel Edge Config. The shape is versioned so we can safely
 * migrate when fields are added/renamed without breaking running
 * deployments — the reader falls back to defaults if the stored version
 * doesn't match.
 */

import { z } from "zod";

export const CURRENT_VERSION = 8 as const;

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

/**
 * Site banner — multi-mode promotion system.
 *
 * `kind` switches the rendered surface:
 *   - "strip"    — slim full-width strip pinned to the top of every page (legacy default)
 *   - "popup"    — centered modal that opens after `popupShowDelaySec` seconds
 *   - "floating" — corner card pinned bottom-right / bottom-left, dismissible
 *
 * `style` is a presentation variant applied to the chosen kind:
 *   - "neutral"  — calm, single-tone (preserves the legacy minimalist look)
 *   - "gradient" — branded navy → teal sweep, white text
 *   - "glass"    — frosted translucent surface with backdrop blur
 *   - "branded"  — solid brand colour with high-contrast white type
 *
 * `popupFrequency` controls how often a popup/floating banner re-appears:
 *   - "session" — once per browser session (default; respects refresh)
 *   - "once"    — once per device until the user clears storage
 *   - "always"  — every page load (test only)
 *
 * All new fields default to safe values so existing stored settings
 * (which lack these keys) keep rendering the legacy neutral strip.
 */
/**
 * Available UI-effect overlays — CSS-only animations rendered on top of
 * a banner surface (popup/floating/sticky). Each one suits a different
 * marketing moment; see UiEffectOverlay for the actual frame styles.
 *
 *  - "none"                 → no overlay (default)
 *  - "confetti"             → falling colored confetti — launches, milestones
 *  - "sparkle"              → twinkling stars — premium feel, testimonials
 *  - "glitter-anniversary"  → gold glitter cascade — site anniversary, brand birthday
 *  - "snow-holiday"         → drifting snowflakes — Dec / New Year
 *  - "fireworks-launch"     → bursting fireworks — product launches, Republic/Independence Day
 *  - "shimmer-premium"      → diagonal shimmer sweep — luxury offers, VIP audit
 *  - "floating-icons"       → drifting compliance icons — Diwali / Eid / festival campaigns
 *  - "glow-pulse-urgent"    → pulsing brand glow — deadline reminders, last-day offers
 *  - "coupon-burst-sale"    → radial burst rays — discount campaigns, sale events
 *  - "ribbons-celebration"  → silk ribbons fall — graduations, year-end wraps
 */
export const uiEffectEnum = z.enum([
  "none",
  "confetti",
  "sparkle",
  "glitter-anniversary",
  "snow-holiday",
  "fireworks-launch",
  "shimmer-premium",
  "floating-icons",
  "glow-pulse-urgent",
  "coupon-burst-sale",
  "ribbons-celebration",
]);

export const bannerSchema = z.object({
  enabled: z.boolean(),
  kind: z.enum(["strip", "popup", "floating", "sticky-bar"]).default("strip"),
  style: z.enum(["neutral", "gradient", "glass", "apple-glass", "branded"]).default("neutral"),
  message: z.string().max(400),
  linkUrl: z.string(),
  linkLabel: z.string().max(40),
  tone: z.enum(["info", "warning", "success"]),
  /**
   * Editorial rule: when tone === "info", admin UI forces dismissible
   * = false and the runtime guard re-enforces. Warning and success
   * tones can opt into a × close button.
   */
  dismissible: z.boolean().default(true),
  /**
   * Per-kind independent enable flags. The flat fields above describe
   * the CURRENTLY-EDITED preset; these toggles control which kinds are
   * ACTIVE on the public site. Multiple may be enabled simultaneously
   * (e.g. permanent strip + lead-capture popup + sticky audit bar).
   *
   * When all toggles are false, the runtime falls back to the legacy
   * single-banner model and renders whatever `kind` is set to.
   */
  enableStrip: z.boolean().default(false),
  enablePopup: z.boolean().default(false),
  enableFloating: z.boolean().default(false),
  enableStickyBar: z.boolean().default(false),
  /**
   * Visual effect overlay. Set to "default" to inherit the site-wide
   * globalUiEffect. Any other value overrides the global — inline-CSS-style
   * priority cascade.
   */
  uiEffect: z.enum(["default", ...uiEffectEnum.options]).default("default"),
  /**
   * When true, the admin-uploaded logo (from /admin/branding) renders
   * inside popup / floating / sticky surfaces. Ignored on strip.
   */
  showLogo: z.boolean().default(false),
  /**
   * CTA button visual variant. Affects all banner kinds.
   *
   * Classic set:
   *   - "solid"           classic filled rectangle (default)
   *   - "outline"         border-only on transparent background
   *   - "glow"            solid + animated brand glow halo
   *   - "pill"            fully rounded, larger touch target
   *
   * hover.dev-inspired set (animated, professional):
   *   - "shimmer"         diagonal shine sweep across the surface on hover
   *   - "slide"           content + arrow slides horizontally on hover
   *   - "draw-outline"    border traces itself around the button on hover
   *   - "gradient-shadow" brand-colored gradient shadow expands on hover
   *   - "neubrutalism"    bold offset shadow that snaps in on hover
   */
  ctaStyle: z
    .enum([
      "solid",
      "outline",
      "glow",
      "pill",
      "shimmer",
      "slide",
      "draw-outline",
      "gradient-shadow",
      "neubrutalism",
    ])
    .default("solid"),
  popupHeadline: z.string().max(80).default(""),
  popupEyebrow: z.string().max(40).default(""),
  popupCtaSecondaryLabel: z.string().max(40).default(""),
  popupCtaSecondaryUrl: z.string().default(""),
  popupShowDelaySec: z.number().int().min(0).max(60).default(4),
  popupFrequency: z.enum(["session", "once", "always"]).default("session"),
  floatingPosition: z.enum(["bottom-right", "bottom-left"]).default("bottom-right"),
  /**
   * Site-wide UI effect — applies to every active banner that has
   * uiEffect = "default". A banner with a non-default uiEffect always
   * overrides this global. Mirrors the inline-CSS-most-specific cascade.
   */
  globalUiEffect: uiEffectEnum.default("none"),
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

/* ── Team (members CRUD) ────────────────────────────────── */

/**
 * Accent gradient picker — keeps team avatars visually consistent
 * with the brand even when no photo is uploaded.
 */
export const TEAM_ACCENTS = [
  "from-navy-700 to-teal-600",
  "from-teal-600 to-navy-700",
  "from-navy-600 to-teal-500",
  "from-teal-700 to-navy-600",
  "from-navy-500 to-teal-600",
  "from-teal-500 to-navy-700",
] as const;

export const teamMemberSchema = z.object({
  id: z.string().min(6).max(40),
  name: z.string().min(2).max(120),
  role: z.string().max(160),
  bio: z.string().max(800),
  /** Two-letter fallback shown when no photo is uploaded. */
  initials: z.string().max(4),
  /** Tailwind gradient class (without "bg-gradient-to-br"). */
  accent: z.string().max(60),
  /** Uploaded photo URL. Empty = render initials avatar. */
  image: z.string().max(500),
  linkedinUrl: z.string().max(300),
});

export const teamSettingsSchema = z.object({
  members: z.array(teamMemberSchema).max(50),
});

/* ── Services (8-item list) ──────────────────────────────── */

/**
 * Icon names allowed for services. Maps to existing Icon component
 * (src/components/ui/Icon.tsx). We type-check by enum so admins can't
 * pick a non-existent icon.
 */
export const SERVICE_ICONS = [
  "Wallet",
  "ShieldCheck",
  "Scale",
  "Receipt",
  "FileText",
  "LineChart",
  "ClipboardCheck",
  "Building2",
  "Users",
  "Activity",
  "Lock",
  "Globe",
  "Sparkles",
  "Calculator",
  "Award",
  "BookOpen",
] as const;

export const serviceItemSchema = z.object({
  id: z.string().min(6).max(40),
  icon: z.enum(SERVICE_ICONS),
  title: z.string().min(2).max(120),
  summary: z.string().max(400),
  /** Bullet points shown under the summary on the Services page. */
  points: z.array(z.string().min(1).max(120)).max(8),
  /** Tailwind gradient class (without "bg-gradient-to-br"). */
  accent: z.string().max(60),
});

export const servicesSettingsSchema = z.object({
  items: z.array(serviceItemSchema).max(20),
});

/* ── Founder profile (single record) ─────────────────────── */

/* ── Regulatory Updates (briefings shown on /insights) ─── */

export const updateItemSchema = z.object({
  id: z.string().min(6).max(40),
  slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/, "lowercase a-z, 0-9, hyphens only"),
  /** Display date string (e.g. "28 May 2026"). */
  date: z.string().min(2).max(40),
  /** Short tag (e.g. "GST", "EPF", "Labour Law"). */
  tag: z.string().min(1).max(40),
  /** Severity drives the colored pill on the card. */
  severity: z.enum(["low", "medium", "high"]),
  title: z.string().min(3).max(280),
  /** 1-2 line excerpt shown on the list. */
  summary: z.string().max(400),
  /** Markdown body for the briefing detail page. */
  content: z.string().max(50000),
  /** ISO date for sorting + sitemap lastmod. */
  publishedAt: z.string(),
  updatedAt: z.string(),
  isDraft: z.boolean(),
});

export const updatesSettingsSchema = z.object({
  items: z.array(updateItemSchema).max(200),
});

export const founderSettingsSchema = z.object({
  /** Empty = use Team list[0] as fallback. */
  name: z.string().max(120),
  role: z.string().max(160),
  /** Photo URL — falls back to initials avatar if empty. */
  image: z.string().max(500),
  /** Initials used in the photo fallback. */
  initials: z.string().max(4),
  /** Tailwind gradient class. */
  accent: z.string().max(60),
  /** Pull-quote shown in display font at the top of the card. */
  quote: z.string().max(280),
  /** Body paragraphs (rendered as separate <p> blocks). */
  paragraphs: z.array(z.string().min(1).max(800)).max(8),
  /** Years-of-practice stat (e.g., "24+ yrs"). Empty hides the chip. */
  experienceStat: z.string().max(20),
  /** Qualification stat (e.g., "FCA"). Empty hides the chip. */
  qualificationStat: z.string().max(20),
  /** Body for the signature row at the bottom. */
  signatureLabel: z.string().max(120),
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
  team: teamSettingsSchema,
  services: servicesSettingsSchema,
  founder: founderSettingsSchema,
  updates: updatesSettingsSchema,
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
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamSettings = z.infer<typeof teamSettingsSchema>;
export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type ServicesSettings = z.infer<typeof servicesSettingsSchema>;
export type FounderSettings = z.infer<typeof founderSettingsSchema>;
export type UpdateItem = z.infer<typeof updateItemSchema>;
export type UpdatesSettings = z.infer<typeof updatesSettingsSchema>;
export type ServiceIcon = (typeof SERVICE_ICONS)[number];
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

/** Page keys we support per-page SEO for. */
export type SeoPageKey = keyof Seo["pages"];
