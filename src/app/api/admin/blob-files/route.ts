import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/services/adminAuth";
import { deleteUrls, listAllWithReferences } from "@/services/blobCleanup";

export const runtime = "nodejs";

function requireAuth(): NextResponse | null {
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  const result = verifySession(token);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  }
  return null;
}

/** GET — list every file in Blob with referenced/orphan status. */
export async function GET() {
  const unauth = requireAuth();
  if (unauth) return unauth;
  const { files, errors } = await listAllWithReferences();
  return NextResponse.json({ ok: true, files, errors });
}

/** DELETE — body: { urls: string[] } OR { url: string }. */
export async function DELETE(req: Request) {
  const unauth = requireAuth();
  if (unauth) return unauth;

  let body: { url?: string; urls?: string[] };
  try {
    body = (await req.json()) as { url?: string; urls?: string[] };
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }
  const urls = Array.isArray(body.urls) ? body.urls : body.url ? [body.url] : [];
  if (urls.length === 0) {
    return NextResponse.json({ ok: false, message: "No URLs provided" }, { status: 400 });
  }
  if (urls.length > 200) {
    return NextResponse.json({ ok: false, message: "Max 200 URLs per request" }, { status: 400 });
  }

  const report = await deleteUrls(urls);
  return NextResponse.json({ ok: true, report });
}
