import Link from "next/link";
import { LICENSE } from "@/constants/license";

/**
 * LicenseCard — digital render of the Government of Karnataka
 * Registration Certificate. Three variants:
 *
 *   - "full"    : full certificate card with all fields + download
 *                 button. Use on /about and /disclaimer.
 *   - "compact" : 5-line trust summary with download. Use on
 *                 /contact above the form to reduce hesitation.
 *   - "chip"    : tiny "Govt registered" pill for the footer.
 *
 * The PDF link points at the redacted certificate (founder's
 * personal mobile + Gmail blacked out) hosted under public/legal/.
 */
export function LicenseCard({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "compact" | "chip";
  className?: string;
}) {
  if (variant === "chip") return <LicenseChip className={className} />;
  if (variant === "compact") return <LicenseCompact className={className} />;
  return <LicenseFull className={className} />;
}

/* ──────────────────────────── full ──────────────────────────── */

function LicenseFull({ className }: { className: string }) {
  return (
    <div
      id="license"
      className={`relative overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(13,42,84,0.35)] ring-1 ring-slate-200 ${className}`}
    >
      {/* Top navy band with verified badge + watermark */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-700 to-navy-600 px-7 py-6 text-white sm:px-9 sm:py-7">
        <KarnatakaWatermark />
        <div className="relative z-[1] flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <ShieldEmblem />
            <div>
              <div className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-teal-200/90">
                {LICENSE.issuer}
              </div>
              <div className="mt-0.5 text-[0.92rem] font-semibold leading-snug sm:text-[1rem]">
                {LICENSE.department}
              </div>
              <div className="mt-1.5 text-[0.78rem] text-white/70">
                Registration Certificate of Establishment &middot; {LICENSE.formCode}
              </div>
            </div>
          </div>
          <VerifiedBadge />
        </div>
      </div>

      {/* Body — registration fields */}
      <div className="grid gap-x-8 gap-y-5 px-7 py-7 sm:grid-cols-2 sm:px-9 sm:py-8">
        <Row label="Registration No." value={<code className="font-mono text-[0.95rem] font-semibold text-navy-700">{LICENSE.registrationNumber}</code>} />
        <Row label="Form" value={`${LICENSE.formCode} — ${LICENSE.formDescription}`} />
        <Row label="Establishment" value={LICENSE.establishmentName} bold />
        <Row label="Employer" value={LICENSE.employerName} />
        <Row label="Nature of business" value={LICENSE.natureOfBusiness} />
        <Row
          label="Registered address"
          value={
            <>
              {LICENSE.address.line1}
              <br />
              {LICENSE.address.line2}
              <br />
              {LICENSE.address.city}, {LICENSE.address.state} {LICENSE.address.pin}
            </>
          }
        />
        <Row label="Registered on" value={LICENSE.registeredOn} />
        <Row label="Last renewed" value={LICENSE.lastRenewedOn} />
        <Row label="Valid until" value={<span className="font-semibold text-emerald-700">{LICENSE.validUntil}</span>} />
        <Row label="Issued by" value={LICENSE.authority} />
      </div>

      {/* Footer band with download */}
      <div className="flex flex-col items-start gap-3 border-t border-slate-100 bg-slate-50 px-7 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
        <div className="text-[0.78rem] text-slate-600">
          The original certificate has been redacted to hide the founder&apos;s
          personal contact details. The registration record is fully verifiable.
        </div>
        <DownloadButton />
      </div>
    </div>
  );
}

/* ──────────────────────────── compact ──────────────────────────── */

function LicenseCompact({ className }: { className: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 shadow-[0_18px_45px_-30px_rgba(13,42,84,0.4)] ${className}`}
    >
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-700 to-navy-600 text-[1.1rem] text-white">
            🛡
          </span>
          <div>
            <div className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
              ✓ Verified business
            </div>
            <div className="mt-0.5 text-[0.92rem] font-semibold leading-snug text-navy-900">
              Govt. of Karnataka registered tax consultancy
            </div>
            <div className="mt-0.5 text-[0.78rem] text-slate-600">
              Reg. <code className="font-mono">{LICENSE.registrationNumber}</code>
              {" "}&middot; Valid until {LICENSE.validUntil}
            </div>
          </div>
        </div>
        <DownloadButton compact className="sm:ml-auto" />
      </div>
    </div>
  );
}

/* ──────────────────────────── chip (footer) ──────────────────────────── */

function LicenseChip({ className }: { className: string }) {
  return (
    <Link
      href="/disclaimer#license"
      className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[0.72rem] font-medium text-emerald-300 transition hover:bg-emerald-500/15 hover:text-emerald-200 ${className}`}
    >
      <span aria-hidden="true">✓</span>
      <span>Govt. of Karnataka registered</span>
    </Link>
  );
}

/* ──────────────────────────── shared bits ──────────────────────────── */

function Row({ label, value, bold }: { label: string; value: React.ReactNode; bold?: boolean }) {
  return (
    <div>
      <div className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className={`mt-1 text-[0.88rem] leading-relaxed ${bold ? "font-semibold text-slate-900" : "text-slate-700"}`}>
        {value}
      </div>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-emerald-200 ring-1 ring-emerald-400/30">
      <span aria-hidden="true">✓</span>
      Verified
    </span>
  );
}

function DownloadButton({
  compact,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <a
      href={LICENSE.pdfUrl}
      download={LICENSE.pdfFilename}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg bg-navy-600 text-white shadow-md transition hover:bg-navy-700 ${
        compact ? "px-3.5 py-2 text-[0.78rem]" : "px-4 py-2.5 text-[0.84rem]"
      } font-semibold ${className}`}
    >
      <span aria-hidden="true">↓</span>
      {compact ? "Download" : "Download original certificate"}
    </a>
  );
}

function ShieldEmblem() {
  return (
    <span
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20"
      aria-label="Government emblem"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    </span>
  );
}

function KarnatakaWatermark() {
  // Subtle, large, semi-transparent emblem in the header. Decorative.
  return (
    <svg
      viewBox="0 0 200 200"
      className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 opacity-[0.06]"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="3" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="2" />
      <path
        d="M100 40 L110 80 L150 80 L120 105 L130 145 L100 120 L70 145 L80 105 L50 80 L90 80 Z"
        fill="white"
      />
    </svg>
  );
}
