"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { COMPANY } from "@/constants/company";
import { fadeUp, viewportOnce } from "@/animations/variants";

/**
 * Bookings are powered by Google Appointment Schedules — it gives us:
 *   • Real-time availability tied to harihar@'s calendar
 *   • Atomic conflict prevention (no double-bookings)
 *   • Automatic Google Meet links + email invites
 *   • 24-hour and 1-hour reminders out of the box
 *   • Reschedule & cancel links the client controls
 *
 * Configure `NEXT_PUBLIC_BOOKING_URL` to the Google booking page URL
 * (looks like `https://calendar.app.google/<id>`). When unset, the CTA
 * falls back to a phone-or-email message so the page never feels broken
 * in preview / dev deployments.
 */
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

const PROMISES = [
  "45-minute call with a senior partner",
  "Compliance health-check across PF, ESI, GST, TDS",
  "Indicative pricing and migration plan",
  "No sales pitch. No follow-up unless you ask.",
];

const HOW_IT_WORKS = [
  { step: "1", title: "Pick a slot", detail: "Live calendar — only times we're actually free show up." },
  { step: "2", title: "Auto-confirmed", detail: "Google Meet invite hits your inbox the moment you click confirm." },
  { step: "3", title: "We do the prep", detail: "A short questionnaire arrives so the call hits the ground running." },
];

interface BookConsultationProps {
  /** Admin-edited contact info — overrides COMPANY constant when set. */
  contactInfo?: {
    phone: string;
    email: string;
    hours: string;
  };
  /** When set, replaces the booking CTA with a maintenance card. */
  maintenanceMessage?: string;
}

export function BookConsultation({ contactInfo, maintenanceMessage }: BookConsultationProps = {}) {
  const phone = contactInfo?.phone || COMPANY.contact.phone;
  const email = contactInfo?.email || COMPANY.contact.email;
  const hours = contactInfo?.hours || COMPANY.contact.hours;

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
          description="Pick a slot from our live calendar — Google handles the invite, the Meet link, and the reminders. You just show up."
        />

        <div className="mt-12 grid gap-7 lg:grid-cols-[1.1fr_1fr]">
          {/* ─── primary CTA card ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-md sm:p-9"
          >
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-teal-300">
              How it works
            </div>
            <ol className="mt-5 space-y-4">
              {HOW_IT_WORKS.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-brand text-[0.85rem] font-bold text-white shadow-glow">
                    {s.step}
                  </span>
                  <div>
                    <div className="text-[0.98rem] font-bold text-white">{s.title}</div>
                    <div className="mt-0.5 text-[0.88rem] leading-[1.55] text-navy-100/70">{s.detail}</div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              {maintenanceMessage ? (
                <div className="rounded-2xl border-2 border-amber-300/60 bg-amber-500/15 p-5">
                  <div className="flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-amber-300">
                    ⚠ Booking paused
                  </div>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-amber-50">{maintenanceMessage}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-[0.88rem] font-semibold text-white hover:bg-amber-600"
                    >
                      📞 {phone}
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-white/5 px-4 py-2.5 text-[0.88rem] font-semibold text-amber-50 hover:bg-white/10"
                    >
                      ✉ {email}
                    </a>
                  </div>
                </div>
              ) : BOOKING_URL ? (
                <Button
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="white"
                  size="lg"
                  className="w-full"
                >
                  Open the booking calendar →
                </Button>
              ) : (
                <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-5 text-[0.9rem] text-navy-100/80">
                  Booking calendar is being set up. In the meantime, reach us on{" "}
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold text-teal-300 hover:text-teal-200">
                    {phone}
                  </a>{" "}
                  or{" "}
                  <a href={`mailto:${email}`} className="font-semibold text-teal-300 hover:text-teal-200">
                    {email}
                  </a>
                  .
                </div>
              )}
              <p className="mt-3 text-center text-[0.78rem] text-navy-100/55">
                {maintenanceMessage ? "Forms briefly offline" : "Opens Google Calendar"} · {hours}
              </p>
            </div>
          </motion.div>

          {/* ─── what you'll get card ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={1}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md sm:p-9"
          >
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-teal-300">
              What you&apos;ll get
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
                  <Icon name="Phone" size={18} className="text-teal-300" /> {phone}
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="Mail" size={18} className="text-teal-300" /> {email}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionLayout>
  );
}
