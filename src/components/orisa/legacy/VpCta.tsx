/* eslint-disable @next/next/no-img-element */
// Orisa `index-8.html` call to action (.sec-9-home-8), content-driven.
import Link from "next/link";

export interface VpCtaProps {
  title: string;
  lead: string;
  button: { label: string; href: string };
  card: { kicker: string; text: string; href: string; image: string };
}

export function VpCta({ title, lead, button, card }: VpCtaProps) {
  return (
    <section className="sec-9-home-8">
      <div className="sec-9-home-8__bg" aria-hidden="true">
        <img src="/orisa/tpl/pages/home-8/sec9-bg-blur.webp" alt="" />
      </div>
      <div className="container-fluid sec-9-home-8__container">
        <div className="row align-items-center justify-content-between g-5">
          <div className="col-xl-6">
            <div className="sec-9-home-8__content">
              <h2 className="sec-9-home-8__title" data-fade="bottom">
                {title}
              </h2>
              <p className="sec-9-home-8__lead" data-fade="bottom">
                {lead}
              </p>
              <div className="sec-9-home-8__cta" data-fade="bottom">
                <Link className="sec-9-home-8__cta-btn" href={button.href}>
                  <span>{button.label}</span>
                </Link>
                <Link className="sec-9-home-8__cta-icon" href={button.href} aria-label={button.label}>
                  <img src="/orisa/tpl/pages/home-8/sec9-btn-icon.svg" alt="" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-5">
            <Link className="sec-9-home-8__card" href={card.href}>
              <div className="sec-9-home-8__card-media">
                <img className="sec-9-home-8__card-visors w-100 scale-img-from-to" data-value-1="1.5" data-value-2="1" src={card.image} alt="" />
              </div>
              <div className="sec-9-home-8__card-overlay">
                <span className="sec-9-home-8__card-kicker">
                  <span>{card.kicker}</span>
                  <img src="/orisa/tpl/pages/home-8/sec9-arrow.svg" alt="" />
                </span>
                <p className="sec-9-home-8__card-text mb-0">{card.text}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
