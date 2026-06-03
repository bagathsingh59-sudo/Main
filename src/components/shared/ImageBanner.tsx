"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BannerStat {
  value: string;
  label: string;
}

interface ImageBannerProps {
  src: string;
  alt: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  stats?: BannerStat[];
  height?: "sm" | "md" | "lg";
  align?: "left" | "center";
  overlay?: "dark" | "navy" | "brand";
  className?: string;
  id?: string;
}

const heights = {
  sm: "h-[60vh] min-h-[420px]",
  md: "h-[75vh] min-h-[520px]",
  lg: "h-[88vh] min-h-[620px]",
};

const overlays = {
  dark: "from-black/75 via-black/45 to-black/65",
  navy: "from-navy-900/85 via-navy-900/45 to-navy-900/85",
  brand: "from-navy-900/80 via-navy-700/40 to-teal-700/70",
};

export function ImageBanner({
  src,
  alt,
  eyebrow,
  title,
  description,
  stats,
  height = "md",
  align = "left",
  overlay = "navy",
  className,
  id,
}: ImageBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative isolate w-full overflow-hidden", heights[height], className)}
    >
      <motion.div className="absolute inset-0" style={{ y }} aria-hidden="true">
        <Image src={src} alt={alt} fill priority={false} sizes="100vw" className="object-cover" />
      </motion.div>
      <div className={cn("absolute inset-0 bg-gradient-to-br", overlays[overlay])} aria-hidden="true" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8">
        <motion.div
          style={{ opacity }}
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
              {eyebrow}
            </div>
          )}
          <h2 className="font-display text-display-lg text-white text-balance">{title}</h2>
          {description && (
            <p className="mt-5 max-w-xl text-[1.02rem] leading-[1.75] text-white/80">{description}</p>
          )}

          {stats && stats.length > 0 && (
            <div
              className={cn(
                "mt-9 grid gap-3",
                stats.length === 2 && "grid-cols-2",
                stats.length === 3 && "grid-cols-3",
                stats.length === 4 && "grid-cols-2 sm:grid-cols-4",
              )}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
                  className="rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-4 backdrop-blur-md"
                >
                  <div className="bg-gradient-to-br from-white to-teal-200 bg-clip-text text-2xl font-extrabold leading-none text-transparent sm:text-[1.65rem]">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[0.72rem] font-medium uppercase tracking-wide text-white/65">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom fade for visual continuity into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-mist/40" />
    </section>
  );
}
