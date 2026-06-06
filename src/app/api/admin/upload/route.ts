/**
 * Authenticated image upload endpoint for admin brand assets.
 *
 * Stores the file in Vercel Blob and returns the public URL. The URL
 * gets pasted into a settings field (logoUrl / faviconUrl / ogImageUrl)
 * via the admin UI.
 *
 * Requires:
 *   • BLOB_READ_WRITE_TOKEN  — auto-set when Vercel Blob store is linked
 *
 * Caps:
 *   • 2 MB max per file
 *   • Image MIME types only (png/jpeg/webp/svg/x-icon)
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { ADMIN_COOKIE, verifySession } from "@/services/adminAuth";
import { checkQuotaFor, cleanupOrphans } from "@/services/blobCleanup";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

export async function POST(req: Request) {
  // ── auth ─────────────────────────────────────────────
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  const session = verifySession(token);
  if (!session.ok) {
    return NextResponse.json(
      { ok: false, message: "Unauthorised" },
      { status: 401 },
    );
  }

  // ── env check ─────────────────────────────────────────
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Vercel Blob is not configured. In Vercel: Storage → Create Blob store → connect to project, then redeploy.",
      },
      { status: 503 },
    );
  }

  // ── parse multipart ──────────────────────────────────
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid form data" }, { status: 400 });
  }
  const file = form.get("file");
  const purpose = (form.get("purpose") as string) || "asset"; // logo / favicon / og
  if (!(file instanceof Blob)) {
    return NextResponse.json({ ok: false, message: "Missing file" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ ok: false, message: "Empty file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, message: `File too large (max ${Math.round(MAX_BYTES / 1024 / 1024)} MB)` },
      { status: 413 },
    );
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { ok: false, message: `Unsupported file type: ${file.type}` },
      { status: 415 },
    );
  }

  // ── Quota guard ──────────────────────────────────────────
  // Reject the upload before transferring bytes to Blob if it would
  // push storage past the safe limit (800 MB, leaving 200 MB reserve).
  const quota = await checkQuotaFor(file.size);
  if (!quota.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: "quota_exceeded",
        message: quota.message,
        currentBytes: quota.currentBytes,
        projectedBytes: quota.projectedBytes,
        safeLimit: quota.safeLimit,
      },
      { status: 413 },
    );
  }

  const ext = file.type.split("/").pop()?.replace("svg+xml", "svg").replace("x-icon", "ico") || "bin";
  const safePurpose = String(purpose).replace(/[^a-z0-9_-]/gi, "").slice(0, 24) || "asset";
  const filename = `branding/${safePurpose}-${Date.now()}.${ext}`;

  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    // Fire-and-forget cleanup — purge previous timestamped versions of
    // anything that's no longer referenced AND older than the 1-hour
    // grace window. The just-uploaded file is safe (it's <1 min old).
    cleanupOrphans().catch((err) => {
      console.warn("[upload] post-upload cleanup failed (non-fatal):", err);
    });
    return NextResponse.json({ ok: true, url: blob.url, pathname: blob.pathname });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : "Upload failed" },
      { status: 502 },
    );
  }
}
