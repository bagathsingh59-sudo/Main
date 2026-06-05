import type { Testimonial } from "@/types";

/**
 * Real, attributable client quotes only.
 *
 * Empty by intent — the prior illustrative entries (TechSurge, Greenfab, etc.)
 * were development placeholders and have been removed to comply with the
 * Consumer Protection Act 2019 §2(28) (no fabricated endorsements). Wire real
 * quotes here once written consent is on file from each client, including:
 *   - id (slug)
 *   - quote (verbatim, no edits without consent)
 *   - name + role + company (matches client's LinkedIn / business card)
 *   - rating (1-5; align with the actual feedback)
 *   - initials (for the avatar fallback)
 *
 * The TestimonialsCarousel section auto-hides while this list is empty, so
 * the homepage stays clean until real entries land.
 */
export const TESTIMONIALS: Testimonial[] = [];
