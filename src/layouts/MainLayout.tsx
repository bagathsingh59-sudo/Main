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
import type { UiEffectKind } from "@/components/shared/UiEffectOverlay";
import { getSiteSettings } from "@/services/settings";

export async function MainLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const b = settings.banner;
  const enabledMaster = b.enabled && b.message.trim();

  /**
   * Inline-CSS-style cascade for UI effect:
   *   1. Per-banner `uiEffect` (most specific) — when "default", inherit
   *   2. `globalUiEffect` (site-wide) — fallback
   * Equivalent to: inline style > stylesheet, with the editor field
   * marked "default" deferring to the global setting.
   */
  const effectiveEffect: UiEffectKind =
    b.uiEffect && b.uiEffect !== "default" ? (b.uiEffect as UiEffectKind) : b.globalUiEffect ?? "none";

  const ctaStyle = b.ctaStyle ?? "solid";
  const logoUrl = b.showLogo ? settings.branding.logoUrl : undefined;

  /**
   * Per-kind activation. Each kind has its own enable flag — multiple
   * may be on simultaneously (permanent strip + lead-capture popup).
   * Falls back to the legacy single-banner model when none of the
   * individual switches are on, using `b.kind` to choose the surface.
   */
  const anyKindToggled =
    b.enableStrip || b.enablePopup || b.enableFloating || b.enableStickyBar;
  const stripActive = enabledMaster && (anyKindToggled ? b.enableStrip : b.kind === "strip");
  const popupActive = enabledMaster && (anyKindToggled ? b.enablePopup : b.kind === "popup");
  const floatingActive = enabledMaster && (anyKindToggled ? b.enableFloating : b.kind === "floating");
  const stickyActive = enabledMaster && (anyKindToggled ? b.enableStickyBar : b.kind === "sticky-bar");

  function keyFor(kind: string): string {
    return `vc-promo:${kind}:${hashString(b.message + b.linkUrl + b.linkLabel + b.popupHeadline)}`;
  }

  const stripData = stripActive
    ? {
        message: b.message,
        linkUrl: b.linkUrl || undefined,
        linkLabel: b.linkLabel || undefined,
        tone: b.tone,
        style: b.style ?? "neutral",
        // Info tones are always permanent — runtime safety net.
        dismissible: (b.dismissible ?? false) && b.tone !== "info",
        storageKey: keyFor("strip"),
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
          eyebrow={b.popupEyebrow}
          headline={b.popupHeadline || "An update from our compliance desk"}
          message={b.message}
          linkUrl={b.linkUrl || undefined}
          linkLabel={b.linkLabel || undefined}
          secondaryLabel={b.popupCtaSecondaryLabel || undefined}
          secondaryUrl={b.popupCtaSecondaryUrl || undefined}
          style={b.style ?? "neutral"}
          tone={b.tone}
          frequency={b.popupFrequency ?? "session"}
          showDelaySec={b.popupShowDelaySec ?? 4}
          storageKey={keyFor("popup")}
          dismissible={(b.dismissible ?? true) && b.tone !== "info"}
          uiEffect={effectiveEffect}
          logoUrl={logoUrl}
          ctaStyle={ctaStyle}
        />
      )}
      {floatingActive && (
        <SitePromoFloating
          eyebrow={b.popupEyebrow}
          headline={b.popupHeadline || "Talk to our desk"}
          message={b.message}
          linkUrl={b.linkUrl || undefined}
          linkLabel={b.linkLabel || undefined}
          style={b.style ?? "neutral"}
          tone={b.tone}
          frequency={b.popupFrequency ?? "session"}
          position={b.floatingPosition ?? "bottom-right"}
          storageKey={keyFor("floating")}
          dismissible={(b.dismissible ?? true) && b.tone !== "info"}
          uiEffect={effectiveEffect}
          logoUrl={logoUrl}
          ctaStyle={ctaStyle}
        />
      )}
      {stickyActive && (
        <SitePromoStickyBar
          eyebrow={b.popupEyebrow}
          headline={b.popupHeadline || ""}
          message={b.message}
          linkUrl={b.linkUrl || undefined}
          linkLabel={b.linkLabel || undefined}
          style={b.style ?? "gradient"}
          tone={b.tone}
          frequency={b.popupFrequency ?? "session"}
          storageKey={keyFor("sticky-bar")}
          dismissible={(b.dismissible ?? true) && b.tone !== "info"}
          uiEffect={effectiveEffect}
          logoUrl={logoUrl}
          ctaStyle={ctaStyle}
        />
      )}
    </SmoothScrollProvider>
  );
}

/** Tiny string hash so the storage key is short + deterministic. */
function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}
