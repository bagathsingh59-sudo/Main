export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_NAV = {
  Services: [
    { label: "Payroll Management", href: "/services#payroll" },
    { label: "EPF & ESI Compliance", href: "/services#epf-esi" },
    { label: "GST Advisory", href: "/services#gst" },
    { label: "Income Tax", href: "/services#income-tax" },
    { label: "Labour Law Compliance", href: "/services#labour-law" },
    { label: "CFO Advisory", href: "/services#cfo" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Founder's Message", href: "/about#founder" },
    { label: "Our Journey", href: "/about#journey" },
    { label: "Team", href: "/about#team" },
    { label: "Awards", href: "/about#awards" },
    { label: "Trust & Security", href: "/about#trust" },
  ],
  Resources: [
    { label: "Compliance Calculator", href: "/services#calculator" },
    { label: "Blogs & Insights", href: "/insights" },
    { label: "Latest Updates", href: "/insights#updates" },
    { label: "Case Studies", href: "/industries#case-studies" },
    { label: "FAQs", href: "/insights#faq" },
    { label: "Help Centre", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Data Security", href: "/about#trust" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
} as const;
