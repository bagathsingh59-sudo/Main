"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CASE_STUDIES } from "@/constants/caseStudies";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function CaseStudies() {
  return (
    <SectionLayout id="case-studies" className="bg-mist">
      <SectionHeader
        eyebrow="Case studies"
        title={
          <>
            Real outcomes. <em className="not-italic text-navy-600">Real numbers.</em>
          </>
        }
        description="Three engagements drawn from our active client roster. Names used with written permission."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {CASE_STUDIES.map((cs, i) => (
          <motion.article
            key={cs.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/55 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:shadow-elevated"
          >
            <div className="relative h-44 overflow-hidden">
              {cs.image && (
                <Image
                  src={cs.image}
                  alt={`${cs.client} — ${cs.industry}`}
                  fill
                  sizes="(max-width:1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/55 to-navy-900/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                <div>
                  <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/75">
                    {cs.industry}
                  </div>
                  <div className="mt-1 text-[1.1rem] font-bold">{cs.client}</div>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-to-br from-white to-teal-200 bg-clip-text text-2xl font-extrabold leading-none text-transparent">
                    {cs.metric}
                  </div>
                  <div className="text-[0.7rem] uppercase tracking-wide text-white/70">{cs.metricLabel}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6">
              <h3 className="font-display text-[1.2rem] leading-tight text-navy-900">{cs.headline}</h3>
              <div className="text-[0.85rem] leading-[1.7] text-navy-900/65">
                <span className="font-semibold text-navy-900">Challenge — </span>
                {cs.challenge}
              </div>
              <div className="text-[0.85rem] leading-[1.7] text-navy-900/65">
                <span className="font-semibold text-navy-900">Solution — </span>
                {cs.solution}
              </div>
              <ul className="mt-auto space-y-1.5 border-t border-navy-900/[0.06] pt-4">
                {cs.outcomes.map((o) => (
                  <li key={o} className="flex items-center gap-2 text-[0.82rem] text-navy-900/80">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-teal-600" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionLayout>
  );
}
