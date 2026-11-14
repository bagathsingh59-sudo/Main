"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { useOrisaMotion } from "./useOrisaMotion";

/**
 * A <section> whose descendants' motion attributes (data-fade,
 * data-reveal, data-zoomin, data-count …) are wired up. Only this thin
 * wrapper is a client component — the section's content can stay a
 * server component and ship no JavaScript of its own.
 */
export function MotionSection({ children, ...rest }: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  useOrisaMotion(ref);
  return (
    <section ref={ref} {...rest}>
      {children}
    </section>
  );
}
