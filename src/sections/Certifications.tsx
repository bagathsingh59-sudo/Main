"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CERTIFICATIONS } from "@/constants/certifications";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function Certifications() {
  return (
    <SectionLayout id="certifications" className="bg-mist">
      <SectionHeader
        eyebrow="Certifications & accreditations"
        title={
          <>
            Audited credentials. <em className="not-italic text-navy-600">Independently verifiable.</em>
          </>
        }
        description="Every claim we make is backed by a registration number, an audit trail, or both."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((c, i) => (
          <motion.div
            key={c.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group flex items-center gap-5 rounded-3xl border border-white/70 bg-white/55 p-6 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-3 0-2 6 5-3 5 3-2-6" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[0.95rem] font-bold text-navy-900">{c.name}</div>
              <div className="mt-0.5 truncate text-[0.78rem] text-navy-900/55">{c.body}</div>
              <div className="mt-1 text-[0.72rem] font-mono text-teal-700">{c.code}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
