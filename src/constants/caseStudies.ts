import type { CaseStudy } from "@/types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "techsurge",
    client: "TechSurge",
    industry: "SaaS · Series C",
    headline: "Saved ₹38L in GST penalties three days before deadline",
    challenge:
      "Year-end GSTR-9 reconciliation surfaced a ₹38L mismatch between books and GSTR-2A. Filing was 72 hours away.",
    solution:
      "Our forensic GST team ran a 36-hour war-room reconciliation, traced 1,140 invoices across 9 vendors, filed corrections, and submitted GSTR-9 with full ITC recovered.",
    outcomes: ["₹38L penalty avoided", "100% ITC recovered", "9 vendor disputes settled"],
    metric: "₹38L",
    metricLabel: "Saved",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=720&q=80&auto=format&fit=crop",
  },
  {
    id: "greenfab",
    client: "Greenfab Industries",
    industry: "Manufacturing · 420 employees",
    headline: "Scaled payroll across 9 states without a single compliance slip",
    challenge:
      "Headcount 8× growth in 18 months across 9 manufacturing units; contract-labour PF/ESI was unmanageable on spreadsheets.",
    solution:
      "Built a unified payroll engine on Vaishnavi Dashboard with state-wise statutory rules, contract-labour LOA tracking, and daily wage-board sync.",
    outcomes: ["9 states, 1 dashboard", "Zero PF/ESI penalties", "11-day vendor migration"],
    metric: "0",
    metricLabel: "Penalties",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=720&q=80&auto=format&fit=crop",
  },
  {
    id: "lumen",
    client: "Lumen Health",
    industry: "Healthtech · Series B",
    headline: "Closed a $14M Series B with CFO-grade diligence pack",
    challenge:
      "30-day timeline to close Series B; missing 3-year audited statements, transfer pricing study, and forward MIS for the term sheet.",
    solution:
      "Our Virtual CFO team rebuilt 3 years of statements, ran TP benchmarking, and delivered an investor-grade data room in 21 days.",
    outcomes: ["$14M raised", "21-day diligence", "Audit clean opinion"],
    metric: "$14M",
    metricLabel: "Raised",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=720&q=80&auto=format&fit=crop",
  },
];
