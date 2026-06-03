import { NextResponse } from "next/server";
import { contactSchema } from "@/services/contact";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    // TODO: hook up to your CRM / mail provider here (e.g. Resend, Postmark, HubSpot).
    // Returning a stable contract so the client can wire success / failure UX.
    const id = `lead_${Date.now().toString(36)}`;
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false, message: "Bad request" }, { status: 400 });
  }
}
