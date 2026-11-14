import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { SitePromoFloating, SitePromoPopup, SitePromoStickyBar } from "@/components/shared/SitePromo";
import { getSiteSettings, type BannerKindConfig } from "@/services/settings";
import { FooterFour } from "./legacy/FooterFour";
import { LegacySection } from "./legacy/LegacySection";
import { OrisaHeader } from "./OrisaHeader";
import { ORISA_MOTION, ORISA_PALETTE } from "./config";
import "@/styles/orisa/index.scss";
import "@/styles/orisa/legacy.css";

/**
 * Page shell for the redesigned (Orisa-based) pages.
 *
 * Everything inside the `.orisa` wrapper reads the design tokens in
 * `src/styles/orisa/_tokens.scss`; palette and light/dark are plain
 * attributes on that wrapper. Admin-driven pieces (logo, contact info,
 * promo popup / floating card / sticky bar) keep working unchanged.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function OrisaLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const ci = settings.contactInfo;
  const { popup, floating, stickyBar: sticky } = settings.banner;
  const logo = settings.branding.logoUrl;

  return (
    <SmoothScrollProvider>
      <div className={`orisa ${dmSans.variable}`} data-palette={ORISA_PALETTE} data-theme="light" data-motion={ORISA_MOTION}>
        <OrisaHeader
          logoUrl={logo || undefined}
          meta={{
            key: "Govt. of Karnataka registered · Since 2018",
            hours: ci.hours,
            phone: ci.phone,
            note: `${ci.city} · Bidar · Hyderabad`,
          }}
          contact={{
            phone: ci.phone,
            email: ci.email,
            address: [ci.addressLine1, ci.addressLine2, `${ci.city}, ${ci.state} ${ci.pin}`],
            hours: ci.hours,
          }}
        />
        <main id="main">{children}</main>
        {/* Orisa index-4 footer */}
        <LegacySection className="o-footer-4">
          <FooterFour />
        </LegacySection>
      </div>
      <ScrollToTop />

      {isActive(popup) && (
        <SitePromoPopup
          eyebrow={popup.eyebrow}
          headline={popup.headline || "An update from our compliance desk"}
          message={popup.message}
          linkUrl={popup.linkUrl || undefined}
          linkLabel={popup.linkLabel || undefined}
          secondaryLabel={popup.secondaryLabel || undefined}
          secondaryUrl={popup.secondaryUrl || undefined}
          style={popup.style}
          tone={popup.tone}
          frequency={popup.frequency}
          showDelaySec={popup.showDelaySec}
          storageKey={storageKey("popup", popup)}
          dismissible={(popup.dismissible ?? true) && popup.tone !== "info"}
          uiEffect={popup.uiEffect}
          logoUrl={popup.showLogo ? logo : undefined}
          ctaStyle={popup.ctaStyle}
        />
      )}
      {isActive(floating) && (
        <SitePromoFloating
          eyebrow={floating.eyebrow}
          headline={floating.headline || "Talk to our desk"}
          message={floating.message}
          linkUrl={floating.linkUrl || undefined}
          linkLabel={floating.linkLabel || undefined}
          style={floating.style}
          tone={floating.tone}
          frequency={floating.frequency}
          position={floating.floatingPosition}
          storageKey={storageKey("floating", floating)}
          dismissible={(floating.dismissible ?? true) && floating.tone !== "info"}
          uiEffect={floating.uiEffect}
          logoUrl={floating.showLogo ? logo : undefined}
          ctaStyle={floating.ctaStyle}
        />
      )}
      {isActive(sticky) && (
        <SitePromoStickyBar
          eyebrow={sticky.eyebrow}
          headline={sticky.headline || ""}
          message={sticky.message}
          linkUrl={sticky.linkUrl || undefined}
          linkLabel={sticky.linkLabel || undefined}
          style={sticky.style}
          tone={sticky.tone}
          frequency={sticky.frequency}
          storageKey={storageKey("sticky", sticky)}
          dismissible={(sticky.dismissible ?? true) && sticky.tone !== "info"}
          uiEffect={sticky.uiEffect}
          logoUrl={sticky.showLogo ? logo : undefined}
          ctaStyle={sticky.ctaStyle}
        />
      )}
    </SmoothScrollProvider>
  );
}

function isActive(cfg: BannerKindConfig): boolean {
  return cfg.enabled && cfg.message.trim().length > 0;
}

function storageKey(kind: string, cfg: BannerKindConfig): string {
  const seed = cfg.message + cfg.linkUrl + cfg.linkLabel + cfg.headline;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return `vc-promo:${kind}:${Math.abs(h).toString(36)}`;
}
