/* eslint-disable @next/next/no-img-element */
// Orisa `index-8.html` hero (.sec-1-home-8), content-driven.
// Motion: photo parallax [data-parallax-range], letter stretch .text-scale-anim (LegacySection).
import Link from "next/link";
import { BadgeArrow, BadgeShape, Globe } from "./vpIcons";

export interface VpHeroProps {
  badge: { label: string; href: string };
  headline: string;
  /** Six photos: three top-right, three bottom-left (bottom set hidden below 1200px). */
  photos: { src: string; alt: string }[];
  stats: { value: number; suffix: string; text: string }[];
  /** Big band under the hero: word · ® · small framed picture · word. */
  wordmark: { left: string; right: string; frame: string };
  meta: { left: string; right: string };
}

/* Template ranges and easings, in order. */
const PARALLAX: [number, string][] = [
  [228, "sine.inOut"],
  [110, "power3.in"],
  [52, "sine.inOut"],
  [92, "expo.in"],
  [24, "none"],
  [125, "power2.inOut"],
];

export function VpHero({ badge, headline, photos, stats, wordmark, meta }: VpHeroProps) {
  const photo = (i: number, down: boolean) => {
    const p = photos[i];
    if (!p) return null;
    return (
      <div className={`h8-photo-box${down ? " h8-photo-down" : ""}`} data-parallax-range={PARALLAX[i][0]} data-parallax-ease={PARALLAX[i][1]}>
        <img src={p.src} alt={p.alt} data-zoomin="" />
      </div>
    );
  };

  return (
    <section className="sec-1-home-8 p-relative overflow-hidden">
      <div className="h8-grid-lines" aria-hidden="true" />
      <div className="container-fluid h8-container">
        <div className="row g-0 h8-row-1 align-items-start">
          <div className="col-xl-6 h8-col-left">
            <div className="d-flex align-items-start h8-headline-group">
              <Link className="h8-badge flex-shrink-0" href={badge.href} aria-label={badge.label} data-fade="bottom" data-delay=".1">
                <BadgeShape />
                <span className="h8-badge__inner">
                  <BadgeArrow />
                  <span>{badge.label}</span>
                </span>
              </Link>
              <h1 className="h8-headline" data-fade="bottom" data-delay=".25">
                {headline}
              </h1>
            </div>
          </div>
          <div className="col-xl-6 h8-col-right">
            <div className="h8-photos d-flex align-items-start">
              {photo(0, false)}
              {photo(1, true)}
              {photo(2, false)}
            </div>
          </div>
        </div>
        <div className="row g-0 h8-row-2 align-items-start">
          <div className="col-xl-6 h8-col-left-2 d-none d-xl-block">
            <div className="h8-photos d-flex align-items-start">
              {photo(3, true)}
              {photo(4, false)}
              {photo(5, true)}
            </div>
          </div>
          <div className="col-xl-6 h8-col-right-2">
            <div className="h8-stats d-flex">
              {stats.map((s, i) => (
                <div key={s.text} className="h8-stat" data-fade="bottom" data-delay={i ? ".35" : ".2"}>
                  <p className="h8-stat-num">
                    <span data-count={s.value}>{s.value}</span>
                    {s.suffix}
                  </p>
                  <p className="h8-stat-desc">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h8-bottom-band">
        <p className="h8-big-title" aria-label={`${wordmark.left}${wordmark.right}`}>
          <span className="h8-word text-scale-anim" aria-hidden="true">
            {wordmark.left}
          </span>
          <sup className="h8-registered" aria-hidden="true">
            ®
          </sup>
          <span className="h8-portrait-frame" aria-hidden="true">
            <img src={wordmark.frame} alt="" />
          </span>
          <span className="h8-word text-scale-anim" aria-hidden="true">
            {wordmark.right}
          </span>
        </p>
        <div className="h8-bottom-meta d-flex align-items-center justify-content-between">
          <span className="h8-meta-text" data-scramble="">
            {meta.left}
          </span>
          <div className="d-flex align-items-center gap-2">
            <Globe />
            <span className="h8-meta-text" data-scramble="">
              {meta.right}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
