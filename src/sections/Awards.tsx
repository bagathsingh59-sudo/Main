"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AWARDS } from "@/constants/certifications";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function Awards() {
  return (
    <SectionLayout id="awards" className="bg-cloud">
      <SectionHeader
        eyebrow="Awards & achievements"
        title={
          <>
            Recognised by the industries, <em className="not-italic text-navy-600">we serve.</em>
          </>
        }
        description="A handful of honours from the past few years. We are most proud of the renewal rate from our clients."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AWARDS.map((a, i) => (
          <motion.div
            key={a.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/70 bg-white/65 p-6 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-3 0-2 6 5-3 5 3-2-6" />
                </svg>
              </div>
              <span className="rounded-full bg-navy-50 px-3 py-1 text-[0.78rem] font-bold text-navy-700">
                {a.year}
              </span>
            </div>
            <div>
              <h4 className="text-[1.02rem] font-bold leading-tight text-navy-900">{a.title}</h4>
              <p className="mt-1.5 text-[0.85rem] text-navy-900/55">{a.issuer}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
