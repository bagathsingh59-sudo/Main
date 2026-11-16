import type { SiteSettings } from "@/services/settings";
import { SERVICES } from "@/constants/services";
import type { ContactBlockProps } from "./legacy/ContactBlock";
import { DEFAULT_CONTACT, type SiteContact } from "./legacy/contact";
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

/** Admin → Team, led by the founder (previous site's "From the founder"). */
export function teamMembers(s: SiteSettings): TeamBlockMember[] | undefined {
  const f = s.founder;
  const founder: TeamBlockMember[] = f?.name?.trim()
    ? [{ id: "founder", name: f.name.trim(), role: f.role, image: f.image, initials: f.initials, accent: f.accent, linkedinUrl: "" }]
    : [];
  return orUndefined([...founder, ...s.team.members]);
}

/** Admin → Form config + Maintenance. */
export function contactForm(s: SiteSettings): ContactBlockProps {
  return {
    services: s.formConfig.services,
    sizes: s.formConfig.sizes,
    disabledMessage: s.maintenance.formsDisabled ? s.maintenance.message || "Enquiries are paused for a short while." : undefined,
    contact: contactDetails(s),
  };
}

/** Admin → Contact info (+ LinkedIn from Footer → social links). */
export function contactDetails(s: SiteSettings): SiteContact {
  const ci = s.contactInfo;
  const pick = (v: string | undefined, d: string) => (v && v.trim() ? v.trim() : d);
  return {
    phone: pick(ci.phone, DEFAULT_CONTACT.phone),
    altPhone: ci.altPhone?.trim() ?? "",
    email: pick(ci.email, DEFAULT_CONTACT.email),
    supportEmail: ci.supportEmail?.trim() ?? "",
    addressLine1: pick(ci.addressLine1, DEFAULT_CONTACT.addressLine1),
    addressLine2: ci.addressLine2?.trim() ?? "",
    city: pick(ci.city, DEFAULT_CONTACT.city),
    state: pick(ci.state, DEFAULT_CONTACT.state),
    pin: pick(ci.pin, DEFAULT_CONTACT.pin),
    linkedin: linkedinUrl(s) ?? DEFAULT_CONTACT.linkedin,
  };
}

/** Admin → Footer → social links. */
export function linkedinUrl(s: SiteSettings): string | undefined {
  return s.navigation.socialLinks.find((l) => l.platform === "linkedin" && l.url.trim())?.url;
}
