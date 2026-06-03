import type { Metric, ProcessStep, WhyReason } from "@/types";

export const HERO_STATS: Metric[] = [
  { value: "850+", label: "Clients Protected" },
  { value: "₹0", label: "Penalty Rate" },
  { value: "15+", label: "Years of Practice" },
  { value: "18", label: "Indian Cities" },
];

export const CLIENT_METRICS: Metric[] = [
  { value: "₹4,200Cr+", label: "Tax savings delivered" },
  { value: "99.8%", label: "On-time filing rate" },
  { value: "42,000+", label: "Filings completed" },
  { value: "120+", label: "Senior professionals" },
  { value: "0", label: "Penalty incidents in 4 yrs" },
  { value: "4.9/5", label: "Avg. client rating" },
];

export const WHY_REASONS: WhyReason[] = [
  {
    id: "w1",
    icon: "ShieldCheck",
    title: "Zero-Penalty Guarantee",
    description: "If a filing penalty occurs due to our oversight, we cover it. 0 incidents in the last 4 years.",
  },
  {
    id: "w2",
    icon: "Users",
    title: "Dedicated Compliance Manager",
    description: "Every client gets a named CA backed by a 4-eye review system. Not a ticket queue.",
  },
  {
    id: "w3",
    icon: "Activity",
    title: "Real-time Compliance Dashboard",
    description: "Live status of every filing, every deadline, every entity — visible to your CXO team 24/7.",
  },
  {
    id: "w4",
    icon: "Lock",
    title: "Bank-grade Data Security",
    description: "ISO 27001:2022 certified. AES-256 encryption at rest, TLS 1.3 in transit, full audit trail.",
  },
  {
    id: "w5",
    icon: "Globe",
    title: "Pan-India Coverage",
    description: "28 states. 8 UTs. Single point of accountability, regardless of where your business operates.",
  },
  {
    id: "w6",
    icon: "Clock",
    title: "24-hour Response SLA",
    description: "Every query — small or strategic — gets a substantive response within one working day. Guaranteed.",
  },
];

export const PROCESS: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery Audit",
    description: "Complete compliance health-check of your current state, gaps, and risk exposure.",
    duration: "Week 1",
  },
  {
    step: 2,
    title: "Strategy Design",
    description: "Custom compliance roadmap aligned to your industry, growth stage, and CFO priorities.",
    duration: "Week 1–2",
  },
  {
    step: 3,
    title: "System Onboarding",
    description: "Configure workflows, integrations, dashboards. Migrate from existing vendor cleanly.",
    duration: "Week 2",
  },
  {
    step: 4,
    title: "Ongoing Filing",
    description: "Timely filing of every return with tracker alerts and zero-penalty guarantees.",
    duration: "Monthly",
  },
  {
    step: 5,
    title: "Quarterly Review",
    description: "QBR with strategic tax-savings opportunities and next-quarter compliance roadmap.",
    duration: "Quarterly",
  },
];
