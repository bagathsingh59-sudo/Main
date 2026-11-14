/**
 * Copy and images for the VaishnaviPay product page.
 *
 * Feature descriptions follow the VaishnaviPay User Manual (edition of
 * 26 Oct 2026). Screenshots are cropped from that manual and still carry
 * its red numbered markers — replace with clean captures.
 *
 * Plan prices and inclusions mirror the owner console (see VP_PRICING).
 */
import type { AboutIntroProps } from "@/components/orisa/sections/AboutIntro";
import type { ComparisonTableProps } from "@/components/orisa/sections/ComparisonTable";
import type { CtaPanelProps } from "@/components/orisa/sections/CtaPanel";
import type { DistinctionListProps } from "@/components/orisa/sections/DistinctionList";
import type { ExpertiseListProps } from "@/components/orisa/sections/ExpertiseList";
import type { FaqListProps } from "@/components/orisa/sections/FaqList";
import type { PricingPlansProps } from "@/components/orisa/sections/PricingPlans";
import type { ProcessTimelineProps } from "@/components/orisa/sections/ProcessTimeline";
import type { ProjectListProps } from "@/components/orisa/sections/ProjectList";

const SHOT = "/vaishnavi-pay";
const ICON = "/orisa/home-13";
const DEMO = "/contact?topic=vaishnavipay-demo";

export const VP_HERO = {
  tagline: "VaishnaviPay · Payroll & Compliance Software",
  since: "Built by practitioners",
  headline: ["The software our own team", "runs every filing on."] as [string, string],
  copy: "Payroll, statutory reports, client logins and digitally signed documents in one place — for a single company, a CA firm or a large consultancy.",
  cta: { label: "Request a demo", href: DEMO },
  image: { src: `${SHOT}/dashboard.webp`, alt: "VaishnaviPay dashboard for a wage month" },
  label: "Runs in your browser · nothing to install",
  tags: [
    { label: "Payroll", href: "#modules" },
    { label: "32 reports", href: "#modules" },
    { label: "Client logins", href: "#modules" },
    { label: "Signed documents", href: "#why" },
    { label: "Pricing", href: "#pricing" },
  ],
};

export const VP_ABOUT: AboutIntroProps = {
  label: "WHAT IT IS",
  intro: "One place to run payroll, file on time and *prove* every document you issue.",
  avatars: [],
  cta: { label: "See pricing", href: "#pricing" },
  pill: "Free demo available",
  title: "Enroll. Process. File. Share. A whole wage month, from new joiners to the client's statement, without a spreadsheet.",
  images: [`${SHOT}/payroll.webp`, `${SHOT}/payslip.webp`],
  caption: {
    title: "Made for the monthly cycle",
    text: "Add joiners and leavers, process the month, download the PF ECR, ESI return and PT statement, record challan dates, print registers and pay slips, then send each client their statement and fee invoice.",
  },
  stats: [
    { icon: `${ICON}/sec-2-shape-1.webp`, tag: "▲ Statutory", count: 32, caption: "Reports and registers, from PF ECR to Form XVI." },
    { icon: `${ICON}/sec-2-shape-2.webp`, tag: "▲ Ready to use", count: 16, caption: "HR letters and certificates on your letterhead." },
    { icon: `${ICON}/sec-2-shape-3.webp`, tag: "▲ Roles", count: 3, caption: "Kinds of login: admin, staff and client." },
    { icon: `${ICON}/sec-2-shape-4.webp`, tag: "▲ Every file", count: 100, suffix: "%", caption: "Of documents digitally signed and verifiable." },
  ],
};

