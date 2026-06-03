"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { fadeUp, viewportOnce } from "@/animations/variants";

const SLOTS_BY_DAY = [
  { day: "Mon", slots: ["10:00", "11:30", "14:30", "16:00"] },
  { day: "Tue", slots: ["10:00", "12:00", "15:00", "17:00"] },
  { day: "Wed", slots: ["09:30", "11:00", "14:00", "16:30"] },
  { day: "Thu", slots: ["10:30", "13:00", "15:30", "17:00"] },
  { day: "Fri", slots: ["10:00", "11:30", "14:00", "16:00"] },
];

const PROMISES = [
  "45-minute call with a senior partner",
  "Compliance health-check across PF, ESI, GST, TDS",
  "Indicative pricing and migration plan",
  "No sales pitch. No follow-up unless you ask.",
];

export function BookConsultation() {
  const [day, setDay] = useState(SLOTS_BY_DAY[0].day);
  const [slot, setSlot] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentSlots = SLOTS_BY_DAY.find((d) => d.day === day)?.slots ?? [];

  return (
    <SectionLayout id="book" className="bg-gradient-to-br from-navy-900 to-navy-800 text-white" tone="dark">
      <div aria-hidden="true" className="absolute inset-0 -z-0 opacity-20 bg-grid-light [background-size:48px_48px]" />
      <div className="relative">
        <SectionHeader
          tone="dark"
          eyebrow="Book a consultation"
          title={
            <>
              Get a <em className="not-italic text-teal-400">45-minute audit</em> on us.
              <br /> Worth ₹15,000.
            </>
          }
          description="Pick a slot that suits you. You'll get a calendar invite and a short questionnaire so we make every minute count."
        />

        <div className="mt-12 grid gap-7 lg:grid-cols-[1.1fr_1fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-md"
          >
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-teal-300">
              Step 1 — pick a day
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {SLOTS_BY_DAY.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => {
                    setDay(d.day);
                    setSlot(null);
                  }}
                  className={`rounded-xl px-4 py-2.5 text-[0.85rem] font-semibold transition-all ${
                    day === d.day
                      ? "bg-gradient-brand text-white shadow-glow"
                      : "bg-white/5 text-navy-100/70 hover:bg-white/10"
                  }`}
                >
                  {d.day}
                </button>
              ))}
            </div>

            <div className="mt-7 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-teal-300">
              Step 2 — pick a time (IST)
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {currentSlots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`rounded-xl border px-3 py-3 text-[0.9rem] font-semibold transition-all ${
                    slot === s
                      ? "border-transparent bg-gradient-brand text-white shadow-glow"
                      : "border-white/10 bg-white/5 text-navy-100/70 hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-7 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-teal-300">
              Step 3 — confirm
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <input className="dark-input" placeholder="Full name" required />
              <input className="dark-input" placeholder="Work email" type="email" required />
              <input className="dark-input sm:col-span-2" placeholder="Company · Role" />
              <Button type="submit" variant="white" className="sm:col-span-2 w-full" disabled={!slot || submitted}>
                {submitted ? "✓ Slot reserved — check your inbox" : slot ? `Reserve ${day} · ${slot} IST` : "Pick a slot first"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={1}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md"
          >
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-teal-300">
              What you'll get
            </div>
            <ul className="mt-4 space-y-3">
              {PROMISES.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[0.95rem] text-navy-100/85">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-300">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-white/5 p-5">
              <div className="text-[0.78rem] font-semibold uppercase tracking-wide text-teal-300">
                Prefer to talk first?
              </div>
              <ul className="mt-3 space-y-2.5 text-[0.92rem] text-white/85">
                <li className="flex items-center gap-3">
                  <Icon name="Phone" size={18} className="text-teal-300" /> +91 80 4123 8800
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="Mail" size={18} className="text-teal-300" /> connect@vaishnaviconsultants.in
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        :global(.dark-input) {
          height: 46px;
          border-radius: 12px;
          padding: 0 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 0.92rem;
          outline: none;
        }
        :global(.dark-input::placeholder) {
          color: rgba(255, 255, 255, 0.4);
        }
        :global(.dark-input:focus) {
          border-color: #22d3ee;
        }
      `}</style>
    </SectionLayout>
  );
}
