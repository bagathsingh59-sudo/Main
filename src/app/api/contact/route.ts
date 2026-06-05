import { NextResponse } from "next/server";
import { contactSchema } from "@/services/contact";
import { sendLeadEmail } from "@/services/mailer";
import { checkRateLimit } from "@/services/rateLimit";
import { renderContactLeadEmail, renderContactLeadText } from "@/utils/emailTemplates";

export const runtime = "nodejs";

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
