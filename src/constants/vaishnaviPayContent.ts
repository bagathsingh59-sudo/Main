/**
 * Copy and images for the VaishnaviPay product page.
 *
 * Feature descriptions follow the VaishnaviPay User Manual (edition of
 * 26 Oct 2026). Screenshots are cropped from that manual and still carry
 * its red numbered markers — replace with clean captures.
 *
 * Plan prices and inclusions mirror the owner console (see VP_PRICING).
 */
import type { ComparisonTableProps } from "@/components/orisa/sections/ComparisonTable";
import type { FaqListProps } from "@/components/orisa/sections/FaqList";
import type { PricingPlansProps } from "@/components/orisa/sections/PricingPlans";
import type { ProjectListProps } from "@/components/orisa/sections/ProjectList";
import type { VpAboutProps } from "@/components/orisa/legacy/VpAbout";
import type { VpBlogPost } from "@/components/orisa/legacy/VpBlog";
import type { VpCtaProps } from "@/components/orisa/legacy/VpCta";
import type { VpHeroProps } from "@/components/orisa/legacy/VpHero";
import type { VpModulesProps } from "@/components/orisa/legacy/VpModules";
import type { VpRailsProps } from "@/components/orisa/legacy/VpRails";
import type { VpReviewsProps } from "@/components/orisa/legacy/VpReviews";
import type { VpScreensProps } from "@/components/orisa/legacy/VpScreens";

const SHOT = "/vaishnavi-pay";
const DEMO = "/contact?topic=vaishnavipay-demo";



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

/* ── Index-8 layout ───────────────────────────────────────────── */

const TPL8 = "/orisa/tpl/pages/home-8";
const shot = (name: string, alt: string) => ({ src: `${SHOT}/${name}.webp`, alt });

export const VP8_HERO = (email: string): VpHeroProps => ({
  badge: { label: "Free demo", href: DEMO },
  headline: "PAYROLL, FILINGS & CLIENT LOGINS IN ONE PLACE",
  photos: [
    shot("dashboard", "VaishnaviPay dashboard for a wage month"),
    shot("payroll", "Payroll processing screen"),
    shot("ecr", "PF ECR report ready for the EPFO portal"),
    shot("payslip", "Digitally signed pay slip"),
    shot("matrix", "Filing matrix across establishments"),
    shot("verify", "Document verification by code or QR"),
  ],
  stats: [
    { value: 32, suffix: "", text: "Statutory reports and registers, from PF ECR to Form XVI." },
    { value: 100, suffix: "%", text: "Of issued documents digitally signed and verifiable." },
  ],
  wordmark: { left: "VAISHNAVI", right: "PAY", frame: `${SHOT}/dashboard.webp` },
  meta: { left: email, right: "Runs in your browser · nothing to install" },
});

export const VP8_MARQUEE = [
  "Payroll processing",
  "PF ECR",
  "ESIC returns",
  "Professional tax",
  "Pay slips",
  "Form XVI",
  "Statutory registers",
  "Bonus & gratuity",
  "Filing matrix",
  "Fee invoices",
  "Client logins",
  "Signed documents",
];

export const VP8_ABOUT: VpAboutProps = {
  title: "Turning the whole wage month into",
  accent: "one routine screen",
  lead: "Enroll joiners, process payroll, download portal-ready returns, print registers and pay slips, then send each client their statement and fee invoice — without a spreadsheet in between.",
  tags: ["Payroll", "32 statutory reports", "Client logins", "Signed documents"],
  images: [shot("payslip", "Pay slip generated by VaishnaviPay"), shot("payroll", "Payroll summary before finalizing")],
};

export const VP8_MODULES: VpModulesProps = {
  kicker: "Modules",
  since: "Built by Vaishnavi Consultant",
  caption: "Every screen exists because our own consultants needed it for a real wage month.",
  items: VP_MODULES.items.map((m) => ({ title: m.title, text: m.description.split(". ")[0] + ".", image: m.image, href: m.href })),
  cta: { label: "Request a demo", href: DEMO },
};

/** Who it is for — shown as words until there are client logos to use. */
export const VP8_AUDIENCE = [
  { label: "CA firms" },
  { label: "Payroll consultants" },
  { label: "Single companies" },
  { label: "Multi-branch groups" },
  { label: "Labour contractors" },
  { label: "Compliance consultancies" },
];

