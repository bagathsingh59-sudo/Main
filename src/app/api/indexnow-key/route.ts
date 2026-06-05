import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Serves the IndexNow verification key as plain text.
 * Used as `keyLocation` in IndexNow pings — Bing fetches this URL to
 * verify we control the domain before honoring the ping.
 */
export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return new NextResponse("IndexNow not configured", { status: 404 });
  }
  return new NextResponse(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
