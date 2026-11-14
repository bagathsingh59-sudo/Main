import { MotionSection } from "../MotionSection";
import { staticText } from "../text";

/**
 * Orisa index-13 · section 6 — "Our process": header with two metrics,
 * then a row of numbered phases, each with a timing, a description and
 * a short deliverables list. The first phase is highlighted.
 */
export interface ProcessTimelineProps {
  label: string;
  title: string;
  description: string;
  metrics: { value: string; label: string }[];
  deliverablesLabel?: string;
  phases: { when: string; title: string; text: string; deliverables: string[] }[];
}

export function ProcessTimeline({ label, title, description, metrics, deliverablesLabel = "DELIVERABLES", phases }: ProcessTimelineProps) {
  return (
    <MotionSection className="sec-6-home-13" aria-label={label}>
      <div className="sec-6-home-13__dots" aria-hidden="true" />
      <div className="sec-6-home-13__inner">
        <header className="sec-6-home-13__header">
          <div className="sec-6-home-13__head-left">
            <div className="sec-6-home-13__label" data-fade="left" data-delay=".05">
              <span className="sec-6-home-13__label-dot" aria-hidden="true" />
              <span className="sec-6-home-13__label-text">{label}</span>
            </div>
            <h2 className="sec-6-home-13__title" data-reveal {...staticText(title)} />
          </div>
          <div className="sec-6-home-13__head-right">
            <p className="sec-6-home-13__desc" data-fade="bottom">
              {description}
            </p>
            <ul className="sec-6-home-13__metrics">
              {metrics.map((m) => (
                <li key={m.label} className="sec-6-home-13__metric" data-fade="bottom">
                  <span className="sec-6-home-13__metric-num">{m.value}</span>
                  <span className="sec-6-home-13__metric-label">{m.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="sec-6-home-13__timeline">
          {phases.map((p, i) => (
            <div
              key={p.title}
              className={`sec-6-home-13__phase${i === 0 ? " sec-6-home-13__phase--active" : ""}`}
              data-fade="left"
              data-delay={(0.1 + i * 0.15).toFixed(2)}
            >
              <div className="sec-6-home-13__phase-head">
                <div className="sec-6-home-13__phase-id">
                  <span className="sec-6-home-13__phase-dot" aria-hidden="true" />
                  <span className="sec-6-home-13__phase-num">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className="sec-6-home-13__phase-week">{p.when}</span>
              </div>
              <div className="sec-6-home-13__phase-body">
                <h3 className="sec-6-home-13__phase-title">{p.title}</h3>
                <p className="sec-6-home-13__phase-text">{p.text}</p>
              </div>
              <div className="sec-6-home-13__phase-deliv">
                <p className="sec-6-home-13__phase-deliv-label">{deliverablesLabel}</p>
                <ul className="sec-6-home-13__phase-deliv-list">
                  {p.deliverables.map((d) => (
                    <li key={d}>
                      <span aria-hidden="true">+</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
