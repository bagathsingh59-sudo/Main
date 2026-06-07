"use client";

/**
 * SitePromo — popup + floating-card promotion surfaces.
 *
 * Rendered by MainLayout from admin-editable `settings.banner` when
 * `banner.kind` is "popup" or "floating". The slim header strip is
 * still rendered by Navbar (`banner.kind === "strip"`).
 *
 * Frequency gating:
 *   - "session": sessionStorage flag — re-shows after browser restart
 *   - "once":    localStorage flag — only shows once per device
 *   - "always":  no gating (test only)
 *
 * Dismissals are always sticky for the chosen frequency window.
 */

import { useEffect, useState } from "react";
import Link from "next/link";

export type PromoStyle = "neutral" | "gradient" | "glass" | "branded";
export type PromoTone = "info" | "warning" | "success";
export type PromoFrequency = "session" | "once" | "always";

interface PromoCommon {
  message: string;
  linkUrl?: string;
  linkLabel?: string;
  style: PromoStyle;
  tone: PromoTone;
  frequency: PromoFrequency;
  storageKey: string;
}

interface PopupProps extends PromoCommon {
  headline: string;
  eyebrow: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  showDelaySec: number;
}

interface FloatingProps extends PromoCommon {
  headline: string;
  eyebrow: string;
  position: "bottom-right" | "bottom-left";
}

/* ────────────────────────── shared helpers ────────────────────────── */

