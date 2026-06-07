import type { Certification, Award, Partner } from "@/types";

/**
 * Certifications + awards arrays are empty until real, verifiable
 * credentials are issued. The Certifications and Awards sections both
 * auto-hide when their array is empty — better to show zero than a
 * fabricated ICAI / ISO / award entry.
 *
 * Add a Certification only when you have the registration number to
 * back it. Add an Award only when the citation is documented and
 * publicly verifiable.
 */
export const CERTIFICATIONS: Certification[] = [];

export const AWARDS: Award[] = [];

/**
 * Partner logos — these are tools the firm works with day-to-day in
 * client engagements, not paid partnerships or endorsements. Safe to
 * keep because the firm does genuinely operate across these platforms.
 */
export const PARTNERS: Partner[] = [
  { id: "zoho", name: "Zoho" },
  { id: "tally", name: "Tally Solutions" },
  { id: "razorpay", name: "Razorpay" },
  { id: "keka", name: "Keka HR" },
  { id: "greythr", name: "GreytHR" },
  { id: "quickbooks", name: "QuickBooks" },
  { id: "icai-body", name: "ICAI" },
];
