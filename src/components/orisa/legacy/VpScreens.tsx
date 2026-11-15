/* eslint-disable @next/next/no-img-element */
// Orisa `index-8.html` selected-works grid (.sec-6-home-8), content-driven.
// Seven cards in the template's slots; LegacySection drifts each at its own speed.
import Link from "next/link";
import { KickerArrowLarge, Plus } from "./vpIcons";

export interface VpScreensProps {
  kicker: string;
  viewAll: { label: string; href: string };
  /** Up to seven cards, filled into the template's slots in order. */
  cards: { title: string; image: string; href: string }[];
}

/* Slot classes (written out in full so the CSS build keeps them), parallax range, ease — template order. */
const SLOTS: [string, number, string][] = [
  ["sec-6-home-8__card--sm sec-6-home-8__card--lt d-none d-xl-flex", 28, "power1.out"],
  ["sec-6-home-8__card--sm sec-6-home-8__card--lb d-none d-xl-flex", 120, "expo.inOut"],
  ["sec-6-home-8__card--lg sec-6-home-8__card--ct", 42, "sine.inOut"],
  ["sec-6-home-8__card--md sec-6-home-8__card--cm", 34, "none"],
  ["sec-6-home-8__card--md sec-6-home-8__card--cb", 34, "none"],
  ["sec-6-home-8__card--sm sec-6-home-8__card--rt d-none d-xl-flex", 140, "circ.inOut"],
  ["sec-6-home-8__card--sm sec-6-home-8__card--rb d-none d-xl-flex", 80, "power2.inOut"],
];

export function VpScreens({ kicker, viewAll, cards }: VpScreensProps) {
  return (
    <section className="sec-6-home-8">
      <div className="container-fluid sec-6-home-8__container">
        <div className="sec-6-home-8__top d-flex align-items-end justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="sec-6-home-8__kicker" data-scramble="">
              {kicker}
            </span>
            <span className="sec-6-home-8__kicker-icon" aria-hidden="true">
              <KickerArrowLarge />
            </span>
          </div>
          <Link className="sec-6-home-8__view-all common-underline" href={viewAll.href}>
            {viewAll.label}
          </Link>
        </div>
        <div className="sec-6-home-8__grid">
          {cards.slice(0, SLOTS.length).map((card, i) => {
            const [slot, range, ease] = SLOTS[i];
            return (
              <Link
                key={card.title}
                className={`sec-6-home-8__card ${slot}`}
                href={card.href}
                data-card-parallax={range}
                data-parallax-ease={ease}
              >
                <div className="sec-6-home-8__img" data-zoomin="">
                  <img src={card.image} alt="" />
                </div>
                <div className="sec-6-home-8__meta">
                  <span className="sec-6-home-8__title">{card.title}</span>
                  <span className="sec-6-home-8__plus" aria-hidden="true">
                    <Plus />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
