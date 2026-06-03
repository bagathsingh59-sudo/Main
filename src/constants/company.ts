export const COMPANY = {
  name: "Vaishnavi Consultants",
  shortName: "Vaishnavi",
  legalName: "Vaishnavi Consultants LLP",
  tagline: "Compliance with Confidence.",
  description:
    "A Tax & Compliance consulting firm helping Indian businesses stay 100% compliant across EPF, ESI, Payroll, Labour Law, GST, and Statutory Filings — without the operational drag.",
  foundedYear: 2009,
  registration: {
    icai: "ICAI Reg: 010742S",
    cin: "CIN: U74999KA2009LLP054217",
    iso: "ISO 27001:2022 Certified",
  },
  contact: {
    phone: "+91 80 4123 8800",
    altPhone: "+91 98450 21121",
    email: "connect@vaishnaviconsultant.com",
    supportEmail: "support@vaishnaviconsultant.com",
    address: {
      line1: "12th Floor, Prestige Trade Tower",
      line2: "Palace Road, Vasanth Nagar",
      city: "Bengaluru",
      state: "Karnataka",
      pin: "560052",
      country: "India",
    },
    branches: ["Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune"],
    hours: "Mon – Sat · 9:30 AM – 7:00 PM IST",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/vaishnavi-consultants",
    twitter: "https://twitter.com/vaishnaviconsult",
    instagram: "https://instagram.com/vaishnaviconsultants",
    youtube: "https://youtube.com/@vaishnaviconsultants",
  },
  stats: {
    clients: "850+",
    cities: "18",
    yearsActive: "15+",
    penaltyRate: "0",
    employees: "120+",
    filings: "42K+",
  },
} as const;

export type Company = typeof COMPANY;
