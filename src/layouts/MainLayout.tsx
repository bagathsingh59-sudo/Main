import { type ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { SitePromoFloating, SitePromoPopup } from "@/components/shared/SitePromo";
import { getSiteSettings } from "@/services/settings";

export async function MainLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const b = settings.banner;
  const showAny = b.enabled && b.message.trim();
  const kind = b.kind ?? "strip";

  // Only feed the strip surface to the Navbar when kind === "strip".
  // Popup / floating are rendered as their own surfaces below.
  const banner =
    showAny && kind === "strip"
      ? {
          message: b.message,
          linkUrl: b.linkUrl || undefined,
          linkLabel: b.linkLabel || undefined,
          tone: b.tone,
          style: b.style ?? "neutral",
        }
      : null;
  const maintenance = settings.maintenance.formsDisabled
    ? { message: settings.maintenance.message }
    : null;

  // Storage key changes whenever the operator updates the message — so a
  // refreshed campaign re-engages users who dismissed the previous run.
  const promoStorageKey = `vc-promo:${kind}:${hashString(b.message + b.linkUrl + b.linkLabel)}`;

  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <Navbar
        links={settings.navigation.navbarLinks}
        logoUrl={settings.branding.logoUrl}
        banner={banner}
        maintenance={maintenance}
      />
      <main id="main">{children}</main>
      <ScrollToTop />
      <Footer
        navigation={settings.navigation}
        logoUrl={settings.branding.logoUrl}
        contactInfo={settings.contactInfo}
      />
      {showAny && kind === "popup" && (
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
          storageKey={promoStorageKey}
        />
      )}
      {showAny && kind === "floating" && (
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
          storageKey={promoStorageKey}
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
