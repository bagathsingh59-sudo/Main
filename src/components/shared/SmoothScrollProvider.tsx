"use client";

import { useEffect, type ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";
import { registerGsap, ScrollTrigger } from "@/animations/scrollTriggers";

/**
 * Mounts Lenis once at the app root and wires its scroll into GSAP ScrollTrigger
 * so all scroll-driven animations share a single, smoothed scroll source.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useLenis();

  useEffect(() => {
    registerGsap();
    // Refresh after fonts / images settle, so triggers compute correct offsets.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, []);

  return <>{children}</>;
}
