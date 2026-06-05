/**
 * In-memory rate limiter for public form endpoints.
 *
 * Lives only inside the Next.js API runtime — no external services, no
 * shared store. That means:
 *   • Each serverless instance keeps its own counters.
 *   • Counters reset on cold start.
 *   • Limits are *per-instance*, so the effective ceiling is roughly
 *     `limit × concurrent-warm-instances`.
 *
 * For a low-volume B2B contact form this is the right trade-off: zero
 * deps, ~40 LOC, and still blocks the realistic threat — a single bot
 * hammering the form from one IP. A determined attacker could spin many
 * IPs; that's a problem for Cloudflare/WAF, not in-process limiting.
 */

const HOUR = 60 * 60 * 1000;

/**
 * Sliding-window limits. Tuned for a public contact form:
 *   • Per-IP: 5 submissions per 10 min → blocks form-spam bots
 *   • Global: 30 submissions per 1 min → protects Google's 2k/day SMTP
 *     quota from a flood that's slipped past per-IP limits.
 */
const PER_IP = { max: 5, windowMs: 10 * 60 * 1000 };
const GLOBAL = { max: 30, windowMs: 60 * 1000 };

/** Bucket cleanup horizon — anything older than this is GC-d. */
const GC_HORIZON_MS = HOUR;

interface Bucket {
  /** Unix-ms timestamps of recent hits, sorted ascending. */
  hits: number[];
}

const ipBuckets = new Map<string, Bucket>();
const globalBucket: Bucket = { hits: [] };
let lastGcAt = 0;

function trim(bucket: Bucket, windowMs: number, now: number) {
  const cutoff = now - windowMs;
  // Optimised single-pass trim (cheaper than filter() for small arrays).
  while (bucket.hits.length && bucket.hits[0] < cutoff) bucket.hits.shift();
}

function gc(now: number) {
  if (now - lastGcAt < 5 * 60 * 1000) return; // Run at most every 5 min.
  lastGcAt = now;
  const horizon = now - GC_HORIZON_MS;
  for (const [ip, b] of ipBuckets) {
    while (b.hits.length && b.hits[0] < horizon) b.hits.shift();
    if (b.hits.length === 0) ipBuckets.delete(ip);
  }
}

export type RateLimitResult =
  | { ok: true }
  | {
      ok: false;
      scope: "ip" | "global";
      /** Seconds the client should wait before retrying. */
      retryAfterSec: number;
      /** Polite, user-facing message — only shown in the worst case. */
      message: string;
    };

/**
 * Extract the originating client IP. Vercel sets `x-forwarded-for` with
 * the real IP first; we fall back to `x-real-ip` and finally to a stable
 * sentinel so unknown-IP traffic still counts against the global bucket.
 */
function getIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function checkRateLimit(req: Request): RateLimitResult {
  const now = Date.now();
  gc(now);

  // --- Global bucket (anti-flood) ---
  trim(globalBucket, GLOBAL.windowMs, now);
  if (globalBucket.hits.length >= GLOBAL.max) {
    const oldest = globalBucket.hits[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + GLOBAL.windowMs - now) / 1000));
    return {
      ok: false,
      scope: "global",
      retryAfterSec,
      message:
        "Quite a few people are reaching out right now. Please try again in a minute — your message matters to us.",
    };
  }

  // --- Per-IP bucket (anti-bot) ---
  const ip = getIp(req);
  let bucket = ipBuckets.get(ip);
  if (!bucket) {
    bucket = { hits: [] };
    ipBuckets.set(ip, bucket);
  }
  trim(bucket, PER_IP.windowMs, now);
  if (bucket.hits.length >= PER_IP.max) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + PER_IP.windowMs - now) / 1000));
    return {
      ok: false,
      scope: "ip",
      retryAfterSec,
      message:
        "Looks like you've already sent us a few messages from this device. Please give us a moment to reply before sending another — we read every note personally.",
    };
  }

  // Record the hit on both buckets only after passing both checks.
  bucket.hits.push(now);
  globalBucket.hits.push(now);
  return { ok: true };
}
