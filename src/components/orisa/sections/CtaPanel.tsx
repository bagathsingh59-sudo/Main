import Link from "next/link";
import { MotionSection } from "../MotionSection";
import { ArrowUpRight } from "../icons";
import { staticText } from "../text";

/**
 * Orisa index-13 · section 4 — dark call-to-action panel with a status
 * bar, an oversized three-word title (middle word italic), action chips
 * and a contact row. Stays dark in both themes (`changeless`).
 */
export interface CtaPanelProps {
  bar: { left: string; center: string; right: string };
  tag: string;
  /** [before, italic word, after] */
  title: [string, string, string];
  lede: [string, string];
  chips: { label: string; href: string }[];
  contact: { label: string; text: string; href: string };
}

export function CtaPanel({ bar, tag, title, lede, chips, contact }: CtaPanelProps) {
  return (
    <MotionSection className="sec-4-home-13" aria-label={title.join(" ")}>
      <div className="sec-4-home-13__card changeless">
        <div className="sec-4-home-13__bar">
          <div className="sec-4-home-13__bar-left">
            <span className="sec-4-home-13__bar-dot" aria-hidden="true" />
            <span>{bar.left}</span>
          </div>
          <div className="sec-4-home-13__bar-center" data-scramble {...staticText(bar.center)} />
          <div className="sec-4-home-13__bar-right">{bar.right}</div>
        </div>

        <div className="sec-4-home-13__head">
          <p className="sec-4-home-13__tag" data-fade="left" data-delay=".1">
            <span data-rise {...staticText(`[ ${tag} ]`)} />
          </p>
          <h2 className="sec-4-home-13__title text-white">
            {title[0]} <em>{title[1]}</em> {title[2]}
          </h2>
        </div>

        <div className="sec-4-home-13__bottom">
          <div className="sec-4-home-13__copy">
            <p className="sec-4-home-13__lede">
              {lede[0]}
              <br />
              {lede[1]}
            </p>
            <ul className="sec-4-home-13__chips">
              {chips.map((c, i) => (
                <li key={c.label}>
                  <Link className="sec-4-home-13__chip text-white" href={c.href} data-fade="left" data-delay={(0.1 * (i + 1)).toFixed(1)}>
                    {i === 0 && <span aria-hidden="true">&rarr; </span>}
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sec-4-home-13__contact">
            <p className="sec-4-home-13__contact-label">{contact.label}</p>
            <a className="sec-4-home-13__contact-row" href={contact.href}>
              <span className="sec-4-home-13__contact-mail text-white" data-rise {...staticText(contact.text)} />
              <span className="sec-4-home-13__contact-arrow" aria-hidden="true">
                <ArrowUpRight size={22} />
              </span>
            </a>
          </div>
        </div>
        <div className="sec-4-home-13__glow" aria-hidden="true" />
      </div>
    </MotionSection>
  );
}
