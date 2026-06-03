"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, stagger } from "@/animations/variants";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  image?: string;
  imageAlt?: string;
  breadcrumbs?: Breadcrumb[];
  align?: "left" | "center";
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  breadcrumbs,
  align = "left",
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      {/* Background image with mask */}
      {image && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <Image src={image} alt={imageAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-mist/95 via-mist/85 to-mist" />
          <div className="absolute inset-0 bg-grid-light opacity-30 [background-size:48px_48px] mask-radial" />
        </div>
      )}
      {!image && (
        <div className="absolute inset-0 -z-10 bg-gradient-mist" aria-hidden="true">
          <div className="absolute inset-0 bg-grid-light opacity-30 [background-size:48px_48px] mask-radial" />
        </div>
      )}

      <div className="pointer-events-none absolute -top-20 left-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-navy-200/45 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[360px] w-[360px] rounded-full bg-teal-100/55 blur-3xl" aria-hidden="true" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className={`mx-auto max-w-5xl px-5 sm:px-8 ${align === "center" ? "text-center" : ""}`}
      >
        {breadcrumbs && (
          <motion.nav variants={fadeUp} className="mb-6 flex flex-wrap items-center gap-2 text-[0.78rem] text-navy-900/55" aria-label="Breadcrumb">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {b.href ? (
                  <Link href={b.href} className="hover:text-navy-900">
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-navy-900">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span className="text-navy-900/30">/</span>}
              </span>
            ))}
          </motion.nav>
        )}

        {eyebrow && (
          <motion.div variants={fadeUp}>
            <Badge dot tone="brand">{eyebrow}</Badge>
          </motion.div>
        )}

        <motion.h1
          variants={fadeUp}
          className="mt-5 font-display text-display-xl text-navy-900 text-balance"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            variants={fadeUp}
            className={`mt-5 max-w-2xl text-base leading-[1.75] text-navy-900/65 sm:text-lg ${align === "center" ? "mx-auto" : ""}`}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
