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
import { UiEffectOverlay } from "./UiEffectOverlay";

export type PromoStyle = "neutral" | "gradient" | "glass" | "apple-glass" | "branded";
export type PromoTone = "info" | "warning" | "success";
export type PromoFrequency = "session" | "once" | "always";
export type PromoCtaStyle =
  | "solid"
  | "outline"
  | "glow"
  | "pill"
  | "shimmer"
  | "slide"
  | "draw-outline"
  | "gradient-shadow"
  | "neubrutalism";

interface PromoCommon {
  message: string;
  linkUrl?: string;
  linkLabel?: string;
  style: PromoStyle;
  tone: PromoTone;
  frequency: PromoFrequency;
  storageKey: string;
  /** When true and tone !== "info", show an × dismiss button. */
  dismissible?: boolean;
  /** CSS-only decorative overlay (confetti, snow, etc.). */
  uiEffect?: import("./UiEffectOverlay").UiEffectKind;
  /** Optional brand logo URL — rendered top-left when set. */
  logoUrl?: string;
  /** CTA button visual variant. */
  ctaStyle?: PromoCtaStyle;
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

interface StickyBarProps extends PromoCommon {
  headline: string;
  eyebrow: string;
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
  // Legacy "glass" (kept for backwards compat with saved settings)
  glass:
    "bg-white/85 text-slate-900 backdrop-blur-xl border border-white/40 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.4)]",
  // Apple-style frosted glass with blue tint, inner highlight ring and
  // layered shadow. Pairs well against any hero / dark page.
  "apple-glass":
    "text-slate-900 backdrop-blur-2xl backdrop-saturate-150 " +
    "bg-[linear-gradient(135deg,rgba(255,255,255,0.85)_0%,rgba(219,234,254,0.78)_45%,rgba(186,230,253,0.7)_100%)] " +
    "ring-1 ring-inset ring-white/60 " +
    "shadow-[0_28px_70px_-25px_rgba(13,42,84,0.45),inset_0_1px_0_rgba(255,255,255,0.9)]",
  branded:
    "bg-navy-700 text-white shadow-[0_25px_60px_-20px_rgba(13,42,84,0.55)]",
};

/**
 * Returns true when the surface is "light" (dark text on a pale
 * background). Used to flip overlay/effect contrast.
 */
function isLightSurface(style: PromoStyle): boolean {
  return style === "neutral" || style === "glass" || style === "apple-glass";
}

/**
 * CTA button variant — adapts to surface + ctaStyle. All variants stack
 * full-width on mobile and inline at ≥ sm. Classic variants (solid /
 * outline / glow / pill) are pure Tailwind. The hover.dev-inspired set
 * (shimmer / slide / draw-outline / gradient-shadow / neubrutalism)
 * relies on the .cta-* helper classes in globals.css for the animations.
 */
function ctaClass(style: PromoStyle, ctaStyle: PromoCtaStyle, primary: boolean): string {
  const light = isLightSurface(style);
  const base =
    "relative inline-flex items-center justify-center font-semibold w-full sm:w-auto text-[0.9rem] " +
    "transition-all overflow-hidden " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  const radius = ctaStyle === "pill" ? "rounded-full px-6 py-3" : "rounded-xl px-5 py-2.5";

  // Secondary CTA stays subtle across all variants.
  if (!primary) {
    return `${base} ${radius} ${
      light
        ? "border border-slate-300 text-slate-700 hover:bg-slate-50"
        : "border border-white/40 text-white hover:bg-white/10"
    }`;
  }

  // Resolved fill / text colours for the light vs dark surfaces.
  const solidFill = light
    ? "bg-navy-600 text-white hover:bg-navy-700 shadow-md"
    : "bg-white text-navy-700 hover:bg-slate-100 shadow-md";

  switch (ctaStyle) {
    case "outline":
      return `${base} ${radius} ${
        light
          ? "border-2 border-navy-600 text-navy-700 hover:bg-navy-600 hover:text-white"
          : "border-2 border-white text-white hover:bg-white hover:text-navy-700"
      }`;

    case "glow":
      return `${base} ${radius} ${
        light
          ? "bg-gradient-to-r from-navy-700 to-teal-500 text-white shadow-[0_8px_30px_-5px_rgba(20,184,166,0.55)] hover:shadow-[0_12px_40px_-5px_rgba(20,184,166,0.7)]"
          : "bg-white text-navy-700 shadow-[0_8px_30px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_12px_40px_-5px_rgba(255,255,255,0.55)]"
      }`;

    case "shimmer":
      // Filled surface + animated shine sweep overlay (overlay markup is
      // injected by the renderer below — see CtaInner).
      return `${base} ${radius} cta-shimmer ${solidFill}`;

    case "slide":
      // Solid background; the inner content + arrow animate horizontally.
      return `${base} ${radius} cta-slide ${solidFill}`;

    case "draw-outline":
      // Transparent base, brand text, traced border on hover.
      return `${base} ${radius} cta-draw-outline ${
        light ? "text-navy-700" : "text-white"
      } border border-transparent bg-transparent`;

    case "gradient-shadow":
      // Solid fill + blooming brand-gradient halo underneath on hover.
      return `${base} ${radius} cta-gradient-shadow ${
        light ? "bg-navy-700 text-white" : "bg-white text-navy-700"
      } z-[1]`;

    case "neubrutalism":
      // Bold border + offset shadow that snaps in.
      return `${base} ${radius} cta-neubrutalism ${
        light ? "bg-white text-navy-700" : "bg-navy-700 text-white"
      }`;

    // solid + pill default
    default:
      return `${base} ${radius} ${solidFill}`;
  }
}

/**
 * Wrap CTA label so style-specific decorators (e.g. shimmer overlay,
 * slide arrow) can be injected without callers caring.
 */
function CtaInner({
  ctaStyle,
  label,
}: {
  ctaStyle: PromoCtaStyle;
  label: string;
}) {
  if (ctaStyle === "shimmer") {
    return (
      <>
        <span className="relative z-[1]">{label}</span>
        <span className="cta-shimmer-overlay" aria-hidden="true" />
      </>
    );
  }
  if (ctaStyle === "slide") {
    return (
      <span className="cta-slide-inner">
        <span>{label}</span>
        <span className="cta-slide-arrow" aria-hidden="true">→</span>
      </span>
    );
  }
  return <>{label}</>;
}

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
    dismissible = true,
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

