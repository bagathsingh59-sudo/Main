"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/constants/nav";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { cn } from "@/utils/cn";

interface BannerData {
  message: string;
  linkUrl?: string;
  linkLabel?: string;
  tone: "info" | "warning" | "success";
  /** Visual style. Defaults to "neutral" for backwards compatibility. */
  style?: "neutral" | "gradient" | "glass" | "branded";
  /** When true and tone !== "info", show an × dismiss button. */
  dismissible?: boolean;
  /** Stable key used for sessionStorage dismissal tracking. */
  storageKey?: string;
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

      {/* Announcement strip — rendered above the nav row.
          Mobile-first: tighter typography, two-row layout with link
          stacking below message on narrow screens; dismiss button when
          allowed by editor + non-info tone. */}
      {showBanner && (
        <div className={cn(BANNER_STYLE[banner.style ?? "neutral"](banner.tone), "relative")}>
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-3 py-1.5 sm:gap-3 sm:px-8 sm:py-2">
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-[0.72rem] leading-snug sm:text-[0.82rem]">
              <span className="font-medium">{banner.message}</span>
              {banner.linkUrl && banner.linkLabel && (
                <a
                  href={banner.linkUrl}
                  className={cn(
                    "font-semibold underline-offset-2 whitespace-nowrap",
                    banner.style === "glass"
                      ? "text-navy-700 underline decoration-navy-400/60 hover:decoration-navy-700"
                      : "underline decoration-white/60 hover:decoration-white",
                  )}
                >
                  {banner.linkLabel} →
                </a>
              )}
            </div>
            {canDismiss && (
              <button
                type="button"
                onClick={dismissBanner}
                aria-label="Dismiss announcement"
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[0.9rem] leading-none transition",
                  banner.style === "glass"
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