export const VP_MODULES: ProjectListProps = {
  label: "MODULES",
  title: "Everything a compliance desk does,",
  titleAccent: "on one screen after another.",
  cta: { label: "Request a demo", href: DEMO },
  linkLabel: "REQUEST A DEMO",
  items: [
    {
      kicker: "CHAPTER 03  —  PAYROLL",
      title: "Payroll processing",
      image: `${SHOT}/payroll.webp`,
      href: DEMO,
      description: "Pick the establishment and wage month, enter or upload each employee's inputs, check the payroll summary and finalize. Every uploaded sheet is kept, version by version.",
      specs: [
        { term: "FOR", value: "Admin & staff" },
        { term: "INPUT", value: "On screen or Excel" },
        { term: "OUTPUT", value: "Finalized wage month" },
      ],
    },
    {
      kicker: "CHAPTER 04  —  REPORTS",
      title: "Statutory reports & registers",
      image: `${SHOT}/ecr.webp`,
      href: DEMO,
      description: "PF ECR, ESIC monthly contribution, PT statement, Forms A, B, C, D, XIV, XV and XVI, EPF Forms 3A, 5, 6A, 9, 10 and 12A, bonus, gratuity, LWF and paid leave — as signed PDF or portal-ready files.",
      specs: [
        { term: "REPORTS", value: "32" },
        { term: "FORMATS", value: "PDF · Excel · .txt" },
        { term: "PORTALS", value: "EPFO & ESIC ready" },
      ],
    },
    {
      kicker: "CHAPTER 05  —  MIS",
      title: "Filing matrix & fee invoices",
      image: `${SHOT}/matrix.webp`,
      href: DEMO,
      description: "See which months are filed or pending for every establishment, work out EPF interest and damages for a late payment, and bill each client with a signed invoice that carries your UPI QR code.",
      specs: [
        { term: "VIEWS", value: "Filing matrix · 360° search" },
        { term: "CALCULATOR", value: "EPF 7Q & 14B" },
        { term: "BILLING", value: "Fee invoices" },
      ],
    },
    {
      kicker: "CHAPTER 10  —  CLIENTS",
      title: "Client logins",
      image: `${SHOT}/dashboard.webp`,
      href: DEMO,
      description: "Give each company its own login: their dashboard, the reports in their service package, your invoices with bank and UPI details, and a way to send you documents. They can look, not change.",
      specs: [
        { term: "FOR", value: "HR or accounts person" },
        { term: "ACCESS", value: "Own establishments only" },
        { term: "SECURITY", value: "Two-factor sign-in" },
      ],
    },
  ],
};

export const VP_MONTH: ProcessTimelineProps = {
  label: "A TYPICAL MONTH",
  title: "Five steps from new joiners to the client's statement.",
  description: "The same routine every wage month, with the dashboard showing how far each establishment has got and what is overdue.",
  metrics: [
    { value: "05", label: "STEPS" },
    { value: "01", label: "SCREEN FLOW" },
  ],
  deliverablesLabel: "WHERE",
  phases: [
    { when: "Step 1", title: "Enroll", text: "Add new joiners and record leavers for each establishment.", deliverables: ["Masters", "Enroll Employees"] },
    { when: "Step 2", title: "Process", text: "Process the month, check the payroll summary and finalize it.", deliverables: ["Payroll", "New Payroll"] },
    { when: "Step 3", title: "File", text: "Download the PF ECR, ESI return and PT statement and file them on the government portals.", deliverables: ["Reports", "Payroll Process"] },
    { when: "Step 4", title: "Record & print", text: "Enter the challan payment dates, then print the registers and pay slips.", deliverables: ["Reports", "Monthly Govt."] },
    { when: "Step 5", title: "Share & bill", text: "Send each client their monthly statement and fee invoice.", deliverables: ["MIS", "Fee Invoices"] },
  ],
};

export const VP_ADDONS: ExpertiseListProps = {
  title: "Add-ons & apps",
  hint: "Switch on only what your firm uses — nothing is deleted when you switch one off.",
  items: [
    { image: `${SHOT}/invoice.webp`, title: "HR documents", tag: "ADD-ON", text: "Sixteen ready letters in five groups — joining, during employment, certificates, discipline and leaving — numbered and on the establishment's letterhead." },
    { image: `${SHOT}/payslip.webp`, title: "Hiring", tag: "ADD-ON", text: "Offer letters, joining forms and a CTC calculator for new hires." },
    { image: `${SHOT}/matrix.webp`, title: "Client Desk", tag: "ADD-ON", text: "Quotations for new clients, documents received from clients, and a register of licences and notices." },
    { image: `${SHOT}/calendar.webp`, title: "Chat, email, calendar & files", tag: "APPS", text: "Talk to your team and clients, send reports by email, follow the compliance calendar and keep files in one place." },
    { image: `${SHOT}/verify.webp`, title: "Verify a document", tag: "TRUST", text: "Check any VaishnaviPay document by its code or QR to confirm it is genuine and unchanged, and build an evidence pack for an auditor." },
  ],
};

