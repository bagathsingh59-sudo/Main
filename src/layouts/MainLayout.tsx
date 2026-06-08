import { type ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import {
  SitePromoFloating,
  SitePromoPopup,
  SitePromoStickyBar,
} from "@/components/shared/SitePromo";
import { getSiteSettings, type BannerKindConfig } from "@/services/settings";

export async function MainLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const b = settings.banner;

  /**
   * Each surface reads from its OWN config. The four are completely
   * independent — settings never cascade. All four may render at the
   * same time when each has `enabled: true` and a non-empty message.
   */
  const strip = b.strip;
  const popup = b.popup;
  const floating = b.floating;
  const sticky = b.stickyBar;

  const stripActive = isActive(strip);
  const popupActive = isActive(popup);
  const floatingActive = isActive(floating);
  const stickyActive = isActive(sticky);

  const stripData = stripActive
    ? {
        message: strip.message,
        linkUrl: strip.linkUrl || undefined,
        linkLabel: strip.linkLabel || undefined,
        tone: strip.tone,
        style: strip.style,
        // Info tones are always permanent — runtime safety net.
        dismissible: (strip.dismissible ?? false) && strip.tone !== "info",
        storageKey: storageKeyFor("strip", strip),
        // Feature parity with popup/floating/sticky surfaces:
        uiEffect: strip.uiEffect,
        logoUrl: strip.showLogo ? settings.branding.logoUrl : undefined,
        ctaStyle: strip.ctaStyle,
      }
    : null;

  const maintenance = settings.maintenance.formsDisabled
    ? { message: settings.maintenance.message }
    : null;

  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <Navbar
        links={settings.navigation.navbarLinks}
        logoUrl={settings.branding.logoUrl}
        banner={stripData}
        maintenance={maintenance}
      />
      <main id="main">{children}</main>
      <ScrollToTop />
      <Footer
        navigation={settings.navigation}
        logoUrl={settings.branding.logoUrl}
        contactInfo={settings.contactInfo}
      />
      {popupActive && (
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
          storageKey={storageKeyFor("popup", popup)}
          dismissible={(popup.dismissible ?? true) && popup.tone !== "info"}
          uiEffect={popup.uiEffect}
          logoUrl={popup.showLogo ? settings.branding.logoUrl : undefined}
          ctaStyle={popup.ctaStyle}
        />
      )}
      {floatingActive && (
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
          storageKey={storageKeyFor("floating", floating)}
          dismissible={(floating.dismissible ?? true) && floating.tone !== "info"}
          uiEffect={floating.uiEffect}
          logoUrl={floating.showLogo ? settings.branding.logoUrl : undefined}
          ctaStyle={floating.ctaStyle}
        />
      )}
      {stickyActive && (
        <SitePromoStickyBar
          eyebrow={sticky.eyebrow}
          headline={sticky.headline || ""}
          message={sticky.message}
          linkUrl={sticky.linkUrl || undefined}
          linkLabel={sticky.linkLabel || undefined}
          style={sticky.style}
          tone={sticky.tone}
          frequency={sticky.frequency}
          storageKey={storageKeyFor("sticky", sticky)}
          dismissible={(sticky.dismissible ?? true) && sticky.tone !== "info"}
          uiEffect={sticky.uiEffect}
          logoUrl={sticky.showLogo ? settings.branding.logoUrl : undefined}
          ctaStyle={sticky.ctaStyle}
        />
      )}
    </SmoothScrollProvider>
  );
}

function isActive(cfg: BannerKindConfig): boolean {
  return cfg.enabled && cfg.message.trim().length > 0;
}

/**
 * Hashed storage key includes the content + surface so each surface
 * tracks its own dismissal independently, and a refreshed campaign
 * (any field change) re-engages users who dismissed the previous run.
 */
function storageKeyFor(kind: string, cfg: BannerKindConfig): string {
  const seed = cfg.message + cfg.linkUrl + cfg.linkLabel + cfg.headline;
  return `vc-promo:${kind}:${hashString(seed)}`;
}

function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}
