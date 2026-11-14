"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useOrisaMotion } from "../useOrisaMotion";
import { staticText } from "../text";

/**
 * Orisa index-13 · section 7 — testimonial: a portrait that cross-fades
 * in step with the quote beside it. Replaces the template's two synced
 * Swiper sliders with ~1 KB of React: auto-advance, swipe / drag,
 * arrow keys, and it pauses while hovered or off-screen.
 */
export interface TestimonialSliderProps {
  label: string;
  title: string;
  lede: string;
  items: { image: string; quote: string; name: string; context: string; rating?: number }[];
  /** Milliseconds between slides. */
  interval?: number;
}

export function TestimonialSlider({ label, title, lede, items, interval = 6500 }: TestimonialSliderProps) {
  const ref = useRef<HTMLElement>(null);
  useOrisaMotion(ref);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const dragStart = useRef<number | null>(null);
  const count = items.length;

  const go = useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count]);

  useEffect(() => {
    if (count < 2) return;
    const el = ref.current;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    if (el) io.observe(el);
    const timer = window.setInterval(() => {
      if (!paused.current && visible && !document.hidden) go(1);
    }, interval);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, [count, go, interval]);

  if (count === 0) return null;

  return (
    <section
      ref={ref}
      className="sec-7-home-13"
      aria-label={label}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onPointerDown={(e) => (dragStart.current = e.clientX)}
      onPointerUp={(e) => {
        if (dragStart.current === null) return;
        const dx = e.clientX - dragStart.current;
        dragStart.current = null;
        if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="sec-7-home-13__inner">
        <figure className="sec-7-home-13__media">
          <div className="sec-7-home-13__media-slider o-stack">
            {items.map((it, i) => (
              <div key={it.name} className="o-stack__item" data-active={i === index}>
                <Image src={it.image} alt="" fill sizes="(max-width: 991px) 100vw, 40vw" draggable={false} />
              </div>
            ))}
          </div>
        </figure>

        <div className="sec-7-home-13__content">
          <div className="sec-7-home-13__head">
            <div className="sec-7-home-13__label" data-fade="left" data-delay=".05">
              <span className="sec-7-home-13__label-dot" aria-hidden="true" />
              <span className="sec-7-home-13__label-text">{label}</span>
            </div>
            <h2 className="sec-7-home-13__title" data-reveal {...staticText(title)} />
            <p className="sec-7-home-13__lede" data-fade="bottom">
              {lede}
            </p>
          </div>

          <div className="sec-7-home-13__quote-slider o-stack o-stack--auto" aria-live="polite">
            {items.map((it, i) => (
              <div key={it.name} className="o-stack__item" data-active={i === index} aria-hidden={i !== index}>
                <blockquote className="sec-7-home-13__quote">
                  <span className="sec-7-home-13__quote-mark" aria-hidden="true">
                    &ldquo;
                  </span>
                  <p className="sec-7-home-13__quote-text">{it.quote}</p>
                  <footer className="sec-7-home-13__quote-foot">
                    <div className="sec-7-home-13__author">
                      <cite className="sec-7-home-13__author-name">{it.name}</cite>
                      <span className="sec-7-home-13__author-sep" aria-hidden="true" />
                      <span className="sec-7-home-13__author-project">{it.context}</span>
                    </div>
                    <ul className="sec-7-home-13__stars" aria-label={`Rated ${it.rating ?? 5} out of 5`}>
                      {Array.from({ length: it.rating ?? 5 }).map((_, s) => (
                        <li key={s}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
                          </svg>
                        </li>
                      ))}
                    </ul>
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>

          {count > 1 && (
            <div className="o-stack-dots">
              {items.map((it, i) => (
                <button key={it.name} type="button" aria-label={`Show testimonial ${i + 1} of ${count}`} aria-current={i === index} onClick={() => setIndex(i)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