export const VP_COMPARE: ComparisonTableProps = {
  label: "TWO WAYS TO WORK WITH US",
  title: "Hand it to us, or run it yourself.",
  description: "The managed service and the software use the same screens and the same reports. Choose by who does the work.",
  columns: [
    { name: "Managed service", tagline: "We do it for you", cta: { label: "Book consultation", href: "/contact" } },
    { name: "VaishnaviPay", tagline: "You do it, on our software", cta: { label: "Request a demo", href: DEMO }, highlight: true },
    { name: "Both", tagline: "Software + our review", cta: { label: "Talk to us", href: "/contact" } },
  ],
  rows: [
    { feature: "Who processes payroll", values: ["Our consultants", "Your team", "Your team"] },
    { feature: "Who files on the portals", values: ["Our consultants", "Your team", "Shared"] },
    { feature: "Statutory reports & registers", values: [true, true, true] },
    { feature: "Client / company login", values: [true, "Professional & above", true] },
    { feature: "Digitally signed documents", values: [true, true, true] },
    { feature: "Bill your own clients from it", values: [false, true, true] },
    { feature: "Named compliance manager", values: [true, false, true] },
    { feature: "Best for", values: ["Companies without a payroll desk", "Companies, CA firms & consultants", "Growing in-house teams"] },
  ],
};

/* Plans, prices, limits and inclusions as set in the VaishnaviPay owner
   console (Plans & prices) on 14 Nov 2026. Starter's storage allowance
   was not visible in that capture, so it is not listed. */
export const VP_PRICING: PricingPlansProps = {
  eyebrow: "PRICING",
  title: "Three plans. Monthly or yearly.",
  yearlyHint: "2 months free",
  note: "Prices in Indian rupees; taxes extra where applicable. A new firm can start with a free demo.",
  plans: [
    {
      name: "Starter",
      monthly: "₹1,000",
      yearly: "₹10,000",
      description: "For a single company running its own payroll.",
      cta: { label: "Start free demo", href: DEMO },
      limits: ["3 establishments", "150 employees", "3 team logins"],
      features: ["Full-auto monthly payroll", "PF, ESI, PT & LWF compliance", "Form A / B / C / D registers & payslips", "EPF ECR & ESIC return files", "Email support (48 h)"],
      excluded: ["Client self-service logins", "Bulk multi-month reports", "REST API"],
    },
    {
      name: "Professional",
      monthly: "₹2,500",
      yearly: "₹25,000",
      description: "For CA firms & payroll consultants.",
      cta: { label: "Choose Professional", href: DEMO },
      popular: true,
      limits: ["25 establishments", "2,500 employees", "15 team logins", "2 GB file storage"],
      features: ["Everything in Starter", "Client self-service logins", "Bulk Form B + D & multi-month reimbursement", "Annual returns — bonus, gratuity, LWF, 3A/6A", "Filing matrix & Daily MIS", "Priority support (8 h)"],
      excluded: ["REST API", "Dedicated account manager"],
    },
    {
      name: "Enterprise",
      monthly: "₹6,000",
      yearly: "₹60,000",
      description: "For large consultancies & multi-branch groups.",
      cta: { label: "Talk to us", href: DEMO },
      limits: ["Unlimited establishments", "Unlimited employees", "Unlimited team logins", "10 GB file storage"],
      features: ["Everything in Professional", "Unlimited establishments & employees", "REST API", "Chat, email & shared calendar for your team", "Audit log & data residency options", "Dedicated account manager"],
    },
  ],
  custom: {
    title: "Need more room without changing plan?",
    description: "Add-on packs buy extra establishments, employees, logins or storage and renew with your plan.",
    cta: { label: "ASK ABOUT ADD-ON PACKS", href: DEMO },
  },
};

