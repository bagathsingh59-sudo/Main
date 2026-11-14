import { LICENSE } from "@/constants/license";
import { MotionSection } from "../MotionSection";
import { staticText } from "../text";

/**
 * Government registration, in the index-13 language: label, statement
 * and a hairline table of the certificate's fields with the download.
 * Replaces the previous design's digital licence card.
 */
export function LicenseStrip({ label = "VERIFIED BUSINESS", title }: { label?: string; title?: string }) {
  const rows: [string, string][] = [
    ["Registration No.", LICENSE.registrationNumber],
    ["Issued by", `${LICENSE.issuer} · ${LICENSE.department}`],
    ["Form", `${LICENSE.formCode} — ${LICENSE.formDescription}`],
    ["Establishment", LICENSE.establishmentName],
    ["Registered on", LICENSE.registeredOn],
    ["Valid until", LICENSE.validUntil],
  ];
  return (
    <MotionSection id="license" className="o-license" aria-label={label}>
      <div className="o-wrap o-license__grid">
        <header>
          <div className="o-label" data-fade="left" data-delay=".05">
            <span className="o-label__dot" aria-hidden="true" />
            <span>{label}</span>
          </div>
          <h2 className="o-license__title" data-reveal {...staticText(title ?? "Registered with the Government of Karnataka since 2018.")} />
          <a className="sec-1-home-14__btn-link o-license__link" href={LICENSE.pdfUrl} download={LICENSE.pdfFilename} target="_blank" rel="noopener noreferrer" data-fade="bottom">
            <span>Download certificate</span>
            <span aria-hidden="true">↓</span>
          </a>
        </header>
        <dl className="o-license__rows" data-fade="bottom">
          {rows.map(([term, value]) => (
            <div key={term} className="o-license__row">
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </MotionSection>
  );
}