  const { uiEffect = "none", logoUrl, ctaStyle = "solid" } = props;
  const surface = SURFACE_STYLES[style] ?? SURFACE_STYLES.neutral;
  const light = isLightSurface(style);
  const accent = light ? ACCENT_FOR_NEUTRAL[tone] : "text-white/85";
  const titleClass = light ? "text-slate-900" : "text-white";
  const bodyClass = light ? "text-slate-600" : "text-white/85";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-promo-headline"
      className="fixed inset-0 z-[300] flex items-center justify-center px-4 sm:px-6"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={close}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
      />
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl ${surface} animate-in fade-in zoom-in-95 duration-200`}
      >
        <UiEffectOverlay effect={uiEffect} surface={light ? "light" : "dark"} />
        {dismissible && (
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[1.1rem] transition ${
              light
                ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                : "bg-white/15 text-white/80 hover:bg-white/25"
            }`}
          >
            ×
          </button>
        )}
        <div className="relative z-[1] px-6 pt-7 pb-7 sm:px-8 sm:pt-9 sm:pb-8">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="mb-4 h-9 w-auto" />
          )}
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
          {/* CTAs — stack vertically on mobile, inline at sm+ */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            {linkUrl && linkLabel && (
              <Link href={linkUrl} onClick={close} className={ctaClass(style, ctaStyle, true)}>
                <CtaInner ctaStyle={ctaStyle} label={linkLabel} />
              </Link>
            )}
            {secondaryUrl && secondaryLabel && (
              <Link href={secondaryUrl} onClick={close} className={ctaClass(style, ctaStyle, false)}>
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
    dismissible = true,
  } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alreadyDismissed(storageKey, frequency)) return;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [storageKey, frequency]);

  if (!open) return null;

  const { uiEffect = "none", logoUrl, ctaStyle = "solid" } = props;
  const surface = SURFACE_STYLES[style] ?? SURFACE_STYLES.neutral;
  const light = isLightSurface(style);
  const accent = light ? ACCENT_FOR_NEUTRAL[tone] : "text-white/85";
  const titleClass = light ? "text-slate-900" : "text-white";
  const bodyClass = light ? "text-slate-600" : "text-white/85";
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
      <div className={`relative overflow-hidden rounded-xl ${surface}`}>
        <UiEffectOverlay effect={uiEffect} surface={light ? "light" : "dark"} />
        <div className="relative z-[1] p-5">
          {dismissible && (
            <button
              type="button"
              onClick={close}
              aria-label="Dismiss"
              className={`absolute right-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-[0.85rem] transition ${
                light
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : "bg-white/15 text-white/80 hover:bg-white/25"
              }`}
            >
              ×
            </button>
          )}
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="mb-3 h-7 w-auto" />
          )}
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
            <p className={`mb-4 text-[0.84rem] leading-[1.55] ${bodyClass}`}>{message}</p>
          )}
          {linkUrl && linkLabel && (
            <Link href={linkUrl} onClick={close} className={ctaClass(style, ctaStyle, true)}>
              <CtaInner ctaStyle={ctaStyle} label={linkLabel} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── sticky bottom bar ────────────────────────── */

/**
 * Full-width bar pinned to the bottom of the viewport.
 * Perfect for evergreen lead-capture ("Free 45-min audit") that should
 * sit alongside, but never block, the page content.
 */
export function SitePromoStickyBar(props: StickyBarProps) {
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
    dismissible = true,
  } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alreadyDismissed(storageKey, frequency)) return;
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, [storageKey, frequency]);

  if (!open) return null;

  const surface = SURFACE_STYLES[style] ?? SURFACE_STYLES.gradient;
  const accent = style === "neutral" ? ACCENT_FOR_NEUTRAL[tone] : "text-white/85";
  const { uiEffect = "none", logoUrl, ctaStyle = "solid" } = props;
  const light = isLightSurface(style);
  const titleClass = light ? "text-slate-900" : "text-white";
  const bodyClass = light ? "text-slate-600" : "text-white/85";

  function close() {
    setOpen(false);
    markDismissed(storageKey, frequency);
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[180] animate-in slide-in-from-bottom-2 fade-in duration-300"
      role="complementary"
      aria-label="Site promo"
    >
      <div className={`mx-3 sm:mx-6 mx-auto max-w-7xl ${surface} overflow-hidden rounded-t-2xl relative`}>
        <UiEffectOverlay effect={uiEffect} surface={light ? "light" : "dark"} />
        <div className="relative z-[1] flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-7 sm:py-4">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-8 w-auto flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <div className={`mb-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${accent}`}>
                {eyebrow}
              </div>
            )}
            {headline && (
              <div className={`text-[0.95rem] font-bold leading-snug sm:text-[1.05rem] ${titleClass}`}>
                {headline}
              </div>
            )}
            {message && (
              <p className={`mt-0.5 text-[0.78rem] leading-[1.5] sm:text-[0.85rem] ${bodyClass}`}>
                {message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 sm:flex-shrink-0">
            {linkUrl && linkLabel && (
              <Link href={linkUrl} onClick={close} className={ctaClass(style, ctaStyle, true)}>
                <CtaInner ctaStyle={ctaStyle} label={linkLabel} />
              </Link>
            )}
            {dismissible && (
              <button
                type="button"
                onClick={close}
                aria-label="Dismiss"
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[1rem] transition ${
                  light
                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    : "bg-white/15 text-white/80 hover:bg-white/25"
                }`}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
