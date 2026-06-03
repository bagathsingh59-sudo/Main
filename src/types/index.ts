/* ──────────────────────────────────────────────
   Domain types — single source of truth
   ────────────────────────────────────────────── */

export type IconName =
  | "Wallet"
  | "ShieldCheck"
  | "Scale"
  | "Receipt"
  | "FileText"
  | "LineChart"
  | "ClipboardCheck"
  | "Building2"
  | "Users"
  | "Activity"
  | "Lock"
  | "Globe"
  | "Clock"
  | "Sparkles"
  | "Calculator"
  | "Award"
  | "BookOpen"
  | "Bell"
  | "Mail"
  | "Phone"
  | "MapPin";

export interface Service {
  id: string;
  icon: IconName;
  title: string;
  summary: string;
  points: readonly string[];
  accent: string;
}

export interface Industry {
  id: string;
  emoji: string;
  name: string;
  description: string;
  clients: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: 1 | 2 | 3 | 4 | 5;
  initials: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  accent: string;
  /** Optional headshot URL — falls back to gradient + initials when omitted. */
  image?: string;
}

export interface JourneyEvent {
  year: string;
  title: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  code: string;
  body: string;
}

export interface Award {
  id: string;
  year: string;
  title: string;
  issuer: string;
}

export interface Partner {
  id: string;
  name: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  headline: string;
  challenge: string;
  solution: string;
  outcomes: readonly string[];
  metric: string;
  metricLabel: string;
  /** Cover image URL for the card top. */
  image?: string;
}

export interface Resource {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
}

export interface RegulatoryUpdate {
  id: string;
  date: string;
  tag: string;
  title: string;
  summary: string;
  severity: "low" | "medium" | "high";
}

export interface Metric {
  value: string;
  label: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
}

export interface WhyReason {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  companySize: "1-10" | "11-50" | "51-250" | "250+";
  service: string;
  message: string;
}

export interface CalculatorInput {
  employees: number;
  state: string;
  industry: string;
  hasGst: boolean;
  hasPf: boolean;
  hasEsi: boolean;
}

export interface CalculatorOutput {
  monthlyCost: number;
  savedHours: number;
  riskScore: number;
  recommendedServices: string[];
}
