"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { SERVICES } from "@/constants/services";
import { fadeUp, viewportOnce } from "@/animations/variants";
import { cn } from "@/utils/cn";

export function Services() {
  return (
    <SectionLayout id="services" className="bg-cloud">
      <SectionHeader
        eyebrow="What we do"
        title={
          <>
            Comprehensive <em className="not-italic text-navy-600">compliance services</em>,
            <br /> under one accountable roof.
          </>
        }
        description="From monthly payroll runs to GST audits, we own every compliance obligation — so your finance and people teams can focus on growth."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <motion.article
            key={s.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/55 p-6 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated"
          >
            <div
              className={cn(
                "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-80",
                "bg-gradient-to-br",
                s.accent,
              )}
            />
            <div
              className={cn(
                "relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow",
                "bg-gradient-to-br",
                s.accent,
              )}
            >
              <Icon name={s.icon} size={22} />
            </div>
            <h3 className="font-display text-[1.2rem] text-navy-900">{s.title}</h3>
            <p className="mt-2.5 text-[0.88rem] leading-[1.7] text-navy-900/60">{s.summary}</p>
            <ul className="mt-5 space-y-2 border-t border-navy-900/[0.06] pt-4">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[0.82rem] text-navy-900/75">
                  <span className="inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </SectionLayout>
  );
}
