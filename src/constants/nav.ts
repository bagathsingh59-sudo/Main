export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "VaishnaviPay", href: "/vaishnavi-pay" },
  { label: "Contact us", href: "/contact" },
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
    { label: "Our Journey", href: "/about#journey" },
    { label: "Team", href: "/about#team" },
    { label: "Contact Us", href: "/contact" },
  ],
  Resources: [
    { label: "VaishnaviPay", href: "/vaishnavi-pay" },
    { label: "VaishnaviPay Pricing", href: "/vaishnavi-pay#pricing" },
    { label: "FAQs", href: "/services#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
} as const;
