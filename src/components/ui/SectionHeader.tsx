"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { fadeUp, viewportOnce } from "@/animations/variants";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <header className={cn(isCenter && "text-center mx-auto", "max-w-3xl", className)}>
      {eyebrow && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className={cn(
            "text-[0.72rem] font-bold uppercase tracking-[0.22em] mb-4",
            isDark ? "text-teal-400" : "text-teal-600",
          )}
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        custom={1}
        className={cn(
          "font-display text-display-lg",
          isDark ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          custom={2}
          className={cn(
            "mt-5 text-base sm:text-lg leading-[1.7] max-w-2xl",
            isCenter && "mx-auto",
            isDark ? "text-navy-100/70" : "text-navy-900/65",
          )}
        >
          {description}
        </motion.p>
      )}
    </header>
  );
}
