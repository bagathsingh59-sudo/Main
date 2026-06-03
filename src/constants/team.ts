import type { TeamMember } from "@/types";

/**
 * NOTE — headshots are Unsplash CDN URLs (royalty-free, no attribution required
 * for use in commercial contexts under the Unsplash licence). Replace with real
 * partner photographs ahead of launch.
 */
export const TEAM: TeamMember[] = [
  {
    id: "founder",
    name: "CA Lakshmi Narayan",
    role: "Founder & Managing Partner",
    bio: "FCA with 24 years across Big-4 tax practice and enterprise compliance. Built Vaishnavi from a 3-person practice into India's most trusted compliance partner.",
    initials: "LN",
    accent: "from-navy-700 to-teal-600",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "partner-tax",
    name: "CA Sridhar Venkatesh",
    role: "Partner — Direct Tax & Audit",
    bio: "FCA, DISA, ex-Deloitte. Specialises in transfer pricing, M&A tax structuring, and statutory audits for listed entities.",
    initials: "SV",
    accent: "from-teal-600 to-navy-700",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "partner-gst",
    name: "CA Meera Krishnamurthy",
    role: "Partner — GST & Indirect Tax",
    bio: "LLB, FCA. Argued ITAT cases worth ₹400Cr+. Authored two reference texts on GST refund mechanisms.",
    initials: "MK",
    accent: "from-navy-600 to-teal-500",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "partner-payroll",
    name: "Rakesh Bhatia",
    role: "Partner — Payroll & Labour Law",
    bio: "20 years across Mercer & Aon. Designed payroll architectures for 50+ unicorns covering 100K+ employees.",
    initials: "RB",
    accent: "from-teal-700 to-navy-600",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "head-tech",
    name: "Aishwarya Rao",
    role: "Head of Compliance Technology",
    bio: "Built the Vaishnavi Dashboard from scratch. Ex-Stripe, ex-Razorpay. Bridges deep CA workflows with software-grade UX.",
    initials: "AR",
    accent: "from-navy-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=480&q=80&auto=format&fit=crop",
  },
  {
    id: "head-cfo",
    name: "Prasad Iyengar",
    role: "Head of Virtual CFO Practice",
    bio: "Ex-CFO of two NSE-listed companies. Leads our fractional CFO engagements across 60+ growth-stage clients.",
    initials: "PI",
    accent: "from-teal-500 to-navy-700",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=80&auto=format&fit=crop",
  },
];
