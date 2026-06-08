"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/constants/nav";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { UiEffectOverlay, type UiEffectKind } from "./UiEffectOverlay";
import { cn } from "@/utils/cn";

type StripCtaStyle =
  | "solid"
  | "outline"
  | "glow"
  | "pill"
  | "shimmer"
  | "slide"
  | "draw-outline"
  | "gradient-shadow"
  | "neubrutalism";

interface BannerData {
  message: string;
  linkUrl?: string;
  linkLabel?: string;
  tone: "info" | "warning" | "success";
  /** Visual style. Defaults to "neutral" for backwards compatibility. */
  style?: "neutral" | "gradient" | "glass" | "apple-glass" | "branded";
  /** When true and tone !== "info", show an × dismiss button. */
  dismissible?: boolean;
  /** Stable key used for sessionStorage dismissal tracking. */
  storageKey?: string;
  /** CSS-only decorative overlay matched to a marketing moment. */
  uiEffect?: UiEffectKind;
  /** When set, renders inline at the leading edge of the strip. */
  logoUrl?: string;
  /** CTA button variant — same library as popup/floating/sticky. */
  ctaStyle?: StripCtaStyle;
}

interface MaintenanceData {
  message: string;
}

interface NavbarProps {
  /** Admin-editable nav links. Falls back to NAV_LINKS constant. */
  links?: readonly { label: string; href: string; visible?: boolean }[];
  /** Admin-uploaded logo URL. Falls back to bundled brand asset. */
  logoUrl?: string;
  /** Announcement banner — renders above the nav row. */
  banner?: BannerData | null;
  /** Maintenance strip — renders above announcement banner. */
  maintenance?: MaintenanceData | null;
}

const BANNER_TONE: Record<BannerData["tone"], string> = {
  info: "bg-navy-600",
  warning: "bg-amber-500",
  success: "bg-emerald-600",
};

/**
 * Style variants for the strip — the "neutral" path preserves the
 * existing solid-tone behaviour so saved settings render identically.
 */
const BANNER_STYLE: Record<NonNullable<BannerData["style"]>, (tone: BannerData["tone"]) => string> = {
  neutral: (tone) => `${BANNER_TONE[tone] ?? BANNER_TONE.info} text-white`,
  gradient: () =>
    "bg-gradient-to-r from-navy-700 via-navy-600 to-teal-500 text-white shadow-[0_2px_18px_-8px_rgba(13,42,84,0.6)]",
  glass: () =>
    "bg-white/80 text-navy-900 backdrop-blur-xl border-b border-slate-200/70",
  "apple-glass": () =>
    // Stronger frosted look — higher opacity blue tint + heavier
    // saturation, layered blue under-shadow + brighter top highlight
    // so it pops away from the white nav row underneath.
    "text-navy-900 backdrop-blur-3xl backdrop-saturate-200 " +
    "bg-[linear-gradient(180deg,rgba(191,219,254,0.7)_0%,rgba(147,197,253,0.55)_100%)] " +
    "border-b-2 border-white/70 " +
    "shadow-[0_8px_24px_-6px_rgba(37,99,235,0.35),0_2px_4px_-1px_rgba(13,42,84,0.15),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(96,165,250,0.3)]",
  branded: (tone) =>
    `${BANNER_TONE[tone] ?? BANNER_TONE.info} text-white ring-1 ring-inset ring-white/15`,
};

