/**
 * HMAC-signed approval tokens for one-click auto-reply consent.
 *
 * The token is a self-contained signed blob — no database required.
 * Staff clicks the "Approve & send auto-reply" link in their inbox;
 * the API verifies the signature, decodes the lead data, and fires
 * the reply. Tokens expire after 7 days.
 *
 * Format: base64url(payload).base64url(hmacSha256(payload))
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export interface ApprovalPayload {
  /** Lead's email — recipient of the auto-reply. */
  email: string;
  /** Lead's first name — used for the greeting. */
  firstName: string;
  /** Lead id from the original notification, for log correlation. */
  leadId: string;
  /** Issued-at, ms since epoch. */
  iat: number;
}

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const ENCODING = "base64url";

function getSecret(): string | null {
  const secret = process.env.APPROVAL_SECRET;
  if (!secret || secret.length < 16) return null;
  return secret;
}

export function signApproval(payload: ApprovalPayload): string | null {
  const secret = getSecret();
  if (!secret) {
    console.warn("[approval] APPROVAL_SECRET not configured — token not generated.");
    return null;
  }
  const body = Buffer.from(JSON.stringify(payload)).toString(ENCODING);
  const sig = createHmac("sha256", secret).update(body).digest(ENCODING);
  return `${body}.${sig}`;
}

export type VerifyResult =
  | { ok: true; payload: ApprovalPayload }
  | { ok: false; reason: "malformed" | "bad_signature" | "expired" | "not_configured" };

export function verifyApproval(token: string): VerifyResult {
  const secret = getSecret();
  if (!secret) return { ok: false, reason: "not_configured" };

  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, reason: "malformed" };
  }
  const [body, sig] = parts;

  const expected = createHmac("sha256", secret).update(body).digest(ENCODING);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  // Timing-safe comparison; lengths must match for timingSafeEqual.
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "bad_signature" };
  }

  let payload: ApprovalPayload;
  try {
    payload = JSON.parse(Buffer.from(body, ENCODING).toString("utf8")) as ApprovalPayload;
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (
    typeof payload.email !== "string" ||
    typeof payload.firstName !== "string" ||
    typeof payload.leadId !== "string" ||
    typeof payload.iat !== "number"
  ) {
    return { ok: false, reason: "malformed" };
  }
  if (Date.now() - payload.iat > MAX_AGE_MS) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true, payload };
}
