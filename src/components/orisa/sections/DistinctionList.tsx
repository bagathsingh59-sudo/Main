"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AtButton } from "../AtButton";
import { ArrowUpRight } from "../icons";
import { useOrisaMotion } from "../useOrisaMotion";
import { staticText } from "../text";

/**
 * Orisa index-13 · section 8 — "The distinction": a numbered list on the
 * right; hovering or focusing a row cross-fades the picture and the
 * paragraph on the left to that row's own.
 */
export interface DistinctionListProps {
  tag: { label: string; href: string };
  title: string;
  cta: { label: string; href: string };
  items: { name: string; image: string; lede: string; href: string }[];
}

export function DistinctionList({ tag, title, cta, items }: DistinctionListProps) {
  const ref = useRef<HTMLElement>(null);
  useOrisaMotion(ref);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [changing, setChanging] = useState(false);
  const timer = useRef<number>();

  const pick = (i: number) => {
    if (i === active) return;
    setActive(i);
    setChanging(true);
    window.clearTimeout(timer.current);
    // Same 280 ms hand-over as the template: fade out, swap, fade in.
    timer.current = window.setTimeout(() => {
      setShown(i);
      setChanging(false);
    }, 280);
  };

  return (
    <section ref={ref} className="sec-8-home-13" aria-label={tag.label}>
      <div className="sec-8-home-13__inner">
        <header className="sec-8-home-13__top">
          <div className="sec-8-home-13__head">
            <Link className="sec-8-home-13__tag" href={tag.href} data-fade="left" data-delay=".05">
              <span>{tag.label}</span>
              <ArrowUpRight size={12} />
            </Link>
            <h2 className="sec-8-home-13__title" data-reveal {...staticText(title)} />
          </div>
          <div className="pt-[30px]">
            <AtButton href={cta.href} icon={<ArrowUpRight size={16} />}>
              {cta.label}
            </AtButton>
          </div>
        </header>

        <div className="sec-8-home-13__body">
          <div className="sec-8-home-13__left">
            <figure className={`sec-8-home-13__media${changing ? " is-changing" : ""}`}>
              <Image src={items[shown].image} alt="" width={900} height={1100} sizes="(max-width: 991px) 100vw, 40vw" />
            </figure>
            <p className={`sec-8-home-13__lede${changing ? " is-changing" : ""}`}>{items[shown].lede}</p>
          </div>
          <ul className="sec-8-home-13__list">
            {items.map((it, i) => (
              <li
                key={it.name}
                className={`sec-8-home-13__item${i === active ? " sec-8-home-13__item--active" : ""}`}
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
              >
                <Link className="sec-8-home-13__row" href={it.href}>
                  <span className="sec-8-home-13__row-num">[ {String(i + 1).padStart(2, "0")} ]</span>
                  <span className="sec-8-home-13__row-name">{it.name}</span>
                  <span className="sec-8-home-13__row-arrow" aria-hidden="true">
                    <ArrowUpRight size={22} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
