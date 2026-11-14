import Image from "next/image";
import { MotionSection } from "../MotionSection";
import { staticText } from "../text";

/**
 * Orisa index-13 · section 5 — "Our expertise": stacked cards, each with
 * an image, a numbered title, a bracketed tag and one line of text.
 */
export interface ExpertiseListProps {
  title: string;
  hint: string;
  items: { image: string; title: string; tag: string; text: string }[];
}

export function ExpertiseList({ title, hint, items }: ExpertiseListProps) {
  return (
    <MotionSection className="sec-5-home-13" aria-label={title}>
      <div className="sec-5-home-13__inner">
        <header className="sec-5-home-13__header">
          <h2 className="sec-5-home-13__title" data-reveal {...staticText(title)} />
          <div className="sec-5-home-13__hint" data-fade="right" data-delay=".05">
            <span className="sec-5-home-13__hint-dot" aria-hidden="true" />
            <span>{hint}</span>
          </div>
        </header>
        <div className="sec-5-home-13__list">
          {items.map((it, i) => (
            <article key={it.title} className="sec-5-home-13__card">
              <div className="sec-5-home-13__card-media" data-zoomin>
                <Image src={it.image} alt="" width={640} height={420} sizes="(max-width: 767px) 100vw, 34vw" />
              </div>
              <div className="sec-5-home-13__card-body">
                <header className="sec-5-home-13__card-head">
                  <h3 className="sec-5-home-13__card-title" data-reveal {...staticText(`${String(i + 1).padStart(2, "0")}. ${it.title}`)} />
                  <div className="sec-5-home-13__card-tag">
                    <span className="sec-5-home-13__card-tag-text">[ {it.tag} ]</span>
                    <span className="sec-5-home-13__card-toggle" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </header>
                <p className="sec-5-home-13__card-text" data-fade="bottom">
                  {it.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
