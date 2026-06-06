"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, viewportOnce } from "@/animations/variants";
import { TEAM } from "@/constants/team";

interface FounderProfile {
  name: string;
  role: string;
  image: string;
  initials: string;
  accent: string;
  quote: string;
  paragraphs: readonly string[];
  experienceStat: string;
  qualificationStat: string;
  signatureLabel: string;
}

interface FounderMessageProps {
  /** Admin-edited founder profile. Falls back to TEAM[0] for any empty field. */
  profile?: FounderProfile;
}

const DEFAULT_QUOTE = '"Compliance is not paperwork. *It is the operating system of trust.*"';
const DEFAULT_PARAGRAPHS: readonly string[] = [
  "When we started Vaishnavi in Kalaburagi back in 2018, every client we onboarded had the same quiet anxiety — \"What am I missing?\" A notice. A penalty. A small filing slip that would surface six quarters later.",
  "Drawing on more than 25 years of combined practitioner experience, that anxiety is exactly what we were built to remove. Every dashboard, SLA, and four-eye review we operate is engineered to answer that question before it ever has to be asked.",
  "We do not chase volume. We chase trust. And we measure ourselves not by how many filings we send out, but by how predictable, calm, and audit-ready our 250+ clients' compliance becomes.",
];

/** Render *asterisk-wrapped* segments as the brand-coloured emphasis. */
function renderQuote(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="not-italic text-navy-600">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function FounderMessage({ profile }: FounderMessageProps = {}) {
  const fallback = TEAM[0];
  const founder = {
    name: profile?.name?.trim() || fallback.name,
    role: profile?.role?.trim() || fallback.role,
    image: profile?.image?.trim() || fallback.image || "",
    initials: profile?.initials?.trim() || fallback.initials,
    accent: profile?.accent?.trim() || fallback.accent,
    quote: profile?.quote?.trim() || DEFAULT_QUOTE,
    paragraphs:
      profile && profile.paragraphs.length > 0 ? profile.paragraphs : DEFAULT_PARAGRAPHS,
    experienceStat: profile?.experienceStat?.trim() || "24+ yrs",
    qualificationStat: profile?.qualificationStat?.trim() || "FCA",
    signatureLabel:
      profile?.signatureLabel?.trim() || `${fallback.name}, Founder`,
  };

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
            {founder.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={founder.image}
                alt={`${founder.name} portrait`}
                className="mx-auto h-32 w-32 rounded-full object-cover shadow-glow"
              />
            ) : (
              <div
                className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${founder.accent} text-3xl font-extrabold text-white shadow-glow`}
              >
                {founder.initials}
              </div>
            )}
            <div className="mt-6 text-center">
              <div className="font-display text-2xl text-navy-900">{founder.name}</div>
              <div className="mt-1 text-sm text-navy-900/55">{founder.role}</div>
            </div>
            {(founder.experienceStat || founder.qualificationStat) && (
              <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                {founder.experienceStat && (
                  <div className="rounded-xl bg-cloud px-3 py-3">
                    <div className="text-lg font-extrabold text-navy-600">{founder.experienceStat}</div>
                    <div className="text-[0.7rem] text-navy-900/55">Practice</div>
                  </div>
                )}
                {founder.qualificationStat && (
                  <div className="rounded-xl bg-cloud px-3 py-3">
                    <div className="text-lg font-extrabold text-navy-600">{founder.qualificationStat}</div>
                    <div className="text-[0.7rem] text-navy-900/55">ICAI</div>
                  </div>
                )}
              </div>
            )}
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
            {renderQuote(founder.quote)}
          </motion.h2>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={1}
            className="mt-6 space-y-5 text-[1rem] leading-[1.85] text-navy-900/70"
          >
            {founder.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
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
            <div className="text-sm text-navy-900/70">— {founder.signatureLabel}</div>
          </motion.div>
        </div>
      </div>
    </SectionLayout>
  );
}
