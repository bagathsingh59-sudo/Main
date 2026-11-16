import type { SiteSettings } from "@/services/settings";
import { SERVICES } from "@/constants/services";
import type { ContactBlockProps } from "./legacy/ContactBlock";
import type { FaqBlockItem } from "./legacy/FaqBlock";
import type { SvcPanelItem } from "./legacy/SvcPanels";
import type { TeamBlockMember } from "./legacy/TeamBlock";

/**
 * Admin settings → props for the redesigned sections.
 * Each mapper returns `undefined` when the admin list is empty, so the
 * section falls back to its built-in placeholder content.
 */

const orUndefined = <T,>(list: T[]) => (list.length ? list : undefined);

/** Admin → Services (falls back to the bundled list). */
export function serviceRows(s: SiteSettings): SvcPanelItem[] {
  const items = s.services.items.length ? s.services.items : SERVICES;
  return items.map((it) => ({ title: it.title, summary: it.summary, href: `/services/${encodeURIComponent(it.id)}` }));
}

/** Admin → Services, one item (or undefined) — for /services/[slug]. */
export function findService(s: SiteSettings, slug: string) {
  const items = s.services.items.length ? s.services.items : SERVICES;
  return { item: items.find((it) => it.id === slug), all: items };
}

/** Admin → FAQ (questions without an answer yet are skipped). */
export function faqItems(s: SiteSettings): FaqBlockItem[] | undefined {
  return orUndefined(s.faq.items.filter((i) => i.question.trim() && i.answer.trim()));
}

/** Admin → Team. */
export function teamMembers(s: SiteSettings): TeamBlockMember[] | undefined {
  return orUndefined(s.team.members);
}

/** Admin → Form config + Maintenance. */
export function contactForm(s: SiteSettings): ContactBlockProps {
  return {
    services: s.formConfig.services,
    sizes: s.formConfig.sizes,
    disabledMessage: s.maintenance.formsDisabled ? s.maintenance.message || "Enquiries are paused for a short while." : undefined,
  };
}

/** Admin → Footer → social links. */
export function linkedinUrl(s: SiteSettings): string | undefined {
  return s.navigation.socialLinks.find((l) => l.platform === "linkedin" && l.url.trim())?.url;
}
