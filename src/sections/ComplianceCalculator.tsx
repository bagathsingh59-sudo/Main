"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { estimateCompliance } from "@/services/calculator";
import { formatINR } from "@/utils/format";
import { fadeUp, viewportOnce } from "@/animations/variants";

const STATES = ["Karnataka", "Tamil Nadu", "Maharashtra", "Telangana", "Delhi NCR", "Gujarat", "West Bengal"];
const INDUSTRIES = [
  { id: "saas", label: "SaaS / Technology" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "healthcare", label: "Healthcare" },
  { id: "ecommerce", label: "E-commerce / D2C" },
  { id: "bfsi", label: "BFSI / NBFC" },
  { id: "retail", label: "Retail / FMCG" },
];

export function ComplianceCalculator() {
  const [employees, setEmployees] = useState(45);
  const [state, setState] = useState(STATES[0]);
  const [industry, setIndustry] = useState(INDUSTRIES[0].id);
  const [hasGst, setHasGst] = useState(true);
  const [hasPf, setHasPf] = useState(true);
  const [hasEsi, setHasEsi] = useState(true);

  const result = useMemo(
    () => estimateCompliance({ employees, state, industry, hasGst, hasPf, hasEsi }),
    [employees, state, industry, hasGst, hasPf, hasEsi],
  );

  return (
    <SectionLayout id="calculator" className="bg-gradient-to-b from-cloud to-mist">
      <SectionHeader
        eyebrow="Compliance calculator"
        title={
          <>
            Estimate your <em className="not-italic text-navy-600">monthly compliance footprint</em> —
            <br /> in 60 seconds.
          </>
        }
        description="Get an indicative monthly cost, hours saved, and current risk score. No email required."
      />

      <div className="mt-12 grid gap-7 lg:grid-cols-[1.15fr_1fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="rounded-3xl border border-white/70 bg-white/55 p-7 shadow-soft backdrop-blur-xl"
        >
          <div className="space-y-6">
            <Field label={`Number of employees · ${employees}`}>
              <input
                type="range"
                min={1}
                max={500}
                step={1}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full accent-navy-600"
                aria-label="Number of employees"
              />
              <div className="mt-1 flex justify-between text-[0.7rem] text-navy-900/45">
                <span>1</span>
                <span>500+</span>
              </div>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="State / region">
                <select value={state} onChange={(e) => setState(e.target.value)} className="form-input">
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Industry">
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="form-input">
                  {INDUSTRIES.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Statutory coverage required">
              <div className="flex flex-wrap gap-2.5">
                <Toggle label="GST" active={hasGst} onChange={setHasGst} />
                <Toggle label="EPF" active={hasPf} onChange={setHasPf} />
                <Toggle label="ESI" active={hasEsi} onChange={setHasEsi} />
              </div>
            </Field>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          custom={1}
          className="rounded-3xl border border-navy-900/5 bg-gradient-to-br from-navy-900 to-navy-800 p-7 text-white shadow-elevated"
        >
          <Badge tone="dark">Indicative estimate</Badge>
          <div className="mt-6 space-y-7">
            <Metric icon="Calculator" label="Estimated monthly cost" value={formatINR(result.monthlyCost)} />
            <Metric icon="Clock" label="Hours saved per month" value={`${result.savedHours} hrs`} />
            <Metric
              icon="ShieldCheck"
              label="Current compliance-risk score"
              value={`${result.riskScore}/100`}
              hint={result.riskScore < 30 ? "Healthy" : result.riskScore < 60 ? "Moderate" : "Needs attention"}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <div className="text-[0.78rem] font-semibold uppercase tracking-wide text-teal-300">Recommended for you</div>
            <ul className="mt-2 space-y-1.5 text-[0.9rem] text-white/85">
              {result.recommendedServices.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <Button href="#book" variant="white" className="mt-6 w-full">
            Get a precise quote
          </Button>
        </motion.div>
      </div>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1.5px solid rgba(11, 31, 58, 0.1);
          background: rgba(255, 255, 255, 0.75);
          padding: 0 14px;
          font-size: 0.92rem;
          color: #0b1f3a;
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.form-input:focus) {
          border-color: #1a56db;
        }
      `}</style>
    </SectionLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.78rem] font-semibold uppercase tracking-wide text-navy-900/60">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-[0.85rem] font-semibold transition-all ${
        active
          ? "border-transparent bg-gradient-brand text-white shadow-glow"
          : "border-navy-900/15 bg-white/60 text-navy-900/65 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentProps<typeof Icon>["name"];
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-teal-300">
        <Icon name={icon} size={20} />
      </div>
      <div className="flex-1">
        <div className="text-[0.78rem] uppercase tracking-wide text-white/55">{label}</div>
        <div className="mt-0.5 text-2xl font-extrabold">{value}</div>
        {hint && <div className="mt-0.5 text-[0.78rem] text-teal-300">{hint}</div>}
      </div>
    </div>
  );
}
