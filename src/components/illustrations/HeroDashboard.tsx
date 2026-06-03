"use client";

import { motion } from "framer-motion";

/**
 * SVG/CSS mock of the Vaishnavi Dashboard — gives the hero a real product visual
 * without shipping any binary assets.
 *
 * The outer wrapper renders visible at SSR (no opacity:0 initial state). The
 * inner bars / tiles / calendar still animate in via Framer because they are
 * decorative and don't affect LCP — the dashboard frame is already painted.
 */
export function HeroDashboard({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Soft platform shadow */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-6 -bottom-6 h-12 rounded-[50%] bg-navy-900/20 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_30px_80px_rgba(11,31,58,0.18)] backdrop-blur-xl">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-navy-900/[0.06] px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-2.5 w-2.5 rounded-full bg-rose-400" />
            <div className="flex h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="ml-3 text-[0.7rem] font-semibold text-navy-900/55">vaishnavi.app / dashboard</div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-700">
              ● ALL FILED
            </div>
            <div className="text-[0.7rem] font-medium text-navy-900/55">FY 2025-26</div>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-3">
          {/* KPI tiles */}
          <KPI label="Filings this month" value="42" delta="+6" tone="navy" />
          <KPI label="Compliance score" value="99.6%" delta="▲ 0.4" tone="teal" />
          <KPI label="Penalties YTD" value="₹0" delta="0" tone="emerald" />

          {/* Bars panel */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="rounded-2xl border border-navy-900/[0.06] bg-cloud p-4 sm:col-span-2"
          >
            <div className="flex items-center justify-between text-[0.7rem] font-semibold text-navy-900/55">
              <span>SALARY BREAKDOWN · Q2</span>
              <span className="text-teal-700">Live</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {[
                { label: "Basic", val: 65, color: "from-navy-600 to-teal-600" },
                { label: "HRA", val: 30, color: "from-teal-600 to-cyan-400" },
                { label: "Special", val: 20, color: "from-purple-500 to-fuchsia-500" },
                { label: "PF", val: 12, color: "from-emerald-500 to-emerald-400" },
                { label: "ESI", val: 0.75, color: "from-amber-500 to-amber-400" },
              ].map((b, i) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="w-14 text-[0.7rem] font-medium text-navy-900/55">{b.label}</span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-navy-900/[0.06]">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: `${b.val}%` }}
                      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.9 + i * 0.08 }}
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${b.color}`}
                    />
                  </div>
                  <span className="w-10 text-right text-[0.7rem] font-semibold text-navy-900/70">{b.val}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Donut panel */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col items-center justify-between rounded-2xl border border-navy-900/[0.06] bg-cloud p-4"
          >
            <div className="self-stretch text-[0.7rem] font-semibold text-navy-900/55">FILING STATUS</div>
            <Donut />
            <div className="mt-2 space-y-1 self-stretch text-[0.66rem] text-navy-900/65">
              <Legend dot="#1a56db" text="EPF · 100%" />
              <Legend dot="#0891b2" text="ESI · 100%" />
              <Legend dot="#059669" text="GST · 100%" />
              <Legend dot="#f59e0b" text="Pending · 2%" />
            </div>
          </motion.div>

          {/* Filing calendar strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95 }}
            className="rounded-2xl border border-navy-900/[0.06] bg-cloud p-4 sm:col-span-3"
          >
            <div className="mb-3 flex items-center justify-between text-[0.7rem] font-semibold text-navy-900/55">
              <span>FILING CALENDAR · FY 2025-26</span>
              <span>10 / 12 filed</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
              {[
                "filed", "filed", "filed", "filed", "filed", "filed",
                "filed", "filed", "filed", "filed", "pending", "upcoming",
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1 + i * 0.04 }}
                  className="flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[0.62rem] font-bold text-white"
                  style={{
                    background:
                      s === "filed"
                        ? "linear-gradient(135deg,#10b981,#059669)"
                        : s === "pending"
                          ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
                          : "rgba(11,31,58,0.08)",
                    color: s === "upcoming" ? "rgba(11,31,58,0.4)" : "#fff",
                  }}
                >
                  <span>{MONTHS[i]}</span>
                  {s === "filed" && <span className="text-[0.55rem]">✓</span>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating "₹2.4Cr saved" badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="absolute -left-4 top-10 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-elevated backdrop-blur-xl sm:block"
      >
        <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-teal-700">Tax saved · YTD</div>
        <div className="mt-0.5 bg-gradient-brand bg-clip-text text-xl font-extrabold text-transparent">₹2.4 Cr</div>
      </motion.div>

      {/* Floating "Zero penalty" badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute -right-3 bottom-10 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-elevated backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 inline-flex h-full w-full animate-pulse-soft rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-700">Zero penalties</div>
        </div>
        <div className="mt-0.5 text-sm font-bold text-navy-900">4 years running</div>
      </motion.div>
    </div>
  );
}

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function KPI({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "navy" | "teal" | "emerald";
}) {
  const tones = {
    navy: "from-navy-600 to-teal-600",
    teal: "from-teal-600 to-cyan-400",
    emerald: "from-emerald-500 to-emerald-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-navy-900/[0.06] bg-cloud p-4"
    >
      <div className="text-[0.68rem] font-semibold uppercase tracking-wide text-navy-900/55">{label}</div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <span className={`bg-gradient-to-r bg-clip-text text-xl font-extrabold text-transparent ${tones[tone]}`}>
          {value}
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.62rem] font-bold text-emerald-700">
          {delta}
        </span>
      </div>
    </motion.div>
  );
}

function Donut() {
  // SVG donut, statically rendered — cheap.
  const data = [
    { color: "#1a56db", val: 33 },
    { color: "#0891b2", val: 33 },
    { color: "#059669", val: 32 },
    { color: "#f59e0b", val: 2 },
  ];
  const r = 30;
  const cx = 40;
  const cy = 40;
  let acc = -Math.PI / 2;
  return (
    <svg viewBox="0 0 80 80" className="my-1 h-20 w-20" aria-hidden="true">
      {data.map((d, i) => {
        const angle = (d.val / 100) * Math.PI * 2;
        const x1 = cx + r * Math.cos(acc);
        const y1 = cy + r * Math.sin(acc);
        const x2 = cx + r * Math.cos(acc + angle);
        const y2 = cy + r * Math.sin(acc + angle);
        const large = angle > Math.PI ? 1 : 0;
        const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
        acc += angle;
        return <path key={i} d={path} fill={d.color} />;
      })}
      <circle cx={cx} cy={cy} r="18" fill="#f5f8ff" />
      <text x={cx} y={cy + 3} fontSize="11" fontWeight="800" textAnchor="middle" fill="#0b1f3a">
        99.6%
      </text>
    </svg>
  );
}

function Legend({ dot, text }: { dot: string; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
      {text}
    </div>
  );
}
