"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface Dot {
  id: string;
  label: string;
}

interface SectionDotsProps {
  dots: Dot[];
}

/**
 * Vertical scroll progress / section indicator (right side, desktop only).
 * Updates on scroll using IntersectionObserver — cheap and accurate.
 */
export function SectionDots({ dots }: SectionDotsProps) {
  const [active, setActive] = useState<string | null>(dots[0]?.id ?? null);
  const ratiosRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const ratios: Record<string, number> = {};
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          ratios[e.target.id] = e.intersectionRatio;
        });
        let best: string | null = null;
        let max = 0;
        for (const [id, r] of Object.entries(ratios)) {
          if (r > max) {
            max = r;
            best = id;
          }
        }
        if (best && max > 0.15) setActive(best);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.8, 1] },
    );
    ratiosRef.current = ratios;
    dots.forEach((d) => {
      const el = document.getElementById(d.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [dots]);

  if (dots.length < 2) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {dots.map((d) => {
        const isActive = d.id === active;
        return (
          <a
            key={d.id}
            href={`#${d.id}`}
            className="pointer-events-auto group flex items-center gap-3"
            aria-current={isActive ? "true" : undefined}
            aria-label={`Jump to ${d.label}`}
          >
            <span
              className={cn(
                "ml-auto whitespace-nowrap rounded-full bg-white/85 px-3 py-1 text-[0.7rem] font-semibold text-navy-900 shadow-soft backdrop-blur-md transition-all",
                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
              )}
            >
              {d.label}
            </span>
            <span
              className={cn(
                "relative inline-block h-2 rounded-full transition-all",
                isActive
                  ? "w-8 bg-gradient-brand shadow-[0_0_12px_rgba(26,86,219,0.5)]"
                  : "w-2 bg-navy-900/25 group-hover:bg-navy-900/55",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
