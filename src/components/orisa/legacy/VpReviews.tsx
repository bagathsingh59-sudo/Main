/* eslint-disable @next/next/no-img-element */
// Orisa `index-8.html` testimonials (.sec-8-home-8), content-driven.
// Desktop: the stage pins while the four cards scroll past the centre title (LegacySection).
export interface VpReview {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

export interface VpReviewsProps {
  kicker: string;
  trusted: string;
  title: string;
  footnote: string;
  /** Four reviews, placed in the template's four card slots. */
  items: VpReview[];
}

/* Written out in full so the CSS build keeps them. */
const SLOTS = ["sec-8-home-8__group--a", "sec-8-home-8__group--b", "sec-8-home-8__group--c", "sec-8-home-8__group--d"];

export function VpReviews({ kicker, trusted, title, footnote, items }: VpReviewsProps) {
  return (
    <section className="sec-8-home-8 p-relative">
      <div className="container-fluid sec-8-home-8__container">
        <div className="sec-8-home-8__top d-flex align-items-end justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="sec-8-home-8__kicker" data-scramble="">
              {kicker}
            </span>
            <span className="sec-8-home-8__kicker-icon" aria-hidden="true">
              <img src="/orisa/tpl/pages/home-8/sec8-arrow.svg" alt="" />
            </span>
          </div>
          <span className="sec-8-home-8__trusted text-decoration-underline" data-fade="bottom">
            {trusted}
          </span>
        </div>
        <div className="sec-8-home-8__stage">
          <div className="sec-8-home-8__center">
            <img className="sec-8-home-8__asterisk at-scroll-rotate" src="/orisa/tpl/pages/home-8/sec8-asterisk.svg" alt="" aria-hidden="true" />
            <h2 className="sec-8-home-8__title mb-0">{title}</h2>
          </div>
          {items.slice(0, SLOTS.length).map((r, i) => {
            const namebar = (
              <div className="sec-8-home-8__namebar">
                <span className="sec-8-home-8__name">{r.name}</span>
                <span className="sec-8-home-8__plus" aria-hidden="true">
                  +
                </span>
              </div>
            );
            return (
              <figure key={r.name} className={`sec-8-home-8__group ${SLOTS[i]} m-0`}>
                {/* Card B carries its name bar underneath, as in the template. */}
                {i !== 1 && namebar}
                <div className="sec-8-home-8__card">
                  <div className="sec-8-home-8__role">
                    <span>{r.role}</span>
                    <span>{r.company}</span>
                  </div>
                  <div className="sec-8-home-8__body">
                    <div className="sec-8-home-8__avatar">
                      <img src={r.avatar} alt="" />
                    </div>
                    <blockquote className="sec-8-home-8__quote mb-0">“{r.quote}”</blockquote>
                  </div>
                  <div className="sec-8-home-8__stars" role="img" aria-label="5 out of 5">
                    {[0, 1, 2, 3, 4].map((k) => (
                      <img key={k} src="/orisa/tpl/pages/home-8/sec8-star.svg" alt="" />
                    ))}
                  </div>
                </div>
                {i === 1 && namebar}
              </figure>
            );
          })}
        </div>
        <div className="text-center w-50 mx-auto scroll-move-up">
          <p className="sec-8-home-8__view-all h6" data-fade="bottom">
            {footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
