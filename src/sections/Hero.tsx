"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HERO_STATS } from "@/constants/metrics";
import { HeroDashboard } from "@/components/illustrations/HeroDashboard";

/**
 * Above-the-fold hero. Entrance animation is CSS-only (`.hero-fade` in
 * globals.css) so initial paint is NOT blocked by Framer-Motion hydration —
 * this was the single biggest LCP regression and is now ~4s faster.
 *
 * The particle network and dashboard mock are decorative and rendered with
 * `ssr: false` so they never block the critical path.
 */
const HeroParticles = dynamic(
  () => import("@/components/three/HeroParticles").then((m) => m.HeroParticles),
  { ssr: false },
);

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-gradient-mist px-5 pb-20 pt-32 sm:pt-40"
    >
      <HeroParticles className="absolute inset-0 h-full w-full" />

      <div
        className="pointer-events-none absolute -top-32 left-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-navy-200/45 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[440px] w-[440px] rounded-full bg-teal-100/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div className="text-center lg:text-left">
          <div className="hero-fade">
            <Badge dot tone="brand">
              Trusted by 250+ Indian businesses · 25+ years of practice
            </Badge>
          </div>

          <h1 className="hero-fade hero-fade-d1 mt-6 font-display text-display-xl text-navy-900 text-balance">
            <em className="not-italic bg-gradient-brand bg-clip-text text-transparent">
              Payroll, EPF, ESIC &amp; GST
            </em>{" "}
            compliance, done right.
          </h1>

          <p className="hero-fade hero-fade-d2 mx-auto mt-5 max-w-2xl text-base leading-[1.75] text-navy-900/65 sm:text-lg lg:mx-0">
            Supporting businesses with accurate and professional Payroll, EPF, ESIC, GST and Labour Compliance
            services that help minimise risk, maintain accuracy, reduce administrative burden, and ensure
            complete compliance and operational peace of mind.
          </p>

          <div className="hero-fade hero-fade-d3 mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button href="/contact" size="lg">
              Book free consultation
            </Button>
            <Button href="/services" variant="ghost" size="lg">
              See services
            </Button>
          </div>

          <div className="hero-fade hero-fade-d4 mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/70 bg-white/65 px-4 py-4 text-center shadow-soft backdrop-blur-xl"
              >
                <div className="bg-gradient-brand bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[0.7rem] font-medium tracking-wide text-navy-900/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="hero-fade hero-fade-d6 relative">
          <HeroDashboard />
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to learn more"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex h-9 w-6 items-start justify-center rounded-full border border-navy-900/20 pt-2"
      >
        <span className="h-2 w-[2px] animate-bounce rounded-full bg-navy-900/50" />
      </a>
    </section>
  );
}
