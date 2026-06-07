"use client";

/**
 * UiEffectOverlay — CSS-only decorative overlays for banner surfaces.
 *
 * Each effect is pointer-events: none and absolutely positioned so it
 * never blocks clicks on the underlying CTA. Animations live in
 * globals.css under the .ui-eff-* class namespace.
 *
 * Effect catalog (10 total, matching schema enum):
 *   confetti              — milestones, launches
 *   sparkle               — premium feel, testimonials
 *   glitter-anniversary   — site / brand anniversary
 *   snow-holiday          — Dec / New Year
 *   fireworks-launch      — product launches, Independence/Republic Day
 *   shimmer-premium       — luxury offers, VIP audit
 *   floating-icons        — Diwali / Eid / festival campaigns
 *   glow-pulse-urgent     — deadline reminders, last-day offers
 *   coupon-burst-sale     — discount campaigns, sale events
 *   ribbons-celebration   — graduations, year-end wraps
 */

import type { ReactNode } from "react";

export type UiEffectKind =
  | "none"
  | "confetti"
  | "sparkle"
  | "glitter-anniversary"
  | "snow-holiday"
  | "fireworks-launch"
  | "shimmer-premium"
  | "floating-icons"
  | "glow-pulse-urgent"
  | "coupon-burst-sale"
  | "ribbons-celebration";

interface Props {
  effect: UiEffectKind;
  /** Light = render against a light surface (tints effects darker). */
  surface?: "light" | "dark";
}

export function UiEffectOverlay({ effect, surface = "dark" }: Props): ReactNode {
  if (effect === "none") return null;
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${
        surface === "light" ? "ui-eff-light" : "ui-eff-dark"
      }`}
      aria-hidden="true"
    >
      {effect === "confetti" && <Confetti />}
      {effect === "sparkle" && <Sparkle />}
      {effect === "glitter-anniversary" && <Glitter />}
      {effect === "snow-holiday" && <Snow />}
      {effect === "fireworks-launch" && <Fireworks />}
      {effect === "shimmer-premium" && <Shimmer />}
      {effect === "floating-icons" && <FloatingIcons />}
      {effect === "glow-pulse-urgent" && <GlowPulse />}
      {effect === "coupon-burst-sale" && <CouponBurst />}
      {effect === "ribbons-celebration" && <Ribbons />}
    </div>
  );
}

/* ──────────────────────── individual effects ──────────────────────── */

function Confetti() {
  const colors = ["#3b82f6", "#14b8a6", "#fbbf24", "#f43f5e", "#a855f7", "#22c55e"];
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="ui-eff-confetti-piece"
          style={{
            left: `${(i * 7.3) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 5) * 0.4}s`,
            animationDuration: `${4 + (i % 3)}s`,
          }}
        />
      ))}
    </>
  );
}

function Sparkle() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="ui-eff-sparkle-dot"
          style={{
            top: `${((i * 13) % 90) + 5}%`,
            left: `${((i * 17) % 92) + 4}%`,
            animationDelay: `${(i % 6) * 0.3}s`,
          }}
        />
      ))}
    </>
  );
}

function Glitter() {
  return (
    <>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="ui-eff-glitter-piece"
          style={{
            left: `${(i * 5.5) % 100}%`,
            animationDelay: `${(i % 7) * 0.3}s`,
            animationDuration: `${3 + (i % 4)}s`,
          }}
        />
      ))}
    </>
  );
}

function Snow() {
  return (
    <>
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="ui-eff-snow-flake"
          style={{
            left: `${(i * 6.2) % 100}%`,
            animationDelay: `${(i % 5) * 0.6}s`,
            animationDuration: `${5 + (i % 4)}s`,
            fontSize: `${0.5 + (i % 3) * 0.2}rem`,
          }}
        >
          ❄
        </span>
      ))}
    </>
  );
}

function Fireworks() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="ui-eff-firework-burst"
          style={{
            top: `${20 + i * 18}%`,
            left: `${15 + i * 22}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
    </>
  );
}

function Shimmer() {
  return <span className="ui-eff-shimmer-sweep" />;
}

function FloatingIcons() {
  const icons = ["✦", "✧", "★", "✪", "❖"];
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="ui-eff-floating-icon"
          style={{
            left: `${(i * 11) % 100}%`,
            animationDelay: `${(i % 5) * 0.5}s`,
            animationDuration: `${6 + (i % 4)}s`,
          }}
        >
          {icons[i % icons.length]}
        </span>
      ))}
    </>
  );
}

function GlowPulse() {
  return <span className="ui-eff-glow-pulse" />;
}

function CouponBurst() {
  return (
    <>
      <span className="ui-eff-coupon-burst" />
      <span className="ui-eff-coupon-burst ui-eff-coupon-burst-2" />
    </>
  );
}

function Ribbons() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="ui-eff-ribbon-strip"
          style={{
            left: `${(i * 13) % 100}%`,
            background: ["#3b82f6", "#14b8a6", "#fbbf24", "#a855f7"][i % 4],
            animationDelay: `${(i % 4) * 0.5}s`,
            animationDuration: `${4 + (i % 3)}s`,
          }}
        />
      ))}
    </>
  );
}
