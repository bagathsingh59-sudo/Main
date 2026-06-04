"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeUp, slideInLeft, slideInRight, viewportOnce } from "@/animations/variants";

export function AboutTeaser() {
  return (
    <SectionLayout id="about-teaser" className="bg-cloud">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <Badge tone="brand">About Vaishnavi</Badge>
          <h2 className="mt-5 font-display text-display-lg text-navy-900 text-balance">
            25 years of <em className="not-italic text-navy-600">trust.</em> Countless businesses served.
          </h2>
          <p className="mt-5 text-[1rem] leading-[1.85] text-navy-900/65">
            Delivering expert Payroll, EPF, ESIC, GST, TDS and Statutory Compliance services with the
            accuracy, consistency and professionalism that businesses depend on. Headquartered in
            Kalaburagi, serving clients across Karnataka, Telangana and pan-India.
          </p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={1}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { value: "250+", label: "Clients" },
              { value: "25+", label: "Yrs practice" },
              { value: "0", label: "Penalties" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/70 bg-white/65 px-4 py-4 text-center shadow-soft backdrop-blur-xl">
                <div className="bg-gradient-brand bg-clip-text text-xl font-extrabold text-transparent">{s.value}</div>
                <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-wide text-navy-900/55">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="mt-8">
            <Button href="/about" variant="primary">
              Read our story →
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-elevated"
        >
          <Image
            src="https://images.unsplash.com/photo-1604933762023-7213af7ff7a7?w=900&q=80&auto=format&fit=crop"
            alt="Vaishnavi compliance team"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/75 via-navy-900/10 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-white/[0.12] p-5 text-white backdrop-blur-xl">
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/75">From the founder</div>
            <p className="mt-2 font-display text-[1.05rem] leading-tight text-balance">
              "Compliance is not paperwork. It is the operating system of trust."
            </p>
            <div className="mt-3 text-[0.78rem] text-white/65">— CA Lakshmi Narayan, Founder</div>
            <Link href="/about#founder" className="mt-3 inline-flex text-[0.78rem] font-semibold text-teal-300 hover:underline">
              Read founder's note →
            </Link>
          </div>
        </motion.div>
      </div>
    </SectionLayout>
  );
}
