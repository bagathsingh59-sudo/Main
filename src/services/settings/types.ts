/**
 * Runtime-editable site settings.
 *
 * Stored in Vercel Edge Config. The shape is versioned so we can safely
 * migrate when fields are added/renamed without breaking running
 * deployments — the reader falls back to defaults if the stored version
 * doesn't match.
 */

import { z } from "zod";

export const CURRENT_VERSION = 1 as const;

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

export const siteSettingsSchema = z.object({
  version: z.literal(CURRENT_VERSION),
  automation: automationSchema,
  rateLimit: rateLimitSchema,
  contactInfo: contactInfoSchema,
  formConfig: formConfigSchema,
  banner: bannerSchema,
  maintenance: maintenanceSchema,
});

/* ─────────────────────────  types  ───────────────────────── */

export type Automation = z.infer<typeof automationSchema>;
export type RateLimitSettings = z.infer<typeof rateLimitSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type FormConfig = z.infer<typeof formConfigSchema>;
export type Banner = z.infer<typeof bannerSchema>;
export type Maintenance = z.infer<typeof maintenanceSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
