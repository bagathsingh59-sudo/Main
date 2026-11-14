"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Mount a single Lenis instance for the document and drive its RAF.
 * Also re-syncs window-scroll metrics so GSAP ScrollTrigger / scroll-listeners
 * read consistent positions.
 */
export function useLenis(enabled = true) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    // Redesigned pages may opt in to motion regardless of the OS setting.
    const forced = !!document.querySelector('.orisa[data-motion="always"]');
    if (!forced && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
}
