"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/animations/variants";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variants?: Variants;
  as?: "div" | "section" | "article" | "li";
}

export function Reveal({ children, delay = 0, className, variants = fadeUp, as = "div" }: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      custom={delay}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
