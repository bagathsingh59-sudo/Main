import { MotionSection } from "../MotionSection";
import { staticText } from "../text";

/**
 * FAQ in the index-13 visual language: sticky heading on the left,
 * numbered questions on the right. Uses native <details>, so it opens
 * and closes without any JavaScript.
 */
export interface FaqListProps {
  label: string;
  title: string;
  description?: string;
  items: { question: string; answer: string }[];
}

export function FaqList({ label, title, description, items }: FaqListProps) {
  return (
    <MotionSection id="faq" className="o-faq" aria-label={label}>
      <div className="o-wrap o-faq__grid">
        <header className="o-faq__head">
          <div className="o-label" data-fade="left" data-delay=".05">
            <span className="o-label__dot" aria-hidden="true" />
            <span>{label}</span>
          </div>
          <h2 className="o-faq__title" data-reveal {...staticText(title)} />
          {description && (
            <p className="o-faq__desc" data-fade="bottom">
              {description}
            </p>
          )}
        </header>
        <div className="o-faq__list">
          {items.map((it, i) => (
            <details key={it.question} className="o-faq__item" open={i === 0} data-fade="bottom" data-delay={(0.05 * i).toFixed(2)}>
              <summary>
                <span className="o-faq__num">[ {String(i + 1).padStart(2, "0")} ]</span>
                <span className="o-faq__q">{it.question}</span>
                <span className="o-faq__icon" aria-hidden="true" />
              </summary>
              <p className="o-faq__a">{it.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
