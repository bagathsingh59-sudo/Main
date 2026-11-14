/**
 * Shared configuration for the Orisa-based pages.
 *
 * PALETTE — "brand" (Vaishnavi navy + teal) or "orisa" (the template's
 * neutral + orange). Change the default with NEXT_PUBLIC_ORISA_PALETTE,
 * or preview the other one on any page with `?palette=orisa` / `?palette=brand`.
 */
export type OrisaPalette = "brand" | "orisa";

export const ORISA_PALETTE: OrisaPalette =
  process.env.NEXT_PUBLIC_ORISA_PALETTE === "orisa" ? "orisa" : "brand";

/**
 * MOTION — "always" plays every effect; "respect-user" switches the
 * scroll and entrance effects off for visitors whose device has
 * "Reduce motion" turned on. Set NEXT_PUBLIC_ORISA_MOTION=respect-user
 * to change it.
 */
export type OrisaMotion = "always" | "respect-user";

export const ORISA_MOTION: OrisaMotion =
  process.env.NEXT_PUBLIC_ORISA_MOTION === "respect-user" ? "respect-user" : "always";

/** Client-side check used by every animated component. */
export function motionAllowed(): boolean {
  if (ORISA_MOTION === "always") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * HERO_IDEAS — optional extras on the home hero, keyed by the idea
 * number they were proposed under. Set one to `false` to remove it;
 * nothing else needs to change.
 *
 *   4  live "office open now" chip on the image
 *   5  next statutory deadlines ticker along the image's bottom edge
 *   6  headline word that cycles (Payroll → EPF → ESIC → GST …)
 *   9  image card grows from inset to full width as you scroll
 *   10 round "Explore" cursor over the image
 */
export const HERO_IDEAS: Record<4 | 5 | 6 | 9 | 10, boolean> = {
  4: true,
  5: true,
  6: true,
  9: true,
  10: true,
};

export interface OrisaNavLink {
  label: string;
  href: string;
  /** Small pill shown after the label (e.g. "New"). */
  badge?: string;
}

/** Primary tabs for the redesigned site. */
export const ORISA_NAV: readonly OrisaNavLink[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "VaishnaviPay", href: "/vaishnavi-pay", badge: "New" },
  { label: "Contact us", href: "/contact" },
];

/** Static destinations offered by the header search. */
export const ORISA_SEARCH_INDEX: readonly { label: string; href: string; kind: string }[] = [
  { label: "Home", href: "/", kind: "Page" },
  { label: "About us", href: "/about", kind: "Page" },
  { label: "Services", href: "/services", kind: "Page" },
  { label: "VaishnaviPay — payroll & compliance software", href: "/vaishnavi-pay", kind: "Product" },
  { label: "Contact us", href: "/contact", kind: "Page" },
  { label: "Book a free consultation", href: "/contact#book", kind: "Action" },
  { label: "Compliance calculator", href: "/services#calculator", kind: "Tool" },
];
