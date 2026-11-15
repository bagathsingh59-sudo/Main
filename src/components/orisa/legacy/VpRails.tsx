/* eslint-disable @next/next/no-img-element */
// Orisa `index-8.html` image rails (.sec-7-home-8), content-driven.
// Rows slide in opposite directions with the scroll (LegacySection).
import Link from "next/link";
import { BtnArrows } from "./vpIcons";

export interface VpRailsProps {
  title: string;
  cta: { label: string; href: string };
  rows: [string[], string[]];
}

/** The template repeats its pictures so the rail never runs out while sliding. */
const fill = (images: string[], n: number) => Array.from({ length: n }, (_, i) => images[i % images.length]);

export function VpRails({ title, cta, rows }: VpRailsProps) {
  return (
    <section className="sec-7-home-8">
      <div className="container-fluid sec-7-home-8__container">
        <div className="sec-7-home-8__top d-flex align-items-end justify-content-between flex-wrap gap-3">
          <h2 className="sec-7-home-8__title mb-0" data-fade="bottom" data-delay=".1">
            {title}
          </h2>
          <Link className="sec-7-home-8__cta at-btn btn-sm" href={cta.href} data-fade="bottom">
            <span>
              <span className="text-1">{cta.label}</span>
              <span className="text-2">{cta.label}</span>
            </span>
            <BtnArrows />
          </Link>
        </div>
      </div>
      <div className="sec-7-home-8__rails" aria-hidden="true">
        {rows.map((row, r) => (
          <div key={r} className={`sec-7-home-8__rail${r ? " sec-7-home-8__rail--reverse" : ""}`}>
            <div className={`swiper about-me-slider-active ${r ? "at-item-anime-area-2" : "at-item-anime-area"}`}>
              <div className="swiper-wrapper">
                {fill(row, 10).map((src, i) => (
                  <div key={i} className="swiper-slide">
                    <div className={`about-me-slider-thumb ${r ? "at-item-anime-2" : "at-item-anime"} marque`}>
                      <img className="w-100 rounded-4" src={src} alt="" loading="lazy" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
