"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, viewportOnce } from "@/animations/variants";
import { TEAM } from "@/constants/team";

export function FounderMessage() {
  const founder = TEAM[0];

  return (
    <SectionLayout id="founder" className="bg-mist relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-navy-200/45 blur-3xl"
      />
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="relative rounded-[28px] border border-white/70 bg-white/65 p-8 shadow-elevated backdrop-blur-xl">
            <div
              className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${founder.accent} text-3xl font-extrabold text-white shadow-glow`}
            >
              {founder.initials}
            </div>
            <div className="mt-6 text-center">
              <div className="font-display text-2xl text-navy-900">{founder.name}</div>
              <div className="mt-1 text-sm text-navy-900/55">{founder.role}</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-cloud px-3 py-3">
                <div className="text-lg font-extrabold text-navy-600">24+ yrs</div>
                <div className="text-[0.7rem] text-navy-900/55">Practice</div>
              </div>
              <div className="rounded-xl bg-cloud px-3 py-3">
                <div className="text-lg font-extrabold text-navy-600">FCA</div>
                <div className="text-[0.7rem] text-navy-900/55">ICAI</div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-3xl bg-gradient-brand opacity-20 blur-2xl" />
        </motion.div>

        <div>
          <Badge tone="brand">A note from the founder</Badge>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-5 font-display text-display-lg text-navy-900"
          >
            "Compliance is not paperwork. <em className="not-italic text-navy-600">It is the operating system of trust.</em>"
          </motion.h2>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={1}
            className="mt-6 space-y-5 text-[1rem] leading-[1.85] text-navy-900/70"
          >
            <p>
              When we started Vaishnavi in 2009, every client we onboarded had the same quiet anxiety —
              <em className="not-italic"> "What am I missing?"</em> A notice. A penalty. A small filing slip that
              would surface six quarters later.
            </p>
            <p>
              Fifteen years and 850+ clients on, that anxiety is exactly what we were built to remove.
              Every dashboard, SLA, and four-eye review we operate is engineered to answer that question
              before it ever has to be asked.
            </p>
            <p>
              We do not chase volume. We chase trust. And we measure ourselves not by how many filings we send out,
              but by how predictable, calm, and audit-ready our clients' compliance becomes.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={2}
            className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white/55 px-4 py-3 backdrop-blur-md"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-12 text-navy-600" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M2 16c2-4 4-6 8-6s6 4 12 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-sm text-navy-900/70">— {founder.name}, Founder</div>
          </motion.div>
        </div>
      </div>
    </SectionLayout>
  );
}
