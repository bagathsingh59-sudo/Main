"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TEAM } from "@/constants/team";
import { fadeUp, viewportOnce } from "@/animations/variants";
import { cn } from "@/utils/cn";

export function Team() {
  return (
    <SectionLayout id="team" className="bg-cloud">
      <SectionHeader
        eyebrow="Leadership"
        title={
          <>
            The CAs, lawyers, and technologists{" "}
            <em className="not-italic text-navy-600">behind every filing.</em>
          </>
        }
        description="Decades of Big-4, Mercer, and CFO experience — answering your team's questions in plain English."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((m, i) => (
          <motion.article
            key={m.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={i}
            className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/65 p-6 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl shadow-glow">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={`${m.name} — ${m.role}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-full w-full items-center justify-center text-xl font-extrabold text-white",
                      "bg-gradient-to-br",
                      m.accent,
                    )}
                  >
                    {m.initials}
                  </div>
                )}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 mix-blend-overlay opacity-70",
                    "bg-gradient-to-br",
                    m.accent,
                  )}
                />
              </div>
              <div>
                <div className="text-[1.02rem] font-bold text-navy-900">{m.name}</div>
                <div className="text-[0.82rem] text-teal-700">{m.role}</div>
              </div>
            </div>
            <p className="mt-5 text-[0.9rem] leading-[1.7] text-navy-900/65">{m.bio}</p>
            <div className="mt-6 flex items-center gap-3 text-[0.78rem]">
              <a className="font-semibold text-navy-600 hover:underline" href="#">
                LinkedIn ↗
              </a>
              <span className="text-navy-900/30">·</span>
              <a className="font-semibold text-navy-600 hover:underline" href="#">
                Full bio
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionLayout>
  );
}
