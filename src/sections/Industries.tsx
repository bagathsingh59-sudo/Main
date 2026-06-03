"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INDUSTRIES } from "@/constants/industries";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function Industries() {
  return (
    <SectionLayout id="industries" className="bg-cloud">
      <SectionHeader
        eyebrow="Industries we serve"
        title={
          <>
            Compliance expertise <em className="not-italic text-navy-600">across every sector</em>
            <br /> we operate in.
          </>
        }
        description="Each industry has unique compliance challenges. Our sector-specialist teams already know yours."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {INDUSTRIES.map((ind, i) => (
          <motion.div
            key={ind.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/70 bg-white/55 p-6 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{ind.emoji}</span>
              <span className="rounded-full bg-navy-50 px-2.5 py-1 text-[0.7rem] font-semibold text-navy-600">
                {ind.clients}+ clients
              </span>
            </div>
            <div>
              <h4 className="text-[1.02rem] font-bold text-navy-900">{ind.name}</h4>
              <p className="mt-1.5 text-[0.85rem] leading-[1.65] text-navy-900/60">{ind.description}</p>
            </div>
            <div className="mt-auto inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-navy-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              See sector expertise →
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
