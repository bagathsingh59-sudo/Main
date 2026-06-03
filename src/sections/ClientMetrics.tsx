"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CLIENT_METRICS } from "@/constants/metrics";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function ClientMetrics() {
  return (
    <SectionLayout id="metrics" className="bg-navy-900 text-white" tone="dark">
      <div className="absolute inset-0 -z-0 opacity-30 bg-grid-light [background-size:48px_48px]" aria-hidden="true" />
      <div className="relative">
        <SectionHeader
          tone="dark"
          eyebrow="Client success in numbers"
          title={
            <>
              Outcomes you can <em className="not-italic text-teal-400">put in a board pack</em>.
            </>
          }
          description="We publish our delivery metrics every quarter. These are 12-month rolling figures across our active book of business."
        />

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {CLIENT_METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              custom={i}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-md transition-colors hover:bg-white/[0.08]"
            >
              <div className="bg-gradient-to-br from-white to-teal-300 bg-clip-text text-[1.8rem] font-extrabold leading-tight text-transparent">
                {m.value}
              </div>
              <div className="mt-1.5 text-[0.72rem] font-medium text-navy-100/55">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
