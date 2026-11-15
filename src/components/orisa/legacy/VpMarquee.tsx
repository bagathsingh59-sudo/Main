/* eslint-disable @next/next/no-img-element */
// Orisa `index-8.html` marquee band (.sec-2-home-8), content-driven.
// The list is doubled by LegacySection's ticker so it loops seamlessly.
export function VpMarquee({ items }: { items: string[] }) {
  return (
    <div className="sec-2-home-8">
      <div className="sec-2-home-8__row">
        <div className="sec-2-home-8__ticker py-3 changeless carouselTicker carouselTicker-left">
          <ul className="d-flex align-items-center carouselTicker__list list-unstyled mb-0 sec-2-home-8__list">
            {items.flatMap((item) => [
              <li key={item} className="sec-2-home-8__item">
                {item}
              </li>,
              <li key={`${item}-sep`} className="sec-2-home-8__sep" aria-hidden="true">
                <img src="/orisa/tpl/pages/home-7/marquee-star.svg" alt="" />
              </li>,
            ])}
          </ul>
        </div>
      </div>
      <div className="sec-2-home-8__rules" aria-hidden="true" />
    </div>
  );
}
