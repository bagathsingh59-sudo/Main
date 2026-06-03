"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HERO_STATS } from "@/constants/metrics";
import { fadeUp, stagger } from "@/animations/variants";
import { HeroDashboard } from "@/components/illustrations/HeroDashboard";

const HeroParticles = dynamic(() => import("@/components/three/HeroParticles").then((m) => m.HeroParticles), {
  ssr: false,
});

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-gradient-mist px-5 pb-20 pt-32 sm:pt-40"
    >
      <HeroParticles className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute -top-32 left-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-navy-200/45 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[440px] w-[440px] rounded-full bg-teal-100/60 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">
          <motion.div variants={fadeUp}>
            <Badge dot tone="brand">Trusted by 850+ Indian businesses</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-display-xl text-navy-900 text-balance"
          >
            <em className="not-italic bg-gradient-brand bg-clip-text text-transparent">EPF, ESI & Tax</em> compliance — on autopilot.
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-base leading-[1.75] text-navy-900/65 sm:text-lg lg:mx-0">
            End-to-end Payroll, EPF, ESI, GST, TDS and Statutory Compliance for ambitious Indian businesses —
            backed by 15+ years of practice and a zero-penalty track record across 850+ clients.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button href="#book" size="lg">Book free consultation</Button>
            <Button href="#services" variant="ghost" size="lg">See services</Button>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {HERO_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-white/70 bg-white/65 px-4 py-4 text-center shadow-soft backdrop-blur-xl"
              >
                <div className="bg-gradient-brand bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[0.7rem] font-medium tracking-wide text-navy-900/55">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.78rem] text-navy-900/55 lg:justify-start"
          >
            <span className="font-semibold">As featured by:</span>
            {["Business Today", "ET Iconic", "GPTW", "CII", "FICCI"].map((b) => (
              <span key={b} className="font-semibold text-navy-900/75">{b}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* Dashboard mockup */}
        <div className="relative">
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