export function Navbar({ links, logoUrl, banner, maintenance }: NavbarProps = {}) {
  const source: ReadonlyArray<{ label: string; href: string; visible?: boolean }> =
    links && links.length > 0 ? links : NAV_LINKS;
  const navLinks = source.filter((l) => l.visible !== false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const pathname = usePathname();

  // Restore banner dismissal from sessionStorage on mount.
  useEffect(() => {
    if (!banner?.storageKey || !banner.dismissible || banner.tone === "info") return;
    try {
      if (sessionStorage.getItem(banner.storageKey) === "1") setBannerDismissed(true);
    } catch {
      /* swallow */
    }
  }, [banner?.storageKey, banner?.dismissible, banner?.tone]);

  function dismissBanner() {
    if (!banner?.storageKey) return;
    try {
      sessionStorage.setItem(banner.storageKey, "1");
    } catch {
      /* swallow */
    }
    setBannerDismissed(true);
  }

  // Info-toned banners are editorially permanent — admin already forces
  // dismissible=false, but enforce here as a safety net.
  const canDismiss = banner?.dismissible === true && banner.tone !== "info";
  const showBanner = banner && banner.message && !bannerDismissed;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      {/* Maintenance strip — rendered above everything when forms are disabled. */}
      {maintenance && (
        <div className="bg-amber-500 text-white">
          <div className="mx-auto flex max-w-7xl items-start gap-2.5 px-4 py-2 text-[0.82rem] leading-snug sm:items-center sm:px-8">
            <span aria-hidden="true" className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-white/25 text-[0.65rem] font-bold sm:mt-0">
              !
            </span>
            <div>
              <strong className="font-bold uppercase tracking-[0.08em]">Maintenance · </strong>
              <span className="font-medium">{maintenance.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Announcement strip — full feature parity with popup/floating/sticky:
          UI effect overlay, logo, real button styles (ctaStyle), dismiss.
          Mobile: tightened typography + stack layout. */}
      {showBanner && (
        <div className={cn(BANNER_STYLE[banner.style ?? "neutral"](banner.tone), "relative overflow-hidden")}>
          <UiEffectOverlay
            effect={banner.uiEffect ?? "none"}
            surface={banner.style === "apple-glass" || banner.style === "glass" ? "light" : "dark"}
          />
          <div className="relative z-[1] mx-auto flex max-w-7xl items-center gap-2 px-3 py-1.5 sm:gap-3 sm:px-8 sm:py-2">
            {banner.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banner.logoUrl}
                alt=""
                className="h-5 w-auto flex-shrink-0 opacity-90 sm:h-6"
              />
            )}
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[0.72rem] leading-snug sm:text-[0.82rem]">
              <span className="font-medium">{banner.message}</span>
              {banner.linkUrl && banner.linkLabel && (
                <Link
                  href={banner.linkUrl}
                  className={stripCtaClass(banner.style ?? "neutral", banner.ctaStyle ?? "solid")}
                >
                  <StripCtaInner ctaStyle={banner.ctaStyle ?? "solid"} label={banner.linkLabel} />
                </Link>
              )}
            </div>
            {canDismiss && (
              <button
                type="button"
                onClick={dismissBanner}
                aria-label="Dismiss announcement"
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[0.9rem] leading-none transition",
                  banner.style === "glass" || banner.style === "apple-glass"
                    ? "text-navy-700/70 hover:bg-navy-700/10"
                    : "text-white/70 hover:bg-white/15",
                )}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-mist/85 backdrop-blur-xl border-b border-white/60 shadow-soft"
            : "bg-transparent",
        )}
      >
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <Logo overrideSrc={logoUrl} />

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[0.86rem] font-medium transition-colors",
                  active ? "text-navy-900" : "text-navy-900/70 hover:text-navy-900",
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-full bg-white/70 shadow-soft"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button href="/contact" size="sm" className="hidden md:inline-flex">
            Book consultation
          </Button>
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 bg-white/70 backdrop-blur"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-3.5 w-5">
              <span className={cn("absolute left-0 top-0 h-[2px] w-full rounded bg-navy-900 transition-all", open && "translate-y-[7px] rotate-45")} />
              <span className={cn("absolute left-0 top-[7px] h-[2px] w-full rounded bg-navy-900 transition-all", open && "opacity-0")} />
              <span className={cn("absolute left-0 top-[14px] h-[2px] w-full rounded bg-navy-900 transition-all", open && "-translate-y-[7px] -rotate-45")} />
            </span>
          </button>
        </div>
      </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden mx-4 mb-4 rounded-2xl border border-white/70 bg-white/95 backdrop-blur-xl shadow-elevated"
          >
            <ul className="p-3">
              {navLinks.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-[0.95rem] font-medium transition-colors",
                        active ? "bg-navy-50 text-navy-900" : "text-navy-900/80 hover:bg-navy-50",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li className="p-3">
                <Button href="/contact" className="w-full" onClick={() => setOpen(false)}>
                  Book consultation
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ──────────────────────── strip CTA helpers ──────────────────────── */

/**
 * Compact button variant for the strip — matches the same 9 ctaStyle
 * options used by popup/floating/sticky, but with tighter padding so
 * it fits inside a one-row strip.
 */
function stripCtaClass(style: BannerData["style"], ctaStyle: NonNullable<StripCtaStyle>): string {
  const light = style === "neutral" || style === "apple-glass" || style === "glass";
  // On dark strips (gradient/branded/info-navy) the button is white-on-dark,
  // matching the legibility math from SitePromo's ctaClass.
  const base =
    "relative inline-flex items-center gap-1.5 text-[0.72rem] sm:text-[0.78rem] font-semibold whitespace-nowrap " +
    "transition-all overflow-hidden " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";
  const radius = ctaStyle === "pill" ? "rounded-full px-3 py-1" : "rounded-md px-2.5 py-1";
  const solid = light
    ? "bg-navy-600 text-white hover:bg-navy-700"
    : "bg-white text-navy-700 hover:bg-slate-100";
  switch (ctaStyle) {
    case "outline":
      return `${base} ${radius} ${
        light
          ? "border border-navy-600 text-navy-700 hover:bg-navy-600 hover:text-white"
          : "border border-white text-white hover:bg-white hover:text-navy-700"
      }`;
    case "glow":
      return `${base} ${radius} ${
        light
          ? "bg-gradient-to-r from-navy-700 to-teal-500 text-white shadow-[0_4px_18px_-4px_rgba(20,184,166,0.6)] hover:shadow-[0_6px_22px_-4px_rgba(20,184,166,0.75)]"
          : "bg-white text-navy-700 shadow-[0_4px_18px_-4px_rgba(255,255,255,0.5)] hover:shadow-[0_6px_22px_-4px_rgba(255,255,255,0.65)]"
      }`;
    case "shimmer":
      return `${base} ${radius} cta-shimmer ${solid}`;
    case "slide":
      return `${base} ${radius} cta-slide ${solid}`;
    case "draw-outline":
      return `${base} ${radius} cta-draw-outline ${light ? "text-navy-700" : "text-white"} border border-transparent bg-transparent`;
    case "gradient-shadow":
      return `${base} ${radius} cta-gradient-shadow ${light ? "bg-navy-700 text-white" : "bg-white text-navy-700"} z-[1]`;
    case "neubrutalism":
      return `${base} ${radius} cta-neubrutalism ${light ? "bg-white text-navy-700" : "bg-navy-700 text-white"}`;
    default:
      return `${base} ${radius} ${solid}`;
  }
}

function StripCtaInner({ ctaStyle, label }: { ctaStyle: NonNullable<StripCtaStyle>; label: string }) {
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
  return (
    <>
      {label} <span aria-hidden="true">→</span>
    </>
  );
}
