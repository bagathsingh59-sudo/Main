/**
 * Admin authentication — HMAC-signed session cookie.
 *
 * Single-admin model: one password stored as a plain env var, compared
 * with timing-safe equality. The session token itself is HMAC-signed
 * so a leaked cookie can't be forged or extended past its expiry.
 *
 * Env vars:
 *   ADMIN_PASSWORD          — the admin's login password (any 16+ chars)
 *   ADMIN_SESSION_SECRET    — HMAC key for session cookies (32+ chars)
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "vc_admin";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const ENC = "base64url";

export interface SessionPayload {
  iat: number;
  exp: number;
}

function getSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function signSession(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const now = Date.now();
  const payload: SessionPayload = { iat: now, exp: now + SESSION_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString(ENC);
  const sig = createHmac("sha256", secret).update(body).digest(ENC);
  return `${body}.${sig}`;
}

export type VerifyResult =
  | { ok: true; payload: SessionPayload }
  | { ok: false; reason: "missing" | "malformed" | "bad_signature" | "expired" | "not_configured" };

export function verifySession(token: string | undefined): VerifyResult {
  if (!token) return { ok: false, reason: "missing" };
  const secret = getSecret();
  if (!secret) return { ok: false, reason: "not_configured" };

  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "malformed" };
  const [body, sig] = parts;

  const expected = createHmac("sha256", secret).update(body).digest(ENC);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "bad_signature" };
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(body, ENC).toString("utf8")) as SessionPayload;
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true, payload };
}

export const ADMIN_COOKIE = {
  name: COOKIE_NAME,
  ttlMs: SESSION_TTL_MS,
};
