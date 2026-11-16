import Link from "next/link";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { SvcDetailHero } from "@/components/orisa/legacy/SvcDetailHero";

interface LegalStubProps {
  title: string;
  intro: string;
  effectiveDate?: string;
  sections?: { heading: string; body: string }[];
}

const LEGAL_PAGES = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Disclaimer", href: "/disclaimer" },
];

/**
 * Legal pages (Privacy, Terms, Cookies, Disclaimer) in the Orisa theme:
 * the Service Details hero (breadcrumb, title, intro, links to the other
 * legal pages) and a readable text column in template typography.
 *
 * Every page carries a visible "Living document" notice until legal review
 * hands over the final text.
 */
export function LegalStub({ title, intro, effectiveDate, sections }: LegalStubProps) {
  return (
    <LegacySection>
      <SvcDetailHero
        crumb="Legal"
        title={title}
        lead={intro}
        tags={LEGAL_PAGES.filter((p) => p.label !== title)}
      />
      <div className="o-legal pt-80 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-10">
              {effectiveDate && <p className="o-legal__date">Effective from {effectiveDate}</p>}
              <div className="o-legal__notice" role="note">
                <strong>Living document.</strong> This page is being finalised with our legal advisors. The principles
                below reflect how we operate today; the final wording will be published shortly. Questions:{" "}
                <a href="mailto:info@vaishnaviconsultant.com">info@vaishnaviconsultant.com</a>
              </div>
              {sections?.map((s) => (
                <section key={s.heading} className="o-legal__section">
                  <h2 className="h4 fw-600">{s.heading}</h2>
                  <p className="fz-font-lg">{s.body}</p>
                </section>
              ))}
              <div className="at-btn-group pt-40">
                <Link className="at-btn" href="/contact">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LegacySection>
  );
}
