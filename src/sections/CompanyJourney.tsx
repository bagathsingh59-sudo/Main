"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { JOURNEY } from "@/constants/journey";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function CompanyJourney() {
  return (
    <SectionLayout id="journey" className="bg-cloud">
      <SectionHeader
        eyebrow="Our journey"
        title={
          <>
            From a 3-person practice to <em className="not-italic text-navy-600">India's most trusted</em>{" "}
            compliance partner.
          </>
        }
        description="Fifteen years, eighteen cities, eight hundred and fifty clients — and one consistent principle."
      />

      <div className="relative mt-16">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-navy-200 via-teal-200 to-transparent md:left-1/2 md:-translate-x-px" aria-hidden="true" />

        <ol className="space-y-12">
          {JOURNEY.map((e, i) => {
            const isRight = i % 2 === 0;
            return (
              <motion.li
                key={e.year}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                custom={i % 4}
                className="relative grid md:grid-cols-2 md:gap-12"
              >
                <span
                  className="absolute left-4 top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gradient-brand shadow-glow md:left-1/2"
                  aria-hidden="true"
                />
                <div className={`pl-10 md:pl-0 ${isRight ? "md:col-start-2" : "md:text-right"}`}>
                  <div className="text-[0.78rem] font-bold uppercase tracking-[0.2em] text-teal-600">{e.year}</div>
                  <h3 className="mt-1 font-display text-[1.4rem] text-navy-900">{e.title}</h3>
                  <p className="mt-2 max-w-md text-[0.95rem] leading-[1.7] text-navy-900/65 md:max-w-md">
                    {e.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </SectionLayout>
  );
}
