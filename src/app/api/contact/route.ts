import { NextResponse } from "next/server";
import { contactSchema } from "@/services/contact";
import { sendLeadEmail } from "@/services/mailer";
import { checkRateLimit } from "@/services/rateLimit";
import { signApproval } from "@/utils/approvalToken";
import { renderContactLeadEmail, renderContactLeadText } from "@/utils/emailTemplates";

export const runtime = "nodejs";

function getSiteUrl(req: Request): string {
  // Prefer the explicit env var, fall back to request origin for previews / dev.
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const limit = checkRateLimit(req);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", message: limit.message },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

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

    // Sign a one-click approval token so staff can authorise the
    // auto-reply straight from the notification email. Returns null
    // if APPROVAL_SECRET isn't configured — we degrade to a notify-
    // only email without the green Approve button.
    const token = signApproval({
      email: d.email,
      firstName: d.firstName,
      leadId: id,
      iat: Date.now(),
    });
    const approveUrl = token
      ? `${getSiteUrl(req)}/api/approve-reply?token=${encodeURIComponent(token)}`
      : undefined;

    const payload = {
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

    const mail = await sendLeadEmail({
      subject: `New enquiry · ${d.firstName} ${d.lastName} — ${d.service}`,
      html: renderContactLeadEmail(payload),
      text: renderContactLeadText(payload),
      replyTo: d.email,
    });

    if (!mail.ok) {
      return NextResponse.json(
        { ok: false, message: "We couldn't send your message — please email us directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false, message: "Bad request" }, { status: 400 });
  }
}
