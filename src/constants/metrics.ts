import type { Metric, ProcessStep, WhyReason } from "@/types";

export const HERO_STATS: Metric[] = [
  { value: "250+", label: "Clients served" },
  { value: "₹0", label: "Penalty rate" },
  { value: "25+", label: "Years of practice" },
  { value: "3", label: "Cities served" },
];

export const CLIENT_METRICS: Metric[] = [
  { value: "250+", label: "Active clients" },
  { value: "25+", label: "Years of practice" },
  { value: "12,000+", label: "Filings completed" },
  { value: "10+", label: "In-house professionals" },
  { value: "0", label: "Penalty incidents" },
  { value: "24h", label: "Query response SLA" },
];

export const WHY_REASONS: WhyReason[] = [
  {
    id: "w1",
    icon: "ShieldCheck",
    title: "Zero-Penalty Guarantee",
    description: "If a filing penalty occurs due to our oversight, we cover it. Track record speaks for itself.",
  },
  {
    id: "w2",
    icon: "Users",
    title: "Dedicated Compliance Manager",
    description: "Every client gets a named consultant backed by a four-eye review system. Not a ticket queue.",
  },
  {
    id: "w3",
    icon: "Activity",
    title: "Real-time Status Dashboard",
    description: "Live status of every filing, every deadline, every entity — visible to your CXO team 24/7.",
  },
  {
    id: "w4",
    icon: "Lock",
    title: "Bank-grade Data Security",
    description: "AES-256 encryption at rest, TLS 1.3 in transit, full audit trail on every change.",
  },
  {
    id: "w5",
    icon: "Globe",
    title: "Pan-India Coverage",
    description: "Headquartered in Kalaburagi, serving businesses across Karnataka, Telangana and beyond — single point of accountability.",
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
