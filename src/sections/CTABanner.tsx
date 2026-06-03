"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, viewportOnce } from "@/animations/variants";
import { cn } from "@/utils/cn";

interface CTABannerProps {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  cta?: { label: string; href: string };
  secondary?: { label: string; href: string };
  variant?: "brand" | "dark" | "subtle";
  className?: string;
}

const variants = {
  brand: "bg-gradient-brand text-white",
  dark: "bg-navy-900 text-white",
  subtle: "bg-white/55 text-navy-900 border border-white/70",
} as const;

export function CTABanner({
  id,
  eyebrow,
  title,
  description,
  cta = { label: "Book your free consultation", href: "#book" },
  secondary,
  variant = "brand",
  className,
}: CTABannerProps) {
  const isDark = variant !== "subtle";
  return (
    <section id={id} className={cn("py-20 sm:py-24", className)}>
      <Container size="lg">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className={cn(
            "relative overflow-hidden rounded-[28px] px-8 py-14 text-center shadow-elevated sm:px-14",
            variants[variant],
          )}
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

          {eyebrow && (
            <Badge tone={isDark ? "dark" : "brand"} className="mx-auto">
              {eyebrow}
            </Badge>
          )}
          <h2
            className={cn(
              "mx-auto mt-6 max-w-3xl font-display text-display-md",
              isDark ? "text-white" : "text-navy-900",
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mx-auto mt-5 max-w-xl text-[0.98rem] leading-[1.75]",
                isDark ? "text-white/80" : "text-navy-900/65",
              )}
            >
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={cta.href} variant={isDark ? "white" : "primary"} size="lg">
              {cta.label}
            </Button>
            {secondary && (
              <Button href={secondary.href} variant={isDark ? "ghost" : "outline"} size="lg">
                {secondary.label}
              </Button>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
