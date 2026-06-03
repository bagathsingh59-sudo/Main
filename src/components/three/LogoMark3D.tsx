"use client";

/**
 * Lightweight CSS/SVG shield mark — replaces the previous R3F canvas.
 * Used in the footer; was a third WebGL context contributing to lag.
 */
import { motion } from "framer-motion";

export function LogoMark3D({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      className="relative flex flex-shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      animate={{ y: [0, -3, 0], rotate: [0, 6, 0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-2xl bg-navy-600/40 blur-2xl" />
      <svg viewBox="0 0 64 64" className="relative h-full w-full" fill="none">
        <defs>
          <linearGradient id="footerShield" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a64f5" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        <path
          d="M32 6 L54 14 L54 30 C54 44 44 54 32 58 C20 54 10 44 10 30 L10 14 Z"
          fill="url(#footerShield)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M22 32 L29 39 L42 24" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}
