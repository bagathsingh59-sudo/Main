import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { SitePromoFloating, SitePromoPopup, SitePromoStickyBar } from "@/components/shared/SitePromo";
import { SiteStrips } from "@/components/shared/SiteStrips";
import { getSiteSettings, type BannerKindConfig } from "@/services/settings";
import { FooterSeven } from "./legacy/FooterSeven";
import { MagicCursor } from "./MagicCursor";
import { LegacySection } from "./legacy/LegacySection";
import { OrisaHeader } from "./OrisaHeader";
import { ORISA_MOTION, ORISA_NAV, ORISA_PALETTE, type OrisaNavLink } from "./config";
import { SERVICES } from "@/constants/services";
import { LICENSE } from "@/constants/license";
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

export async function OrisaLayout({ children, home = false }: { children: ReactNode; /** Home page: header sits over the hero with the slide-open menu. */ home?: boolean }) {
  const settings = await getSiteSettings();
  const ci = settings.contactInfo;
  const { strip, popup, floating, stickyBar: sticky } = settings.banner;
  const logo = settings.branding.logoUrl;
  const nav = settings.navigation;

  /* The site is exactly the five pages in ORISA_NAV, in that order.
     Admin → Navbar can rename one (matched by its URL) or hide it;
     links to any other URL in saved settings are ignored. */
  const links: OrisaNavLink[] = ORISA_NAV.flatMap((page) => {
    const saved = nav.navbarLinks.find((l) => l.href === page.href);
    if (saved?.visible === false) return [];
    return [{ ...page, label: saved?.label.trim() || page.label }];
  });

  /* Admin → Footer. */
  const visible = (links: { label: string; href: string; visible: boolean }[]) =>
    links.filter((l) => l.visible !== false).map(({ label, href }) => ({ label, href }));
  const columns = nav.footerColumns;
  const legal = columns.find((c) => /legal/i.test(c.title)) ?? columns[columns.length - 1];
  const socials = nav.socialLinks
    .filter((s) => s.url.trim())
    .map((s) => ({ label: SOCIAL_LABEL[s.platform] ?? s.platform, href: s.url, platform: s.platform }));
  /* Footer link columns: every service page, the company sections and
     resources kept from the previous site. Legal links stay in the bottom
     bar; the old "Data Security" link (an About section that no longer
     exists) now opens the Privacy Policy, which covers it. */
  const services = settings.services.items.length ? settings.services.items : SERVICES;
  const footerColumns = [
    { title: "Services", links: services.map((s) => ({ label: s.title, href: `/services/${encodeURIComponent(s.id)}` })) },
    {
      title: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "Our team", href: "/about#team" },
        { label: "Our journey", href: "/about#journey" },
        { label: "VaishnaviPay", href: "/vaishnavi-pay" },
        { label: "Contact us", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "FAQs", href: "/services#faq" },
        { label: "Pricing", href: "/services#pricing" },
        { label: "Book a free consultation", href: "/contact#book" },
        { label: "Govt. registration certificate", href: LICENSE.pdfUrl, download: LICENSE.pdfFilename },
        { label: "VaishnaviPay FAQs", href: "/vaishnavi-pay#faq" },
      ],
    },
  ];
  const legalLinks = (legal ? visible(legal.links) : []).map((l) => (l.href.startsWith("/about#trust") ? { ...l, href: "/privacy" } : l));

  /* "Mon – Sat · 9:30 AM – 7:00 PM IST" → days / time */
  const [hoursDays, ...hoursRest] = ci.hours.split(/\s*·\s*/);

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
          menu={home ? "toggle" : "open"}
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
                {/* Orisa index-7 footer */}
        <LegacySection className="o-footer-7">
          <FooterSeven
            pages={links.map(({ label, href }) => ({ label, href }))}
            socials={socials}
            phones={[ci.phone, ci.altPhone].filter((p) => p.trim())}
            email={ci.email}
            address={[ci.addressLine1, ci.addressLine2, `${ci.city}, ${ci.state} ${ci.pin}`].filter((l) => l.trim())}
            hours={{ days: hoursDays, time: hoursRest.join(" · ") }}
            cta={{ title: ["Questions about payroll", "or compliance?"], label: "Book a consultation", href: "/contact" }}
            word="VAISHNAVI CONSULTANT"
            copyright={nav.copyright}
            legal={legalLinks}
            columns={footerColumns}
          />
        </LegacySection>
        <MagicCursor />
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
  twitter: "X",
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
