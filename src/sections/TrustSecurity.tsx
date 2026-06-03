"use client";

import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { fadeUp, viewportOnce } from "@/animations/variants";
import type { IconName } from "@/types";

const PILLARS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "Lock",
    title: "AES-256 at rest, TLS 1.3 in transit",
    desc: "All client data is encrypted with bank-grade algorithms across our application, database, and backups.",
  },
  {
    icon: "ShieldCheck",
    title: "ISO 27001:2022 certified",
    desc: "Audited information-security management system covering access control, vendor risk, and incident response.",
  },
  {
    icon: "Users",
    title: "Role-based access · MFA mandatory",
    desc: "Every consultant logs in with hardware-key MFA. Client data is partitioned by engagement and least-privilege.",
  },
  {
    icon: "Globe",
    title: "Data resident in India",
    desc: "All primary and disaster-recovery storage is hosted in Indian AWS regions (Mumbai · Hyderabad).",
  },
  {
    icon: "Activity",
    title: "Continuous monitoring",
    desc: "24×7 SIEM, anomaly detection on financial data exports, and a documented incident-response playbook.",
  },
  {
    icon: "ClipboardCheck",
    title: "Audit trail on every change",
    desc: "Every filing draft, edit, and approval is logged immutably. Clients can pull a full activity export at any time.",
  },
];

export function TrustSecurity() {
  return (
    <SectionLayout id="trust" className="bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white" tone="dark">
      <div aria-hidden="true" className="absolute inset-0 -z-0 opacity-20 bg-grid-light [background-size:48px_48px]" />
      <div className="relative">
        <SectionHeader
          tone="dark"
          eyebrow="Trust & security"
          title={
            <>
              Built like the <em className="not-italic text-teal-400">banks we audit.</em>
            </>
          }
          description="Your payroll, salary, and tax data carries enormous regulatory weight. We treat its security as a board-level mandate."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              custom={i}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-colors hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-teal-300">
                <Icon name={p.icon} size={20} />
              </div>
              <h4 className="text-[1.02rem] font-bold text-white">{p.title}</h4>
              <p className="mt-2 text-[0.9rem] leading-[1.7] text-navy-100/65">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
