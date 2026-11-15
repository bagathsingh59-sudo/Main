// Orisa `index-8.html` logo strip (.at-brand-area), content-driven.
// No client logos yet, so each item is a word; pass `logo` to show an image instead.
/* eslint-disable @next/next/no-img-element */
export function VpBrands({ items }: { items: { label: string; logo?: string }[] }) {
  return (
    <div className="at-brand-area container-2200">
      <div className="carouselTicker carouselTicker-right position-relative z-1">
        <ul className="carouselTicker__list">
          {items.map((it) => (
            <li key={it.label} className="carouselTicker__item">
              <div className="brand-item dark-mode-invert">
                {it.logo ? <img src={it.logo} alt={it.label} /> : <span className="o-brand-word">{it.label}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
