"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { BANNER_STYLE, StripCtaInner, stripCtaClass, type BannerData } from "./Navbar";
import { UiEffectOverlay } from "./UiEffectOverlay";

/**
 * Admin-driven strips shown above the site header: the maintenance
 * notice (Admin → Maintenance) and the announcement strip
 * (Admin → Banner → Top strip). Same look and behaviour as the strips
 * inside the old Navbar, for layouts that bring their own header.
 */
export function SiteStrips({ banner, maintenance }: { banner?: BannerData | null; maintenance?: { message: string } | null }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!banner?.storageKey || !banner.dismissible || banner.tone === "info") return;
    try {
      if (sessionStorage.getItem(banner.storageKey) === "1") setDismissed(true);
    } catch {
      /* private mode */
    }
  }, [banner?.storageKey, banner?.dismissible, banner?.tone]);

  const dismiss = () => {
    try {
      if (banner?.storageKey) sessionStorage.setItem(banner.storageKey, "1");
    } catch {
      /* private mode */
    }
    setDismissed(true);
  };

  const canDismiss = banner?.dismissible === true && banner.tone !== "info";
  const showBanner = !!banner?.message && !dismissed;
  if (!maintenance && !showBanner) return null;

  return (
    <div className="site-strips relative z-[60]">
      {maintenance && (
        <div className="bg-amber-500 text-white" role="status">
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

      {showBanner && banner && (
        <div className={cn(BANNER_STYLE[banner.style ?? "neutral"](banner.tone), "relative overflow-hidden")}>
          <UiEffectOverlay effect={banner.uiEffect ?? "none"} surface={banner.style === "apple-glass" || banner.style === "glass" ? "light" : "dark"} />
          <div className="relative z-[1] mx-auto flex max-w-7xl items-center gap-2 px-3 py-1.5 sm:gap-3 sm:px-8 sm:py-2">
            {banner.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={banner.logoUrl} alt="" className="h-5 w-auto flex-shrink-0 opacity-90 sm:h-6" />
            )}
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[0.72rem] leading-snug sm:text-[0.82rem]">
              <span className="font-medium">{banner.message}</span>
              {banner.linkUrl && banner.linkLabel && (
                <Link href={banner.linkUrl} className={stripCtaClass(banner.style ?? "neutral", banner.ctaStyle ?? "solid")}>
                  <StripCtaInner ctaStyle={banner.ctaStyle ?? "solid"} label={banner.linkLabel} />
                </Link>
              )}
            </div>
            {canDismiss && (
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[0.9rem] leading-none transition",
                  banner.style === "glass" || banner.style === "apple-glass" ? "text-navy-700/70 hover:bg-navy-700/10" : "text-white/70 hover:bg-white/15",
                )}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
