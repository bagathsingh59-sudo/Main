import { NextResponse } from "next/server";
import { contactSchema } from "@/services/contact";
import { sendLeadEmail } from "@/services/mailer";
import { checkRateLimit } from "@/services/rateLimit";
import { getSiteSettings } from "@/services/settings";
import { signApproval } from "@/utils/approvalToken";
import {
  renderAutoReplyEmail,
  renderAutoReplyText,
  renderContactLeadEmail,
  renderContactLeadText,
} from "@/utils/emailTemplates";
import { COMPANY } from "@/constants/company";

export const runtime = "nodejs";

function getSiteUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const settings = await getSiteSettings();

  // ── maintenance mode ───────────────────────────────────────────────
  if (settings.maintenance.formsDisabled) {
    return NextResponse.json(
      { ok: false, code: "maintenance", message: settings.maintenance.message },
      { status: 503 },
    );
  }

  // ── rate limit (using admin-tunable config) ────────────────────────
  const limit = checkRateLimit(req, {
    perIp: {
      max: settings.rateLimit.perIpMax,
      windowMs: settings.rateLimit.perIpWindowMinutes * 60 * 1000,
    },
    global: {
      max: settings.rateLimit.globalMax,
      windowMs: settings.rateLimit.globalWindowSeconds * 1000,
    },
  });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", message: limit.message },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  // ── validate payload ───────────────────────────────────────────────
  try {
    const body = (await req.json()) as unknown;
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const id = `lead_${Date.now().toString(36)}`;
    const d = parsed.data;
    const mode = settings.automation.autoReplyMode;

    // Admin-set From / notification overrides (empty = use env defaults).
    const mailerOverrides = {
      to: settings.automation.notificationTo || undefined,
      fromName: settings.automation.fromName || undefined,
      fromAddress: settings.automation.fromAddress || undefined,
    };

    // ── 1. Branded notification to staff ────────────────────────────
    // The green Approve button only appears in MANUAL mode. In immediate
    // mode the auto-reply has already fired (below), so the notification
    // shows a status badge instead.
    const token =
      mode === "manual"
        ? signApproval({
            email: d.email,
            firstName: d.firstName,
            leadId: id,
            iat: Date.now(),
          })
        : null;
    const approveUrl =
      token != null
        ? `${getSiteUrl(req)}/api/approve-reply?token=${encodeURIComponent(token)}`
        : undefined;

    const leadPayload = {
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone || undefined,
      company: d.company || undefined,
      companySize: d.companySize,
      service: d.service,
      message: d.message,
      leadId: id,
      approveUrl,
    };

    const notifyResult = await sendLeadEmail({
      ...mailerOverrides,
      subject: `New enquiry · ${d.firstName} ${d.lastName} — ${d.service}`,
      html: renderContactLeadEmail(leadPayload),
      text: renderContactLeadText(leadPayload),
      replyTo: d.email,
    });

    if (!notifyResult.ok) {
      return NextResponse.json(
        { ok: false, message: "We couldn't send your message — please email us directly." },
        { status: 502 },
      );
    }

    // ── 2. Immediate auto-reply to lead (if mode is "immediate") ────
    if (mode === "immediate") {
      // Fire-and-forget — don't block the user response on this. Errors
      // are logged but don't fail the submission (staff can resend later
      // via mailto from the notification email).
      sendLeadEmail({
        ...mailerOverrides,
        to: d.email,
        subject: `Thanks for reaching out to ${COMPANY.name}, ${d.firstName}`,
        html: renderAutoReplyEmail({ firstName: d.firstName }),
        text: renderAutoReplyText({ firstName: d.firstName }),
      }).catch((err) => {
        console.error("[contact] immediate auto-reply failed:", err);
      });
    }

    return NextResponse.json({ ok: true, id, autoReplyMode: mode });
  } catch {
    return NextResponse.json({ ok: false, message: "Bad request" }, { status: 400 });
  }
}
