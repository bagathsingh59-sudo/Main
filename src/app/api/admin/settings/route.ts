import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE, verifySession } from "@/services/adminAuth";
import {
  getSiteSettings,
  updateSiteSettings,
  siteSettingsSchema,
  automationSchema,
  rateLimitSchema,
  contactInfoSchema,
  formConfigSchema,
  bannerSchema,
  maintenanceSchema,
  seoSchema,
  brandingSchema,
  navigationSchema,
  emailTemplatesSchema,
  faqSettingsSchema,
  blogSettingsSchema,
  CURRENT_VERSION,
  type SiteSettings,
} from "@/services/settings";
import { pingIndexNow } from "@/services/indexnow";
import { cleanupOrphans } from "@/services/blobCleanup";

export const runtime = "nodejs";

function requireAuth(): NextResponse | null {
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  const result = verifySession(token);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "Unauthorised", reason: result.reason },
      { status: 401 },
    );
  }
  return null;
}

export async function GET() {
  const unauth = requireAuth();
  if (unauth) return unauth;
  const settings = await getSiteSettings();
  return NextResponse.json({ ok: true, settings });
}

/**
 * Per-section schema lookup. Section keys mirror the SiteSettings shape
 * minus `version`. Partial saves validate only the provided sections
 * and merge them into current settings — so a bad SEO description can
 * no longer block a banner save (and vice versa).
 */
const SECTION_SCHEMAS = {
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
} as const satisfies Record<string, z.ZodTypeAny>;

type SectionKey = keyof typeof SECTION_SCHEMAS;
const SECTION_KEYS = Object.keys(SECTION_SCHEMAS) as SectionKey[];

export async function PUT(req: Request) {
  const unauth = requireAuth();
  if (unauth) return unauth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, message: "Body must be an object" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;

  // ── Detect mode ────────────────────────────────────────────────────
  // Full save: payload contains a `version` field at the top level.
  //   We validate the whole siteSettingsSchema and replace storage wholesale.
  // Partial save: payload omits `version` and contains only some sections.
  //   We validate each section individually, then merge into current.
  const isFullSave = "version" in payload;

  let next: SiteSettings;

  if (isFullSave) {
    const parsed = siteSettingsSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    next = parsed.data;
  } else {
    // ── Partial path ─────────────────────────────────────────────────
    const providedKeys = Object.keys(payload).filter((k) => k !== "version") as SectionKey[];
    if (providedKeys.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Empty partial — no sections to update" },
        { status: 400 },
      );
    }

    const unknownKeys = providedKeys.filter((k) => !SECTION_KEYS.includes(k as SectionKey));
    if (unknownKeys.length > 0) {
      return NextResponse.json(
        { ok: false, message: `Unknown section(s): ${unknownKeys.join(", ")}` },
        { status: 400 },
      );
    }

    // Validate each provided section individually.
    const issues: z.ZodIssue[] = [];
    const validated: Partial<SiteSettings> = {};
    for (const key of providedKeys) {
      const schema = SECTION_SCHEMAS[key];
      const result = schema.safeParse(payload[key]);
      if (!result.success) {
        for (const issue of result.error.issues) {
          // Prefix each issue's path with the section so the client sees the
          // full address (e.g. ["seo", "defaultDescription"]).
          issues.push({ ...issue, path: [key, ...issue.path] });
        }
      } else {
        (validated as Record<string, unknown>)[key] = result.data;
      }
    }

    if (issues.length > 0) {
      return NextResponse.json(
        { ok: false, message: "Validation failed", issues },
        { status: 400 },
      );
    }

    const current = await getSiteSettings();
    next = { ...current, ...validated, version: CURRENT_VERSION };
  }

  const result = await updateSiteSettings(next);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.detail ?? "Save failed", reason: result.reason },
      { status: result.reason === "not_configured" ? 503 : 502 },
    );
  }
  // Fire-and-forget IndexNow ping — fast, doesn't block the admin save.
  pingIndexNow().catch(() => {});

  // Fire-and-forget Blob orphan cleanup. Catches files that became
  // unreferenced (replaced logo, deleted blog post cover, etc.) and
  // are at least 1 hour old. Safe to call after every save — heavy
  // pruning only happens when there's something to prune.
  cleanupOrphans().catch((err) => {
    console.warn("[settings] blob cleanup failed (non-fatal):", err);
  });

  return NextResponse.json({ ok: true, settings: next });
}