export const VP8_SCREENS: VpScreensProps = {
  kicker: "Inside VaishnaviPay",
  viewAll: { label: "Request a demo", href: DEMO },
  cards: [
    { title: "Pay slips", image: `${SHOT}/payslip.webp`, href: DEMO },
    { title: "Fee invoices", image: `${SHOT}/invoice.webp`, href: DEMO },
    { title: "Dashboard", image: `${SHOT}/dashboard.webp`, href: DEMO },
    { title: "PF ECR", image: `${SHOT}/ecr.webp`, href: DEMO },
    { title: "Filing matrix", image: `${SHOT}/matrix.webp`, href: DEMO },
    { title: "Compliance calendar", image: `${SHOT}/calendar.webp`, href: DEMO },
    { title: "Verify a document", image: `${SHOT}/verify.webp`, href: DEMO },
  ],
};

export const VP8_RAILS: VpRailsProps = {
  title: "One login for your whole compliance desk",
  cta: { label: "See pricing", href: "#pricing" },
  rows: [
    [`${SHOT}/dashboard.webp`, `${SHOT}/payroll.webp`, `${SHOT}/ecr.webp`, `${SHOT}/payslip.webp`],
    [`${SHOT}/matrix.webp`, `${SHOT}/invoice.webp`, `${SHOT}/calendar.webp`, `${SHOT}/verify.webp`],
  ],
};

/**
 * PLACEHOLDER testimonials — illustrative only, written for the layout.
 * Replace with real, approved quotes before this page goes live.
 */
export const VP8_REVIEWS: VpReviewsProps = {
  kicker: "What users say",
  trusted: "Used on our own clients every month",
  title: "Firms that run their month on VaishnaviPay",
  footnote: "Placeholder quotes — to be replaced with feedback from firms using VaishnaviPay.",
  items: [
    { name: "Payroll consultant", role: "Partner", company: "CA firm, Kalaburagi", avatar: `${TPL8}/sec8-avatar-1.webp`, quote: "The ECR and ESI files upload to the portals first time, and the filing matrix shows me which client is still pending." },
    { name: "HR manager", role: "HR & Accounts", company: "Manufacturing unit", avatar: `${TPL8}/sec8-avatar-2.webp`, quote: "I log in, see this month's registers and pay slips, and download what the inspector asks for in a minute." },
    { name: "Compliance lead", role: "Operations", company: "Multi-branch group", avatar: `${TPL8}/sec8-avatar-3.webp`, quote: "Every document carries a code and QR, so an auditor can check a copy is genuine without calling us." },
    { name: "Firm owner", role: "Founder", company: "Payroll bureau", avatar: `${TPL8}/sec8-avatar-4.webp`, quote: "Fee invoices with our UPI QR go out with the statement, and payments come in faster than before." },
  ],
};

export const VP8_CTA: VpCtaProps = {
  title: "Ready to run your next wage month on VaishnaviPay?",
  lead: "Tell us how many establishments and employees you handle. We set up a demo and walk you through one full month.",
  button: { label: "Request a free demo", href: DEMO },
  card: {
    kicker: "Talk to us",
    text: "Prefer we do it for you? Ask about our managed payroll and compliance service.",
    href: "/services",
    image: `${SHOT}/dashboard.webp`,
  },
};

/** Shown when Admin → Blog has no published posts yet. */
export const VP8_BLOG_FALLBACK: VpBlogPost[] = [
  { title: "Your monthly payroll compliance checklist", category: "Payroll", excerpt: "Every return, register and due date in one wage month, in the order we work through them.", author: "Vaishnavi desk", date: "", href: "/insights", image: `${TPL8}/sec-10-1.webp` },
  { title: "PF ECR errors that stop an upload — and how to avoid them", category: "EPF", excerpt: "", author: "Vaishnavi desk", date: "", href: "/insights", image: `${TPL8}/sec-10-2.webp` },
  { title: "Digitally signed pay slips: what they prove and what they don't", category: "Documents", excerpt: "", author: "Vaishnavi desk", date: "", href: "/insights", image: `${TPL8}/sec-10-3.webp` },
];

