import { NextResponse } from "next/server";
import { bookingSchema } from "@/services/booking";
import { sendLeadEmail } from "@/services/mailer";
import { renderBookingLeadEmail, renderBookingLeadText } from "@/utils/emailTemplates";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const id = `book_${Date.now().toString(36)}`;
    const d = parsed.data;

    const payload = {
      fullName: d.fullName,
      email: d.email,
      companyRole: d.companyRole || undefined,
      day: d.day,
      time: d.time,
      bookingId: id,
    };

    const mail = await sendLeadEmail({
      subject: `Consultation booked · ${d.fullName} — ${d.day} ${d.time} IST`,
      html: renderBookingLeadEmail(payload),
      text: renderBookingLeadText(payload),
      replyTo: d.email,
    });

    if (!mail.ok) {
      return NextResponse.json(
        { ok: false, message: "We couldn't reserve your slot — please email us directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false, message: "Bad request" }, { status: 400 });
  }
}