function alreadyDismissed(key: string, freq: PromoFrequency): boolean {
  if (typeof window === "undefined") return true;
  if (freq === "always") return false;
  try {
    if (freq === "session") return sessionStorage.getItem(key) === "1";
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function markDismissed(key: string, freq: PromoFrequency) {
  if (typeof window === "undefined" || freq === "always") return;
  try {
    if (freq === "session") sessionStorage.setItem(key, "1");
    else localStorage.setItem(key, "1");
  } catch {
    /* private mode — accept that it'll re-show */
  }
}

const SURFACE_STYLES: Record<PromoStyle, string> = {
  neutral:
    "bg-white text-slate-900 border border-slate-200 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.35)]",
  gradient:
    "bg-gradient-to-br from-navy-700 via-navy-600 to-teal-500 text-white shadow-[0_25px_60px_-20px_rgba(13,42,84,0.55)]",
  glass:
    "bg-white/85 text-slate-900 backdrop-blur-xl border border-white/40 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.4)]",
  branded:
    "bg-navy-700 text-white shadow-[0_25px_60px_-20px_rgba(13,42,84,0.55)]",
};

const ACCENT_FOR_NEUTRAL: Record<PromoTone, string> = {
  info: "text-navy-600",
  warning: "text-amber-600",
  success: "text-emerald-600",
};

/* ────────────────────────── popup ────────────────────────── */

export function SitePromoPopup(props: PopupProps) {
  const {
    headline,
    eyebrow,
    message,
    linkUrl,
    linkLabel,
    secondaryLabel,
    secondaryUrl,
    style,
    tone,
    frequency,
    storageKey,
    showDelaySec,
  } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alreadyDismissed(storageKey, frequency)) return;
    const ms = Math.max(0, showDelaySec) * 1000;
    const timer = setTimeout(() => setOpen(true), ms);
    return () => clearTimeout(timer);
  }, [storageKey, frequency, showDelaySec]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    markDismissed(storageKey, frequency);
  }

  if (!open) return null;

  const surface = SURFACE_STYLES[style] ?? SURFACE_STYLES.neutral;
  const accent = style === "neutral" ? ACCENT_FOR_NEUTRAL[tone] : "text-white/85";
  const titleClass = style === "neutral" || style === "glass" ? "text-slate-900" : "text-white";
  const bodyClass = style === "neutral" || style === "glass" ? "text-slate-600" : "text-white/85";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-promo-headline"
      className="fixed inset-0 z-[300] flex items-center justify-center px-4 sm:px-6"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={close}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
      />
      {/* card */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl ${surface} animate-in fade-in zoom-in-95 duration-200`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[1.1rem] transition ${
            style === "neutral" || style === "glass"
              ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
              : "bg-white/15 text-white/80 hover:bg-white/25"
          }`}
        >
          ×
        </button>
        <div className="px-7 pt-8 pb-7 sm:px-8 sm:pt-9 sm:pb-8">
          {eyebrow && (
            <div className={`mb-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${accent}`}>
              {eyebrow}
            </div>
          )}
          {headline && (
            <h2
              id="site-promo-headline"
              className={`mb-3 text-[1.4rem] font-bold leading-tight sm:text-[1.55rem] ${titleClass}`}
            >
              {headline}
            </h2>
          )}
          {message && (
            <p className={`mb-6 text-[0.95rem] leading-[1.65] ${bodyClass}`}>{message}</p>
          )}
          <div className="flex flex-wrap items-center gap-2.5">
            {linkUrl && linkLabel && (
              <Link
                href={linkUrl}
                onClick={close}
                className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-[0.88rem] font-semibold transition ${
                  style === "neutral" || style === "glass"
                    ? "bg-navy-600 text-white hover:bg-navy-700"
                    : "bg-white text-navy-700 hover:bg-slate-100"
                }`}
              >
                {linkLabel}
              </Link>
            )}
            {secondaryUrl && secondaryLabel && (
              <Link
                href={secondaryUrl}
                onClick={close}
                className={`inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-[0.88rem] font-semibold transition ${
                  style === "neutral" || style === "glass"
                    ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── floating card ────────────────────────── */

export function SitePromoFloating(props: FloatingProps) {
  const {
    headline,
    eyebrow,
    message,
    linkUrl,
    linkLabel,
    style,
    tone,
    frequency,
    storageKey,
    position,
  } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alreadyDismissed(storageKey, frequency)) return;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [storageKey, frequency]);

  if (!open) return null;

  const surface = SURFACE_STYLES[style] ?? SURFACE_STYLES.neutral;
  const accent = style === "neutral" ? ACCENT_FOR_NEUTRAL[tone] : "text-white/85";
  const titleClass = style === "neutral" || style === "glass" ? "text-slate-900" : "text-white";
  const bodyClass = style === "neutral" || style === "glass" ? "text-slate-600" : "text-white/85";
  const positionClass = position === "bottom-left" ? "left-4 sm:left-6" : "right-4 sm:right-6";

  function close() {
    setOpen(false);
    markDismissed(storageKey, frequency);
  }

  return (
    <div
      className={`fixed bottom-4 z-[200] w-[calc(100vw-2rem)] max-w-sm sm:bottom-6 ${positionClass} animate-in slide-in-from-bottom-3 fade-in duration-300`}
      role="complementary"
      aria-label="Site promo"
    >
      <div className={`relative overflow-hidden rounded-xl p-5 ${surface}`}>
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          className={`absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[0.85rem] transition ${
            style === "neutral" || style === "glass"
              ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
              : "bg-white/15 text-white/80 hover:bg-white/25"
          }`}
        >
          ×
        </button>
        {eyebrow && (
          <div className={`mb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${accent}`}>
            {eyebrow}
          </div>
        )}
        {headline && (
          <div className={`mb-1.5 text-[1rem] font-bold leading-snug ${titleClass}`}>
            {headline}
          </div>
        )}
        {message && (
          <p className={`mb-3.5 text-[0.84rem] leading-[1.55] ${bodyClass}`}>{message}</p>
        )}
        {linkUrl && linkLabel && (
          <Link
            href={linkUrl}
            onClick={close}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.82rem] font-semibold transition ${
              style === "neutral" || style === "glass"
                ? "bg-navy-600 text-white hover:bg-navy-700"
                : "bg-white text-navy-700 hover:bg-slate-100"
            }`}
          >
            {linkLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
