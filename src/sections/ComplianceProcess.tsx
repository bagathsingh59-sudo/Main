"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PROCESS } from "@/constants/metrics";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function ComplianceProcess() {
  return (
    <SectionLayout id="process" className="bg-gradient-to-b from-mist via-cloud to-teal-50/40">
      <SectionHeader
        eyebrow="How it works"
        title={
          <>
            A 5-step <em className="not-italic text-navy-600">protection process</em> we've
            refined since 2009.
          </>
        }
        description="Battle-tested methodology that turns complex compliance into a seamless, predictable pipeline."
      />

      <div className="relative mt-16">
        <div className="absolute left-1/2 top-9 hidden h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-navy-300 to-transparent lg:block" aria-hidden="true" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((p, i) => (
            <motion.div
              key={p.step}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              custom={i}
              className="relative text-center"
            >
              <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-gradient-brand text-xl font-extrabold text-white shadow-glow">
                {p.step}
              </div>
              <h4 className="mt-5 text-[1.02rem] font-bold text-navy-900">{p.title}</h4>
              <p className="mx-auto mt-2 max-w-[15rem] text-[0.85rem] leading-[1.65] text-navy-900/60">
                {p.description}
              </p>
              <div className="mt-3 inline-block rounded-full bg-teal-50 px-3 py-0.5 text-[0.72rem] font-semibold text-teal-700">
                {p.duration}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
