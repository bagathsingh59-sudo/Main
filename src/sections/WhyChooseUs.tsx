"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { WHY_REASONS } from "@/constants/metrics";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function WhyChooseUs() {
  return (
    <SectionLayout id="why" className="bg-gradient-to-b from-mist to-cloud">
      <SectionHeader
        eyebrow="Why Vaishnavi"
        title={
          <>
            Six reasons CFOs <em className="not-italic text-navy-600">stop shopping around</em>.
          </>
        }
        description="We compete on outcomes, not deliverables. Each principle below is reflected in a contractual commitment."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_REASONS.map((r, i) => (
          <motion.div
            key={r.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group relative flex h-full flex-col rounded-3xl border border-white/70 bg-white/55 p-7 shadow-soft backdrop-blur-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy-600 transition-colors group-hover:bg-gradient-brand group-hover:text-white">
              <Icon name={r.icon} size={22} />
            </div>
            <h3 className="text-[1.05rem] font-bold text-navy-900">{r.title}</h3>
            <p className="mt-2 text-[0.9rem] leading-[1.7] text-navy-900/65">{r.description}</p>
            <div className="mt-5 text-[0.78rem] font-semibold text-teal-700">→ Contractual guarantee</div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
