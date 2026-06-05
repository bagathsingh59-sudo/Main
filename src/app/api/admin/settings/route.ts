import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/services/adminAuth";
import { getSiteSettings, updateSiteSettings, siteSettingsSchema } from "@/services/settings";
import { pingIndexNow } from "@/services/indexnow";

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

export async function PUT(req: Request) {
  const unauth = requireAuth();
  if (unauth) return unauth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Validation failed",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const result = await updateSiteSettings(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.detail ?? "Save failed", reason: result.reason },
      { status: result.reason === "not_configured" ? 503 : 502 },
    );
  }
  // Fire-and-forget IndexNow ping — fast, doesn't block the admin save.
  pingIndexNow().catch(() => {});
  return NextResponse.json({ ok: true, settings: parsed.data });
}
