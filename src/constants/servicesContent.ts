/**
 * Managed-service pricing shown on the Services page.
 *
 * PLACEHOLDER — the three starting prices come from the previous site's
 * FAQ copy; the inclusions are indicative. Confirm before launch.
 */
import type { PricingPlansProps } from "@/components/orisa/sections/PricingPlans";

export const SERVICE_PRICING: PricingPlansProps = {
  eyebrow: "PRICING",
  title: "Modular pricing. Pick what you need.",
  note: "Indicative starting prices for design review — final quotes depend on headcount, states and registrations.",
  showBillingSwitch: false,
  plans: [
    {
      name: "Payroll",
      monthly: "₹49",
      yearly: "₹49",
      period: "/employee / month",
      description: "Monthly payroll run, payslips and Form 16 for your whole team.",
      cta: { label: "Get a quote", href: "/contact" },
      features: ["Automated salary runs", "Reimbursements & arrears", "Payslips for every employee", "Form 16 & 24Q"],
    },
    {
      name: "EPF & ESI",
      monthly: "₹15,000",
      yearly: "₹15,000",
      period: "/quarter",
      description: "PF and ESI filings, KYC and inspection support, owned end to end.",
      cta: { label: "Get a quote", href: "/contact" },
      popular: true,
      features: ["Monthly ECR upload", "ESI contributions & returns", "UAN / KYC handling", "Audit & inspection support"],
    },
    {
      name: "GST",
      monthly: "₹2,500",
      yearly: "₹2,500",
      period: "/month",
      description: "Monthly and annual GST returns with reconciliation.",
      cta: { label: "Get a quote", href: "/contact" },
      features: ["GSTR-1 & 3B", "Reconciliation", "GSTR-9 / 9C", "Notice response"],
    },
  ],
  custom: {
    title: "Rather do it yourself?",
    description: "VaishnaviPay is the software our own team uses — plans from ₹1,000 a month.",
    cta: { label: "SEE VAISHNAVIPAY", href: "/vaishnavi-pay" },
  },
};
