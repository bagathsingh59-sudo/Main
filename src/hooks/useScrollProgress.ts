"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { clamp } from "@/utils/format";

/**
 * Tracks the 0..1 progress of a given element through the viewport.
 * - 0 when the section's top reaches the viewport bottom
 * - 1 when the section's bottom passes the viewport top
 * For sticky sections, pass the *outer* element and read its progress directly.
 */
export function useScrollProgress(ref: RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(clamp(total > 0 ? scrolled / total : 0, 0, 1));
    };

    const onScroll = () => {
      if (raf.current !== null) return;
      raf.current = requestAnimationFrame(() => {
        update();
        raf.current = null;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [ref]);

  return progress;
}
