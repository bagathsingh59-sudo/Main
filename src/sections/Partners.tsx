"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PARTNERS } from "@/constants/certifications";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function Partners() {
  return (
    <SectionLayout id="partners" className="bg-mist" spacing="sm">
      <SectionHeader
        align="center"
        eyebrow="Partners & associations"
        title={
          <>
            Integrated with the platforms <em className="not-italic text-navy-600">your team already uses.</em>
          </>
        }
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 overflow-hidden"
      >
        <div className="relative">
          <div className="flex gap-12 animate-marquee whitespace-nowrap py-5 [--gap:3rem]">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div
                key={i}
                className="flex h-16 min-w-[180px] items-center justify-center rounded-2xl border border-navy-900/10 bg-white/65 px-8 text-[0.95rem] font-bold tracking-wide text-navy-900/70 shadow-soft backdrop-blur-md"
              >
                {p.name}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-mist to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-mist to-transparent" />
        </div>
      </motion.div>
    </SectionLayout>
  );
}
