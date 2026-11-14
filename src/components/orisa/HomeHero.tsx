"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { HERO_IDEAS } from "./config";
import { DeadlineTicker, ExploreCursor, LiveStatus } from "./HeroExtras";
import { RippleCanvas } from "./RippleCanvas";
import { useOrisaMotion } from "./useOrisaMotion";

/**
 * Home hero — fixed layout:
 *
 *  • heading block (bracket labels, headline, sub-text, link) → index-14
 *  • image card (grid lines, scrambling label, email, scroll line,
 *    glass pills, water ripple on hover)                      → index-15
 *  • image motion (zoom-in entrance, slower-than-scroll drift) → index-14
 *
 * The optional extras are switched by number in HERO_IDEAS (config.ts).
 * All copy comes in through props so the component stays reusable.
 */
export interface HomeHeroProps {
  tagline: string;
  since: string;
  /** Headline lines — rendered with a line break between them. */
  headline: [string, string];
  /** Idea 6: `lead` + a cycling word on line one, `tail` on line two. */
  headlineSwap?: { lead: string; words: string[]; tail: string };
  copy: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
  card: {
    label: string;
    email: string;
    tags: { label: string; href: string }[];
    /** Shown in the status chip before the browser works out "open now". */
    hours: string;
  };
  /** Per-page overrides of HERO_IDEAS (e.g. `{ 4: false, 5: false }`). */
  ideas?: Partial<typeof HERO_IDEAS>;
}

export function HomeHero({ tagline, since, headline, headlineSwap, copy, cta, image, card, ideas }: HomeHeroProps) {
  const ref = useRef<HTMLElement>(null);
  useOrisaMotion(ref);

  const on = { ...HERO_IDEAS, ...ideas };
  const swap = on[6] && headlineSwap && headlineSwap.words.length > 1 ? headlineSwap : null;

  return (
    <section ref={ref} className="sec-1-home-14" aria-label="Introduction">
      <div className="sec-1-home-14__inner">
        <div className="sec-1-home-14__top">
          <p className="sec-1-home-14__tagline o-fade" style={delay(0.1)}>
            [ {tagline} ]
          </p>
          <p className="sec-1-home-14__counter o-fade" style={delay(0.2)} data-scramble {...staticText(`[ ${since} ]`)} />
        </div>

        {swap ? (
          <h1 className="sec-1-home-14__headline o-fade o-fade--top" style={delay(0.3)} aria-label={`${swap.lead} ${swap.words.join(", ")}. ${swap.tail}`}>
            <span aria-hidden="true">
              {swap.lead} <span className="o-swap" data-swap={swap.words.join("|")} {...staticText(swap.words[0])} />
              <br />
              <span data-reveal {...staticText(swap.tail)} />
            </span>
          </h1>
        ) : (
          <h1 className="sec-1-home-14__headline o-fade o-fade--top" style={delay(0.3)} data-reveal {...staticText(headline.join("\n"))} />
        )}

        <div className="sec-1-home-14__sub">
          <p className="sec-1-home-14__copy o-fade" style={delay(0.2)}>
            {copy}
          </p>
          <div className="sec-1-home-14__cta o-fade" style={delay(0.3)}>
            <Link className="sec-1-home-14__btn-link" href={cta.href}>
              <span>{cta.label}</span>
              <ArrowUpRight size={14} width={2} />
            </Link>
          </div>
        </div>
      </div>

      <div className={cn("o-hero-stage", on[9] && "o-hero-stage--expand")} data-expand={on[9] ? "" : undefined}>
        <div className={cn("sec-1-home-15__card changeless", on[5] && "has-ticker")} data-ripple-host>
          <div className="o-hero-drift" data-drift=".8">
            <div className="o-hero-media o-zoomin">
              <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1920px) 100vw, 1920px" />
              <RippleCanvas hostSelector="[data-ripple-host]" />
            </div>
          </div>
          <span className="sec-1-home-15__grid" aria-hidden="true" style={{ backgroundImage: "url('/orisa/hero-lines.svg')" }} />

          <div className="sec-1-home-15__top">
            <span className="sec-1-home-15__coord o-fade o-fade--top" style={delay(0.2)}>
              <PinIcon />
              <span className="sec-1-home-15__coord-label" data-scramble {...staticText(card.label)} />
            </span>
            <a className="sec-1-home-15__email o-fade o-fade--top" style={delay(0.3)} href={`mailto:${card.email}`}>
              {card.email}
            </a>
          </div>

          <span className="sec-1-home-15__scroll" aria-hidden="true">
            <span className="sec-1-home-15__scroll-line" />
            <span className="sec-1-home-15__scroll-label">Scroll</span>
          </span>

          <div className="sec-1-home-15__bottom">
            <ul className="sec-1-home-15__tags o-fade" style={delay(0.3)}>
              {card.tags.map((t) => (
                <li key={t.label}>
                  <Link className="sec-1-home-15__tag" href={t.href}>
                    <span>{t.label}</span>
                    <ArrowUpRight size={9} width={2.4} />
                  </Link>
                </li>
              ))}
            </ul>
            {on[4] && (
              <div className="o-fade" style={delay(0.4)}>
                <LiveStatus fallback={card.hours} />
              </div>
            )}
          </div>

          {on[5] && <DeadlineTicker />}
          {on[10] && <ExploreCursor hostSelector="[data-ripple-host]" />}
        </div>
      </div>
    </section>
  );
}

const delay = (seconds: number) => ({ "--fade-delay": `${seconds}s` }) as React.CSSProperties;

/**
 * Text that the motion hook rewrites in the DOM (split into characters,
 * scrambled, swapped). Handing it to React as raw HTML keeps React from
 * diffing those nodes later; the content is escaped and "\n" becomes a
 * line break.
 */
function staticText(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return { dangerouslySetInnerHTML: { __html: escaped.replace(/\n/g, " <br />") }, suppressHydrationWarning: true };
}

function ArrowUpRight({ size, width }: { size: number; width: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="sec-1-home-15__coord-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Zm-9 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
