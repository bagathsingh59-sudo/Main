"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, viewportOnce } from "@/animations/variants";

const BARS = [
  { label: "Basic", value: 65, color: "linear-gradient(90deg,#1a56db,#0891b2)" },
  { label: "HRA", value: 30, color: "linear-gradient(90deg,#0891b2,#06b6d4)" },
  { label: "Special", value: 20, color: "linear-gradient(90deg,#7c3aed,#a855f7)" },
  { label: "PF (Emp)", value: 12, color: "linear-gradient(90deg,#059669,#10b981)" },
  { label: "ESI", value: 0.75, color: "linear-gradient(90deg,#f59e0b,#fbbf24)" },
];

const MONTHS = [
  { m: "Jan", s: "filed" },
  { m: "Feb", s: "filed" },
  { m: "Mar", s: "filed" },
  { m: "Apr", s: "filed" },
  { m: "May", s: "filed" },
  { m: "Jun", s: "filed" },
  { m: "Jul", s: "filed" },
  { m: "Aug", s: "filed" },
  { m: "Sep", s: "filed" },
  { m: "Oct", s: "pending" },
  { m: "Nov", s: "upcoming" },
  { m: "Dec", s: "upcoming" },
] as const;

const STATUS_COLOR: Record<(typeof MONTHS)[number]["s"], string> = {
  filed: "#10b981",
  pending: "#f59e0b",
  upcoming: "rgba(255,255,255,0.12)",
};

const DONUT = [
  { label: "PF Filed — 100%", color: "#1a56db", val: 100 },
  { label: "ESI Filed — 100%", color: "#0891b2", val: 100 },
  { label: "TDS Filed — 98%", color: "#7c3aed", val: 98 },
  { label: "GST Filed — 100%", color: "#059669", val: 100 },
  { label: "Pending — 2%", color: "#f59e0b", val: 2 },
];

export function DashboardShowcase() {
  const total = DONUT.reduce((a, d) => a + d.val, 0);
  let start = -Math.PI / 2;

  return (
    <SectionLayout id="dashboard" className="bg-navy-900 text-white" tone="dark">
      <div className="absolute inset-0 -z-0 opacity-20 bg-grid-light [background-size:48px_48px]" aria-hidden="true" />
      <div className="relative">
        <SectionHeader
          tone="dark"
          eyebrow="Payroll · Compliance · MIS"
          title={
            <>
              Real-time <em className="not-italic text-teal-400">payroll & statutory</em>
              <br /> dashboards.
            </>
          }
          description="A single pane of glass for finance, HR, and CXOs. Every filing, every deduction, every deadline — live."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[0.85rem] font-semibold tracking-wide text-navy-100/55">
                SALARY BREAKDOWN — Q2 2026
              </h4>
              <Badge tone="dark">Live</Badge>
            </div>
            <div className="mt-6 space-y-4">
              {BARS.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-20 flex-shrink-0 text-[0.82rem] text-navy-100/55">{b.label}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.value}%` }}
                      viewport={viewportOnce}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.08 }}
                      className="h-2 rounded-full"
                      style={{ background: b.color }}
                    />
                  </div>
                  <span className="w-12 text-right text-[0.8rem] text-navy-100/55">{b.value}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={1}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[0.85rem] font-semibold tracking-wide text-navy-100/55">
                COMPLIANCE STATUS · ACTIVE
              </h4>
              <Badge tone="dark">99.6%</Badge>
            </div>
            <div className="mt-5 flex items-center gap-6">
              <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
                {(() => {
                  const elements: JSX.Element[] = [];
                  let s = start;
                  DONUT.forEach((d) => {
                    const sweep = (d.val / total) * Math.PI * 2;
                    const x1 = 80 + 70 * Math.cos(s);
                    const y1 = 80 + 70 * Math.sin(s);
                    const x2 = 80 + 70 * Math.cos(s + sweep);
                    const y2 = 80 + 70 * Math.sin(s + sweep);
                    const largeArc = sweep > Math.PI ? 1 : 0;
                    elements.push(
                      <path
                        key={d.label}
                        d={`M80 80 L${x1} ${y1} A70 70 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={d.color}
                      />,
                    );
                    s += sweep;
                  });
                  return elements;
                })()}
                <circle cx="80" cy="80" r="44" fill="#0b1f3a" />
                <text x="80" y="86" fontSize="18" fontWeight="800" textAnchor="middle" fill="#ffffff">
                  99.6%
                </text>
              </svg>
              <div className="flex flex-col gap-2.5">
                {DONUT.map((d) => (
                  <div key={d.label} className="flex items-center gap-2.5 text-[0.82rem] text-navy-100/65">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    {d.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={2}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md lg:col-span-2"
          >
            <h4 className="text-[0.85rem] font-semibold tracking-wide text-navy-100/55">
              MONTHLY FILING CALENDAR — 2026
            </h4>
            <div className="mt-4 grid grid-cols-6 gap-2.5 sm:grid-cols-12">
              {MONTHS.map((m) => (
                <div
                  key={m.m}
                  className="rounded-xl px-2 py-3 text-center"
                  style={{ background: STATUS_COLOR[m.s] }}
                >
                  <div className="text-[0.78rem] font-bold text-white">{m.m}</div>
                  <div className="mt-1 text-[0.62rem] uppercase tracking-wide text-white/75">{m.s}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionLayout>
  );
}
