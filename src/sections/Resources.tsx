"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { RESOURCES } from "@/constants/resources";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function Resources() {
  return (
    <SectionLayout id="resources" className="bg-cloud">
      <SectionHeader
        eyebrow="Resources & insights"
        title={
          <>
            Compliance, <em className="not-italic text-navy-600">demystified.</em>
          </>
        }
        description="Briefings written by our partners and senior associates — for finance teams, by finance teams."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((r, i) => (
          <motion.article
            key={r.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/65 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-navy-700 via-navy-600 to-teal-600 p-5">
              <div className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-white/75">
                {r.category}
              </div>
              <div className="mt-4 font-display text-[1.3rem] leading-tight text-white">
                {r.title}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <p className="text-[0.88rem] leading-[1.7] text-navy-900/65">{r.excerpt}</p>
              <div className="mt-auto flex items-center justify-between border-t border-navy-900/[0.06] pt-4 text-[0.78rem] text-navy-900/55">
                <span>{r.date}</span>
                <span>{r.readTime}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button href="#" variant="outline">
          See all resources
        </Button>
      </div>
    </SectionLayout>
  );
}
