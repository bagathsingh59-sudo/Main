"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Re-evaluate ScrollTrigger positions after async content / layout shifts.
 * Call after fonts load or images settle.
 */
export const refreshScrollTriggers = () => {
  if (typeof window !== "undefined") ScrollTrigger.refresh();
};

export { gsap, ScrollTrigger };
