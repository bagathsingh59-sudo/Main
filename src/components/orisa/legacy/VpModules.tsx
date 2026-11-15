/* eslint-disable @next/next/no-img-element */
// Orisa `index-8.html` service rows (.sec-4-home-8), content-driven.
// LegacySection pins the left card and swaps its picture on row hover.
import Link from "next/link";
import { BtnArrows, KickerArrow } from "./vpIcons";

export interface VpModulesProps {
  kicker: string;
  since: string;
  caption: string;
  items: { title: string; text: string; image: string; href: string }[];
  cta: { label: string; href: string };
}

export function VpModules({ kicker, since, caption, items, cta }: VpModulesProps) {
  return (
    <div className="at-service-area at-panel-pin-area sec-4-home-8 pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sec-4-home-8__top d-flex justify-content-between align-items-end flex-wrap gap-3 mb-50">
              <div className="d-flex align-items-center gap-2">
                <span className="sec-4-home-8__kicker text-uppercase fw-semibold mb-0" data-scramble="">
                  {kicker}
                </span>
                <span className="sec-4-home-8__kicker-icon" aria-hidden="true">
                  <KickerArrow />
                </span>
              </div>
              <span className="sec-4-home-8__since fs-font-md fw-500 text-decoration-underline">{since}</span>
            </div>
          </div>
          <div className="col-xxl-4 col-lg-4 mb-40">
            <div className="at-service-content sec-4-home-8__left">
              <div className="sec-4-home-8__card p-relative">
                <div className="at-service-sales-wrap at-panel-pin fix p-relative">
                  <div className="at-service-img-wrapper image-container sec-4-home-8__img-stack">
                    {items.map((it) => (
                      <div key={it.title} className="hover-image">
                        <img className="thumb" src={it.image} alt="" />
                      </div>
                    ))}
                  </div>
                  <p className="sec-4-home-8__caption fz-font-lg fw-500 mb-0 pb-4">{caption}</p>
                </div>
              </div>
            </div>
            <div className="sec-4-home-8__deco mt-4 pt-4" aria-hidden="true">
              <div className="at-about-svg-wrap move-up">
                <svg xmlns="http://www.w3.org/2000/svg" width="57" height="91" viewBox="0 0 57 91" fill="none">
                  <path opacity="0.1" d="M0 0L56.4024 33.572V90.336L0 56.46V0Z" fill="#515151" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="113" height="68" viewBox="0 0 113 68" fill="none">
                  <path opacity="0.3" d="M0 33.876L56.4024 0L112.805 33.876V34.1294L56.4024 68.0054L0 34.1294V33.876Z" fill="#515151" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="57" height="91" viewBox="0 0 57 91" fill="none">
                  <path opacity="0.2" d="M56.4009 0L8.7738e-05 33.5367V90.2413L56.4009 56.4008V0Z" fill="#515151" />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-xxl-7 ms-auto col-lg-7 mb-40">
            <div className="at-service-list-wrap sec-4-home-8__list-wrap">
              {items.map((it, i) => (
                <Link key={it.title} href={it.href}>
                  <div className={`at-service-item service-item${i === 0 ? " active" : ""}`}>
                    <div className="count">
                      <span className="number">[{String(i + 1).padStart(2, "0")}]</span>
                    </div>
                    <div className="content">
                      <h2 className="title">{it.title}</h2>
                      <p className="text">{it.text}</p>
                    </div>
                    <div className="thumb" data-zoomin="">
                      <img src={it.image} alt="" />
                    </div>
                  </div>
                </Link>
              ))}
              <div className="at-service-btn pt-30">
                <Link className="at-btn" href={cta.href} data-fade="bottom">
                  <span>
                    <span className="text-1">{cta.label}</span>
                    <span className="text-2">{cta.label}</span>
                  </span>
                  <BtnArrows />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
