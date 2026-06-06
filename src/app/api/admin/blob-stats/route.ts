import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/services/adminAuth";
import { cleanupOrphans, getBlobStats, listOrphans } from "@/services/blobCleanup";

export const runtime = "nodejs";

function requireAuth(): NextResponse | null {
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  const result = verifySession(token);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauth = requireAuth();
  if (unauth) return unauth;
  const [stats, orphans] = await Promise.all([getBlobStats(), listOrphans()]);
  return NextResponse.json({
    ok: true,
    stats,
    orphans: { count: orphans.orphans.length, bytes: orphans.bytes, skippedRecent: orphans.skippedRecent },
  });
}

export async function POST() {
  const unauth = requireAuth();
  if (unauth) return unauth;
  const report = await cleanupOrphans();
  return NextResponse.json({ ok: true, report });
}
