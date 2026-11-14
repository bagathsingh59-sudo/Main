/**
 * Copy and images for the redesigned home page (Orisa index-13 layout).
 *
 * PLACEHOLDER CONTENT — figures and service text come from the previous
 * site; images, team faces and testimonials are the template's samples.
 * Everything here is meant to be replaced once the design is approved
 * (and later moved into the admin).
 */
import type { AboutIntroProps } from "@/components/orisa/sections/AboutIntro";
import type { CtaPanelProps } from "@/components/orisa/sections/CtaPanel";
import type { DistinctionListProps } from "@/components/orisa/sections/DistinctionList";
import type { ExpertiseListProps } from "@/components/orisa/sections/ExpertiseList";
import type { GalleryWallProps } from "@/components/orisa/sections/GalleryWall";
import type { ProcessTimelineProps } from "@/components/orisa/sections/ProcessTimeline";
import type { ProjectListProps } from "@/components/orisa/sections/ProjectList";
import type { TestimonialSliderProps } from "@/components/orisa/sections/TestimonialSlider";

const IMG = "/orisa/home-13";

export const HOME_ABOUT: AboutIntroProps = {
  label: "ABOUT US",
  intro: "We keep growing businesses *compliant*, one accurate filing at a time.",
  avatars: [1, 2, 3, 4, 5].map((n) => `${IMG}/sec-2-avatar-${n}.webp`),
  cta: { label: "Meet Our Team", href: "/about#team" },
  pill: "Accepting new clients",
  title: "Accurate. Timely. Accountable. We turn statutory obligations into a predictable routine.",
  images: [`${IMG}/sec-2-img-1.webp`, `${IMG}/sec-2-img-2.webp`],
  caption: {
    title: "Compliance Expertise",
    text: "With 25+ years of combined practice across Payroll, EPF, ESIC, GST and labour law, we give every client a named consultant, a four-eye review on each filing and a reply within one working day.",
  },
  stats: [
    { icon: `${IMG}/sec-2-shape-1.webp`, tag: "▲ Since 2018", count: 250, suffix: "+", caption: "Businesses served across three cities." },
    { icon: `${IMG}/sec-2-shape-2.webp`, tag: "▲ On time", count: 99, suffix: "%", caption: "Filings submitted before the due date." },
    { icon: `${IMG}/sec-2-shape-3.webp`, tag: "▲ And counting", count: 12000, suffix: "+", caption: "Statutory filings completed." },
    { icon: `${IMG}/sec-2-shape-4.webp`, tag: "▲ Combined", count: 25, suffix: "+", caption: "Years of practitioner experience." },
  ],
};

export const HOME_SERVICES: ProjectListProps = {
  label: "OUR SERVICES",
  title: "Every filing your business owes,",
  titleAccent: "under one accountable roof.",
  cta: { label: "View all services", href: "/services" },
  items: [
    {
      kicker: "MONTHLY  —  PAYROLL",
      title: "Payroll Management",
      image: `${IMG}/sec-3-img-1.webp`,
      href: "/services#payroll",
      description: "End-to-end payroll, salary structuring, payslips and Form 16 generation for your entire workforce.",
      specs: [
        { term: "CATEGORY", value: "Payroll" },
        { term: "FREQUENCY", value: "Monthly" },
        { term: "INCLUDES", value: "Payslips & Form 16" },
      ],
    },
    {
      kicker: "MONTHLY  —  STATUTORY",
      title: "EPF & ESI Compliance",
      image: `${IMG}/sec-3-img-2.webp`,
      href: "/services#epf-esi",
      description: "PF ECR, ESI returns, KYC seeding, UAN linking and inspection support — owned end to end.",
      specs: [
        { term: "CATEGORY", value: "Statutory" },
        { term: "FREQUENCY", value: "Monthly" },
        { term: "INCLUDES", value: "ECR & ESI returns" },
      ],
    },
    {
      kicker: "MONTHLY / ANNUAL  —  TAX",
      title: "GST Compliance",
      image: `${IMG}/sec-3-img-3.webp`,
      href: "/services#gst",
      description: "GSTR-1, 3B, 9 and 9C filings with reconciliation, input-credit optimisation and refund handling.",
      specs: [
        { term: "CATEGORY", value: "Indirect tax" },
        { term: "FREQUENCY", value: "Monthly & annual" },
        { term: "INCLUDES", value: "Reconciliation" },
      ],
    },
    {
      kicker: "ONGOING  —  LABOUR LAW",
      title: "Labour Law Compliance",
      image: `${IMG}/sec-3-img-4.webp`,
      href: "/services#labour-law",
      description: "Shops & Establishments, PT, LWF, contract labour, bonus and gratuity — registrations, returns and renewals.",
      specs: [
        { term: "CATEGORY", value: "Labour law" },
        { term: "FREQUENCY", value: "Ongoing" },
        { term: "INCLUDES", value: "Registers & renewals" },
      ],
    },
  ],
};

export const HOME_CTA = (email: string): CtaPanelProps => ({
  bar: { left: "ACCEPTING NEW CLIENTS  —  FY 2026-27", center: "17°19′N · 76°50′E", right: "FREE 45-MIN AUDIT" },
  tag: "START YOUR COMPLIANCE AUDIT",
  title: ["Comply", "with", "us."],
  lede: [
    "Tell us about your team, your registrations, your deadlines.",
    "A senior consultant replies within one working day — no chatbots, no forms in disguise.",
  ],
  chips: [
    { label: "Book a consultation", href: "/contact#book" },
    { label: "Talk to a consultant", href: "/contact" },
    { label: "Try VaishnaviPay", href: "/vaishnavi-pay" },
  ],
  contact: { label: "CONTACT", text: email, href: `mailto:${email}` },
});

