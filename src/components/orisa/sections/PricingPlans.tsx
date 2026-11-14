"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "../icons";
import { useOrisaMotion } from "../useOrisaMotion";
import { staticText } from "../text";

/**
 * Orisa index-12 · section 5 — pricing: three plan cards (the middle one
 * can be flagged "most popular") and a wide "need something else?" row.
 * Adds a monthly / yearly switch that the template does not have.
 */
export interface PricingPlansProps {
  eyebrow: string;
  title: string;
  /** Small print under the cards (e.g. taxes, placeholder notice). */
  note?: string;
  yearlyHint?: string;
  /** Hide the monthly / yearly switch (plans then show `monthly`). Default true. */
  showBillingSwitch?: boolean;
  plans: {
    name: string;
    monthly: string;
    yearly: string;
    /** Overrides the "/monthly" · "/yearly" suffix. */
    period?: string;
    description: string;
    cta: { label: string; href: string };
    /** Plan limits shown as small chips above the feature list. */
    limits?: string[];
    features: string[];
    /** Listed last, struck through. */
    excluded?: string[];
    popular?: boolean;
  }[];
  custom?: { title: string; description: string; cta: { label: string; href: string } };
}

export function PricingPlans({ eyebrow, title, note, yearlyHint, showBillingSwitch = true, plans, custom }: PricingPlansProps) {
  const ref = useRef<HTMLElement>(null);
  useOrisaMotion(ref);
  const [yearly, setYearly] = useState(false);

  return (
    <section ref={ref} id="pricing" className="sec-5-home-12" aria-label={eyebrow}>
      <div className="sec-5-home-12__dots" aria-hidden="true" />
      <div className="o-wrap relative">
        <header className="sec-5-home-12__header">
          <p className="sec-5-home-12__eyebrow" data-fade="bottom" data-delay=".05">
            {eyebrow}
          </p>
          <h2 className="sec-5-home-12__title" data-reveal {...staticText(title)} />
          {showBillingSwitch && (
            <div className="o-billing" role="group" aria-label="Billing period" data-fade="bottom" data-delay=".1">
              <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>
                Monthly
              </button>
              <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>
                Yearly
                {yearlyHint && <span>{yearlyHint}</span>}
              </button>
            </div>
          )}
        </header>

        <div className="sec-5-home-12__tables">
          {plans.map((p, i) => (
            <div key={p.name} className={`card-home-12-price${p.popular ? " is-popular" : ""}`} data-fade="bottom" data-delay={(0.05 + i * 0.1).toFixed(2)}>
              <div className="card-home-12-price__top">
                {p.popular && <span className="card-home-12-price__badge">Most Popular</span>}
                <p className="card-home-12-price__plan">{p.name}</p>
                <div className="card-home-12-price__price">
                  <span className="card-home-12-price__amount">{yearly ? p.yearly : p.monthly}</span>
                  <span className="card-home-12-price__period">{p.period ?? (yearly ? "/yearly" : "/monthly")}</span>
                </div>
                <p className="card-home-12-price__desc">{p.description}</p>
                <Link className="card-home-12-price__cta" href={p.cta.href}>
                  <span className="card-home-12-price__cta-text">{p.cta.label}</span>
                  <span className="card-home-12-price__cta-icon" aria-hidden="true">
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              </div>
              {p.limits && (
                <ul className="o-plan-limits">
                  {p.limits.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
              <ul className="card-home-12-price__features">
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="card-home-12-price__feature-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="9" fill="var(--at-theme-primary)" />
                        <path d="M9 5v8M5 9h8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="card-home-12-price__feature-text">{f}</span>
                  </li>
                ))}
                {p.excluded?.map((f) => (
                  <li key={f} className="is-excluded">
                    <span className="card-home-12-price__feature-icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8.4" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M5.5 9h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="card-home-12-price__feature-text">
                      <span className="sr-only">Not included: </span>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {custom && (
          <div className="sec-5-home-12__custom" data-fade="bottom">
            <div className="sec-5-home-12__custom-text">
              <p className="sec-5-home-12__custom-title">{custom.title}</p>
              <p className="sec-5-home-12__custom-desc">{custom.description}</p>
            </div>
            <Link className="sec-5-home-12__custom-link" href={custom.cta.href}>
              {custom.cta.label} <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
        {note && <p className="o-pricing-note">{note}</p>}
      </div>
    </section>
  );
}
