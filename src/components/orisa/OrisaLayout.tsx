import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { SitePromoFloating, SitePromoPopup, SitePromoStickyBar } from "@/components/shared/SitePromo";
import { SiteStrips } from "@/components/shared/SiteStrips";
import { getSiteSettings, type BannerKindConfig } from "@/services/settings";
import { FooterFour } from "./legacy/FooterFour";
import { LegacySection } from "./legacy/LegacySection";
import { OrisaHeader } from "./OrisaHeader";
import { ORISA_MOTION, ORISA_NAV, ORISA_PALETTE, type OrisaNavLink } from "./config";
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
  const { strip, popup, floating, stickyBar: sticky } = settings.banner;
  const logo = settings.branding.logoUrl;
  const nav = settings.navigation;

  /* Admin → Navbar. Falls back to the built-in tabs when the list is empty. */
  const adminLinks = nav.navbarLinks.filter((l) => l.visible !== false);
  const links: OrisaNavLink[] = adminLinks.length
    ? adminLinks.map((l) => ({ label: l.label, href: l.href, badge: ORISA_NAV.find((n) => n.href === l.href)?.badge }))
    : [...ORISA_NAV];

  /* Admin → Footer. */
  const visible = (links: { label: string; href: string; visible: boolean }[]) =>
    links.filter((l) => l.visible !== false).map(({ label, href }) => ({ label, href }));
  const columns = nav.footerColumns;
  const legal = columns.find((c) => /legal/i.test(c.title)) ?? columns[columns.length - 1];
  const pillsColumn = columns.find((c) => /service/i.test(c.title)) ?? columns[0];
  const socials = nav.socialLinks
    .filter((s) => s.url.trim())
    .map((s) => ({ label: SOCIAL_LABEL[s.platform] ?? s.platform, href: s.url }));

  return (
    <SmoothScrollProvider>
      <div className={`orisa ${dmSans.variable}`} data-palette={ORISA_PALETTE} data-theme="light" data-motion={ORISA_MOTION}>
        <SiteStrips
          maintenance={settings.maintenance.formsDisabled ? { message: settings.maintenance.message } : null}
          banner={
            isActive(strip)
              ? {
                  message: strip.message,
                  linkUrl: strip.linkUrl || undefined,
                  linkLabel: strip.linkLabel || undefined,
                  tone: strip.tone,
                  style: strip.style,
                  dismissible: (strip.dismissible ?? false) && strip.tone !== "info",
                  storageKey: storageKey("strip", strip),
                  uiEffect: strip.uiEffect,
                  logoUrl: strip.showLogo ? logo : undefined,
                  ctaStyle: strip.ctaStyle,
                }
              : null
          }
        />
        <OrisaHeader
          links={links}
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
          <FooterFour
            email={ci.email}
            address={[ci.addressLine1, ci.addressLine2, `${ci.city}, ${ci.state} ${ci.pin}`].filter((l) => l.trim())}
            phones={[ci.phone, ci.altPhone].filter((p) => p.trim())}
            socials={socials}
            quickLinks={links.map(({ label, href }) => ({ label, href }))}
            moreLinks={legal ? visible(legal.links) : []}
            pills={pillsColumn && pillsColumn !== legal ? visible(pillsColumn.links).slice(0, 4) : []}
            copyright={nav.copyright}
            note="[ Since 2018 ]"
          />
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

const SOCIAL_LABEL: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
};

function isActive(cfg: BannerKindConfig): boolean {
  return cfg.enabled && cfg.message.trim().length > 0;
}

function storageKey(kind: string, cfg: BannerKindConfig): string {
  const seed = cfg.message + cfg.linkUrl + cfg.linkLabel + cfg.headline;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return `vc-promo:${kind}:${Math.abs(h).toString(36)}`;
}
