"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, viewportOnce } from "@/animations/variants";

const SEVERITY: Record<"low" | "medium" | "high", string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  high: "bg-rose-50 text-rose-700 border-rose-100",
};

interface UpdateRow {
  id: string;
  slug?: string;
  date: string;
  tag: string;
  title: string;
  summary: string;
  severity: "low" | "medium" | "high";
  isDraft?: boolean;
}

interface UpdatesProps {
  /** Admin-managed published updates. Empty = section auto-hides. */
  items?: readonly UpdateRow[];
}

export function Updates({ items }: UpdatesProps = {}) {
  const list = (items ?? []).filter((u) => !u.isDraft);
  if (list.length === 0) return null;

  return (
    <SectionLayout id="updates" className="bg-mist">
      <SectionHeader
        eyebrow="Latest compliance updates"
        title={
          <>
            Regulatory shifts, <em className="not-italic text-navy-600">curated weekly.</em>
          </>
        }
        description="Our compliance desk monitors central and state portals every day. Here is what crossed our desk recently."
      />

      <div className="mt-12 overflow-hidden rounded-3xl border border-white/70 bg-white/65 shadow-soft backdrop-blur-xl">
        <ul className="divide-y divide-navy-900/[0.06]">
          {list.map((u, i) => {
            const href = u.slug ? `/insights/updates/${u.slug}` : "#";
            return (
              <motion.li
                key={u.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                custom={i}
                className="group flex flex-col gap-3 p-6 transition-colors hover:bg-cloud/60 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="w-28 flex-shrink-0">
                  <div className="text-[0.78rem] font-semibold text-navy-900/55">{u.date}</div>
                  <span className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[0.7rem] font-bold ${SEVERITY[u.severity]}`}>
                    {u.tag}
                  </span>
                </div>
                <div className="flex-1">
                  <Link href={href} className="text-[0.98rem] font-bold text-navy-900 hover:text-navy-600">
                    {u.title}
                  </Link>
                  <p className="mt-1 text-[0.86rem] leading-[1.7] text-navy-900/60">{u.summary}</p>
                </div>
                <div className="self-start sm:self-center">
                  <Link href={href} className="text-[0.82rem] font-semibold text-navy-600 hover:underline">
                    Read briefing →
                  </Link>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </SectionLayout>
  );
}
