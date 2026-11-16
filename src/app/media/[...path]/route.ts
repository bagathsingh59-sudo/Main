/**
 * Serves files uploaded through the admin when they are stored in
 * PostgreSQL (DATABASE_URL). Upload paths carry a timestamp, so a path's
 * content never changes and can be cached for a year.
 */

import { NextResponse } from "next/server";
import { getMedia } from "@/services/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const pathname = params.path.map(decodeURIComponent).join("/");
  if (!pathname || pathname.includes("..")) return new NextResponse("Not found", { status: 404 });

  let file: Awaited<ReturnType<typeof getMedia>>;
  try {
    file = await getMedia(pathname);
  } catch (err) {
    console.error("[media] read failed:", err instanceof Error ? err.message : err);
    return new NextResponse("Unavailable", { status: 503 });
  }
  if (!file) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Last-Modified": file.uploadedAt.toUTCString(),
      "X-Content-Type-Options": "nosniff",
      // Uploaded SVGs are shown as images only — never allowed to run script.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
    },
  });
}