export const VP_WHY: DistinctionListProps = {
  tag: { label: "WHY VAISHNAVIPAY", href: "/about" },
  title: "Built inside a working compliance practice.",
  cta: { label: "Request a demo", href: DEMO },
  items: [
    { name: "Used on our own clients", image: `${SHOT}/dashboard.webp`, href: DEMO, lede: "Every screen exists because our consultants needed it for a real wage month. It is the software Vaishnavi Consultant runs its own practice on." },
    { name: "Every document is sealed", image: `${SHOT}/verify.webp`, href: DEMO, lede: "Each PDF, Excel export and backup carries a document code and QR. Anyone can check later that a copy is genuine and unchanged." },
    { name: "Nothing overdue slips by", image: `${SHOT}/matrix.webp`, href: DEMO, lede: "The dashboard and filing matrix show finalized, pending and overdue months for every establishment, with the next filing due." },
    { name: "Portal-ready files", image: `${SHOT}/ecr.webp`, href: DEMO, lede: "ECR and ESI files download exactly as the EPFO and ESIC portals expect, so they upload as before." },
    { name: "Your data stays yours", image: `${SHOT}/invoice.webp`, href: DEMO, lede: "Role-based logins, two-factor sign-in, signed exports and a backup you download and keep yourself." },
  ],
};

export const VP_FAQ: FaqListProps = {
  label: "QUESTIONS",
  title: "Before you ask for a demo.",
  description: "Can't find it here? Write to us and a consultant will reply within one working day.",
  items: [
    { question: "Who is VaishnaviPay for?", answer: "A single company running its own payroll (Starter), CA firms and payroll consultants (Professional), and large consultancies or multi-branch groups (Enterprise). On Professional and above, each client company gets its own login to see reports and pay invoices." },
    { question: "Do I need to install anything?", answer: "No. Everything happens in your web browser on a computer, tablet or phone. A computer with a large screen is best for payroll and reports." },
    { question: "What can a client login see and do?", answer: "Only their own establishments: the reports in their service package, your invoices and payments, and the add-ons you allow. They can look at everything but cannot change payroll, employees or salaries." },
    { question: "What does “digitally signed” mean?", answer: "When a document is issued, VaishnaviPay seals its fingerprint and records it in a register that can be added to but never changed. The seal proves who issued the document and that it hasn't changed; the figures remain your responsibility." },
    { question: "Can I try it before paying?", answer: "Yes. A new firm can start with a free demo. Buying any plan ends the demo and keeps everything you entered. In a demo, printouts are stamped DEMO and documents aren't digitally signed." },
    { question: "How do I pay for a plan?", answer: "Online by UPI, card, net banking or wallet, or by bank transfer or UPI with a reference. Choosing yearly billing saves up to two months, and an upgrade during a paid period gets credit for the unused days." },
    { question: "What happens to my data if my plan ends?", answer: "Everything except your profile, billing, help and support is paused until you renew; no data is lost. You can also download a signed backup of your firm's data at any time and keep it yourself." },
  ],
};

export const VP_CTA = (email: string): CtaPanelProps => ({
  bar: { left: "FREE DEMO  —  NO CARD NEEDED", center: "PAYROLL · REPORTS · CLIENT LOGINS", right: "VAISHNAVIPAY" },
  tag: "SEE IT WITH YOUR OWN DATA",
  title: ["Run it", "your", "way."],
  lede: ["Tell us how many establishments and employees you handle.", "We set up a demo and walk you through one full wage month."],
  chips: [
    { label: "Request a demo", href: DEMO },
    { label: "See pricing", href: "#pricing" },
    { label: "Prefer we do it? Managed service", href: "/services" },
  ],
  contact: { label: "CONTACT", text: email, href: `mailto:${email}` },
});
