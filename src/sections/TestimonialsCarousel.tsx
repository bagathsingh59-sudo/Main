"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TESTIMONIALS } from "@/constants/testimonials";

/**
 * Compact carousel — single quote card, auto-advances, manual nav.
 * Avoids the long 3-column grid we had previously, far less text density.
 */
export function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const count = TESTIMONIALS.length;

  useEffect(() => {
    const i = window.setInterval(() => setIdx((v) => (v + 1) % count), 6500);
    return () => window.clearInterval(i);
  }, [count]);

  const t = TESTIMONIALS[idx];

  return (
    <SectionLayout
      id="testimonials"
      tone="dark"
      className="relative overflow-hidden bg-gradient-to-br from-navy-900 to-navy-800 text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-0 opacity-20 bg-grid-light [background-size:48px_48px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/15 blur-3xl" />

      <div className="relative">
        <SectionHeader
          align="center"
          tone="dark"
          eyebrow="Client stories"
          title={
            <>
              Trusted by CFOs <em className="not-italic text-teal-400">across India.</em>
            </>
          }
        />

        <div className="relative mx-auto mt-12 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-white/15 bg-white/[0.06] p-8 backdrop-blur-md sm:p-12"
            >
              <div className="text-amber-300 tracking-[2px]">{"★".repeat(t.rating)}</div>
              <blockquote className="mt-5 font-display text-[1.45rem] leading-snug text-white sm:text-[1.7rem]">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-base font-bold text-white shadow-glow">
                  {t.initials}
                </div>
                <div>
                  <div className="text-[0.95rem] font-bold text-white">{t.name}</div>
                  <div className="text-[0.82rem] text-navy-100/55">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-7 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((tt, i) => (
              <button
                key={tt.id}
                onClick={() => setIdx(i)}
                aria-label={`Show testimonial ${i + 1} of ${count}`}
                aria-current={i === idx}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === idx ? 32 : 8,
                  background:
                    i === idx
                      ? "linear-gradient(90deg,#22d3ee,#3a64f5)"
                      : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
