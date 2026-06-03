"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AboutOrbit } from "@/components/three/AboutOrbit";
import { fadeUp, slideInLeft, slideInRight, viewportOnce } from "@/animations/variants";
import { COMPANY } from "@/constants/company";

const HIGHLIGHTS = [
  "ICAI-registered firm with Big-4 alumni leadership",
  "ISO 27001:2022 certified data-security practices",
  "Dedicated relationship manager for every client",
  "24-hour SLA on all compliance queries",
  "Zero-penalty guarantee on timely filings",
];

export function AboutUs() {
  return (
    <SectionLayout id="about" className="bg-cloud">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative grid gap-4"
        >
          {/* Office photo */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-elevated">
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80&auto=format&fit=crop"
              alt="Vaishnavi Consultants office — Bengaluru"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/65 via-navy-900/10 to-transparent" />
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              custom={2}
              className="absolute right-5 top-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-soft backdrop-blur-xl"
            >
              <div className="text-xl font-extrabold text-navy-600">₹4,200Cr+</div>
              <div className="text-[0.75rem] font-medium text-navy-900/55">Tax savings delivered</div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              custom={3}
              className="absolute bottom-5 left-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-soft backdrop-blur-xl"
            >
              <div className="text-xl font-extrabold text-navy-600">99.8%</div>
              <div className="text-[0.75rem] font-medium text-navy-900/55">On-time filing rate</div>
            </motion.div>
            <div className="absolute bottom-5 right-5 rounded-full border border-white/40 bg-navy-900/40 px-3 py-1 text-[0.7rem] font-semibold text-white backdrop-blur-md">
              Bengaluru · One BKC, Mumbai · Hyderabad
            </div>
          </div>

          {/* Animated compliance hub */}
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl shadow-elevated">
            <AboutOrbit className="absolute inset-0 h-full w-full" />
          </div>
        </motion.div>

        <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <SectionHeader
            eyebrow={`About ${COMPANY.name}`}
            title={
              <>
                Fifteen years of <em className="not-italic text-navy-600">trusted compliance</em>.
              </>
            }
            description={`Founded in ${COMPANY.foundedYear}, Vaishnavi has grown from a Bengaluru boutique CA practice into one of India's most trusted compliance consultancies — partnering with startups, mid-market, and Fortune 500 subsidiaries.`}
          />
          <p className="mt-6 text-[0.95rem] leading-[1.85] text-navy-900/65">
            Our 120+ chartered accountants, tax counsel, and compliance technologists form your compliance command centre —
            proactively managing risk before it becomes a liability.
          </p>
          <ul className="mt-7 space-y-3">
            {HIGHLIGHTS.map((h, i) => (
              <motion.li
                key={h}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                custom={i}
                className="flex items-start gap-3 text-[0.95rem] font-medium text-navy-900"
              >
                <span className="mt-[2px] inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
                {h}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </SectionLayout>
  );
}