export const HOME_EXPERTISE: ExpertiseListProps = {
  title: "Our Expertise",
  hint: "Deep practice in the filings that carry penalties when they slip.",
  items: [
    { image: `${IMG}/sec-5-img-1.webp`, title: "Income Tax Advisory", tag: "DIRECT_TAX", text: "Corporate returns, TDS, advance tax and tax planning for SMEs and corporates." },
    { image: `${IMG}/sec-5-img-2.webp`, title: "Virtual CFO Advisory", tag: "FINANCE_ON_TAP", text: "Monthly MIS, board packs, cash-flow modelling and fund-raise readiness." },
    { image: `${IMG}/sec-5-img-3.webp`, title: "Audit & Assurance", tag: "ASSURANCE", text: "Statutory, internal, tax and due-diligence audits aligned with current standards." },
    { image: `${IMG}/sec-5-img-4.webp`, title: "ROC & Secretarial", tag: "COMPANY_LAW", text: "MCA annual filings, board resolutions, DIN and DSC management, secretarial audits." },
    { image: `${IMG}/sec-5-img-5.webp`, title: "VaishnaviPay Software", tag: "DO_IT_YOURSELF", text: "The payroll and compliance software our own team runs every filing on — now open to your business." },
  ],
};

export const HOME_PROCESS: ProcessTimelineProps = {
  label: "OUR PROCESS",
  title: "How we take over your compliance, from audit to autopilot.",
  description:
    "A disciplined five-step method that turns scattered filings into a predictable monthly routine. Careful where it matters, quick where it counts.",
  metrics: [
    { value: "7-14d", label: "ONBOARDING" },
    { value: "05", label: "STEPS" },
  ],
  phases: [
    { when: "Week 1", title: "Discovery Audit", text: "A complete health-check of your current filings, gaps and risk exposure.", deliverables: ["Health report", "Gap list", "Risk score"] },
    { when: "Week 1-2", title: "Strategy Design", text: "A compliance roadmap matched to your industry, size and priorities.", deliverables: ["Roadmap", "Calendar", "Fee plan"] },
    { when: "Week 2", title: "Onboarding", text: "Workflows, registers and logins set up; a clean hand-over from your previous vendor.", deliverables: ["Data migration", "Client login", "Registers"] },
    { when: "Monthly", title: "Ongoing Filing", text: "Every return filed on time, with reminders before each due date.", deliverables: ["Challans", "Returns", "Payslips"] },
    { when: "Quarterly", title: "Review", text: "A quarterly review of filings, savings opportunities and the next quarter's plan.", deliverables: ["MIS report", "Savings note", "Next plan"] },
  ],
};

export const HOME_TESTIMONIALS: TestimonialSliderProps = {
  label: "TESTIMONIAL",
  title: "Proven results from the businesses we look after",
  lede: "Sample testimonials — to be replaced with real client quotes before launch.",
  items: [
    {
      image: `${IMG}/sec-7-client-1.webp`,
      quote: "Sample quote. They took over our payroll and PF filings mid-year without a single missed deadline, and we finally have one person to call.",
      name: "Client name",
      context: "Manufacturing · Kalaburagi",
    },
    {
      image: `${IMG}/sec-7-client-2.webp`,
      quote: "Sample quote. Notices that used to take us weeks are now answered in days. The monthly statement tells us exactly where every filing stands.",
      name: "Client name two",
      context: "Education · Bidar",
    },
    {
      image: `${IMG}/sec-7-client-3.webp`,
      quote: "Sample quote. Multi-state PF, ESI and PT for a distributed team used to be our biggest headache. It has been quiet for two years now.",
      name: "Client name three",
      context: "IT services · Hyderabad",
    },
  ],
};

export const HOME_DISTINCTION: DistinctionListProps = {
  tag: { label: "THE VAISHNAVI DISTINCTION", href: "/about" },
  title: "Setting the benchmark for dependable compliance.",
  cta: { label: "Get a free audit", href: "/contact" },
  items: [
    { name: "Zero-Penalty Record", image: `${IMG}/sec-8-building-1.webp`, href: "/services", lede: "If a filing penalty occurs because of our oversight, we cover it. The track record speaks for itself." },
    { name: "Dedicated Compliance Manager", image: `${IMG}/sec-8-building-2.webp`, href: "/services", lede: "Every client gets a named consultant backed by a four-eye review — not a ticket queue." },
    { name: "Real-time Filing Status", image: `${IMG}/sec-8-building-3.webp`, href: "/vaishnavi-pay", lede: "See the status of every filing, deadline and entity whenever you want, from your own login." },
    { name: "Data Kept Secure", image: `${IMG}/sec-8-building-4.webp`, href: "/about#trust", lede: "Payroll and tax data handled with role-based access, encryption and a record of every change." },
    { name: "One-Day Response", image: `${IMG}/sec-8-building-5.webp`, href: "/contact", lede: "Every query, small or strategic, gets a proper answer within one working day." },
  ],
};

export const HOME_GALLERY: GalleryWallProps = {
  columns: [
    [1, 2, 3].map((n) => `${IMG}/home-13_sec_9_${n}.webp`),
    [4, 5, 6].map((n) => `${IMG}/home-13_sec_9_${n}.webp`),
    [7, 8, 9].map((n) => `${IMG}/home-13_sec_9_${n}.webp`),
  ],
};
