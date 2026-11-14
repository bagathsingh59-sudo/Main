import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "../MotionSection";
import { ArrowUpRight } from "../icons";
import { staticText } from "../text";

/**
 * Orisa index-13 · section 3 — "Selected projects": header with the
 * three-part button, then full-width rows of meta · image · details.
 * Used on the home page to list services.
 */
export interface ProjectListProps {
  label: string;
  title: string;
  /** Second half of the title, set in the lighter italic style. */
  titleAccent: string;
  cta: { label: string; href: string };
  linkLabel?: string;
  items: {
    kicker: string;
    title: string;
    image: string;
    href: string;
    description: string;
    specs: { term: string; value: string }[];
  }[];
}

export function ProjectList({ label, title, titleAccent, cta, linkLabel = "VIEW DETAILS", items }: ProjectListProps) {
  return (
    <MotionSection className="sec-3-home-13" aria-label={label}>
      <div className="sec-3-home-13__inner">
        <header className="sec-3-home-13__header">
          <div className="sec-3-home-13__head-text">
            <div className="sec-3-home-13__label" data-fade="left" data-delay=".05">
              <span className="sec-3-home-13__label-dot" aria-hidden="true" />
              <span className="sec-3-home-13__label-text">{label}</span>
            </div>
            <h2 className="sec-3-home-13__title">
              <span data-reveal {...staticText(title)} />{" "}
              <span className="sec-3-home-13__title-italic" data-reveal {...staticText(titleAccent)} />
            </h2>
          </div>
          <div className="at-btn-group" data-fade="bottom" data-delay=".4">
            <Link className="at-btn-circle" href={cta.href} aria-hidden="true" tabIndex={-1}>
              <ArrowUpRight size={16} />
            </Link>
            <Link className="at-btn relative z-[1]" href={cta.href}>
              {cta.label}
            </Link>
            <Link className="at-btn-circle" href={cta.href} aria-hidden="true" tabIndex={-1}>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </header>

        <div className="sec-3-home-13__list">
          {items.map((it) => (
            <article key={it.title} className="sec-3-home-13__card">
              <div className="sec-3-home-13__card-meta">
                <p className="sec-3-home-13__card-loc">{it.kicker}</p>
                <h3 className="sec-3-home-13__card-title" data-reveal {...staticText(it.title)} />
                <Link className="sec-3-home-13__card-link" href={it.href}>
                  <span>{linkLabel}</span>
                  <span className="sec-3-home-13__card-link-dots" aria-hidden="true">
                    &bull; &bull; &bull;
                  </span>
                </Link>
              </div>
              <Link className="sec-3-home-13__card-media" href={it.href} aria-label={it.title}>
                <Image data-zoomin src={it.image} alt="" width={1100} height={620} sizes="(max-width: 991px) 100vw, 45vw" />
              </Link>
              <div className="sec-3-home-13__card-info">
                <p className="sec-3-home-13__card-desc">{it.description}</p>
                <dl className="sec-3-home-13__card-specs">
                  {it.specs.map((sp) => (
                    <div key={sp.term} className="sec-3-home-13__card-row">
                      <dt>{sp.term}</dt>
                      <dd>{sp.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
