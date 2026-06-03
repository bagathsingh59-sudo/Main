"use client";

/**
 * SVG / CSS compliance-hub illustration.
 *
 * Replaces the previous WebGL canvas to (a) kill an entire GL context for perf,
 * and (b) communicate the actual subject of the firm — EPF, ESI, GST, TDS, PT
 * compliance orbiting a central Vaishnavi shield.
 */
import { motion } from "framer-motion";

const NODES = [
  { label: "EPF", color: "#1a56db", angle: 0 },
  { label: "ESI", color: "#0891b2", angle: 60 },
  { label: "GST", color: "#7c3aed", angle: 120 },
  { label: "TDS", color: "#059669", angle: 180 },
  { label: "PT", color: "#f59e0b", angle: 240 },
  { label: "ITR", color: "#dc2626", angle: 300 },
];

export function AboutOrbit({ className }: { className?: string }) {
  return (
    <div
      className={`${className} relative overflow-hidden`}
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #14306b 0%, #0b1f3a 60%, #06122a 100%)" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:36px_36px]"
        aria-hidden="true"
      />

      {/* Concentric orbit rings */}
      <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3a64f5" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#0b1f3a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbitStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3a64f5" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#3a64f5" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="160" r="160" fill="url(#ringGlow)" />

        {[60, 90, 120].map((r, i) => (
          <motion.ellipse
            key={r}
            cx="200"
            cy="160"
            rx={r * 1.2}
            ry={r * 0.7}
            fill="none"
            stroke="url(#orbitStroke)"
            strokeWidth="1"
            strokeDasharray="4 6"
            transform={`rotate(${i * 30} 200 160)`}
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ repeat: Infinity, duration: 18 + i * 6, ease: "linear" }}
          />
        ))}
      </svg>

      {/* Orbiting badges */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 36, ease: "linear" }}
      >
        {NODES.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = 50 + 35 * Math.cos(rad);
          const y = 50 + 22 * Math.sin(rad);
          return (
            <motion.div
              key={n.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 36, ease: "linear" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-[0.75rem] font-extrabold text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] ring-1 ring-white/20"
                style={{ background: `linear-gradient(135deg, ${n.color}, rgba(255,255,255,0.05))` }}
              >
                {n.label}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Center shield */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-navy-600/40 blur-3xl" />
          <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.4)]">
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
              <defs>
                <linearGradient id="shieldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a64f5" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
              <path
                d="M32 6 L54 14 L54 30 C54 44 44 54 32 58 C20 54 10 44 10 30 L10 14 Z"
                fill="url(#shieldFill)"
                stroke="#ffffff"
                strokeOpacity="0.4"
              />
              <path d="M22 32 L29 39 L42 24" stroke="#ffffff" strokeWidth="3" />
            </svg>
            <div className="mt-3 text-center font-display text-[0.92rem] leading-tight text-white">
              Compliance
              <br />
              Shield
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pulsing dot accents */}
      {[
        { top: "18%", left: "22%", delay: 0 },
        { top: "30%", right: "18%", delay: 1.2 },
        { bottom: "22%", left: "30%", delay: 2.4 },
        { bottom: "18%", right: "22%", delay: 0.6 },
      ].map((p, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_16px_#22d3ee]"
          style={p as React.CSSProperties}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.6, 1] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}
