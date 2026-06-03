"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SERVICES } from "@/constants/services";
import { fadeUp, viewportOnce } from "@/animations/variants";
import { cn } from "@/utils/cn";

/**
 * Slimmed services tile grid for the home page — shows 4 priority services and links to /services.
 */
export function ServicesPreview() {
  const featured = SERVICES.slice(0, 4);

  return (
    <SectionLayout id="services-preview" className="bg-mist">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          eyebrow="What we do"
          title={
            <>
              Compliance, <em className="not-italic text-navy-600">covered.</em>
            </>
          }
          description="Eight services. One accountable team. Pick the modules you need — we own the rest."
        />
        <Button href="/services" variant="outline" size="sm">
          See all services →
        </Button>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((s, i) => (
          <motion.a
            key={s.id}
            href={`/services#${s.id}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/55 p-6 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated"
          >
            <div
              className={cn(
                "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-90",
                "bg-gradient-to-br",
                s.accent,
              )}
            />
            <div className={cn("relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow bg-gradient-to-br", s.accent)}>
              <Icon name={s.icon} size={22} />
            </div>
            <h3 className="font-display text-[1.15rem] text-navy-900">{s.title}</h3>
            <p className="mt-2 text-[0.86rem] leading-[1.65] text-navy-900/60">{s.summary}</p>
            <div className="mt-5 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-navy-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Learn more →
            </div>
          </motion.a>
        ))}
      </div>
    </SectionLayout>
  );
}
