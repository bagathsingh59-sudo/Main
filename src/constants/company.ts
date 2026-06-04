export const COMPANY = {
  name: "Vaishnavi Consultant",
  shortName: "Vaishnavi",
  legalName: "Vaishnavi Consultant",
  tagline: "Compliance with Confidence.",
  description:
    "Supporting businesses with accurate and professional Payroll, EPF, ESIC, GST and Labour Compliance services that help minimise risk, maintain accuracy, reduce administrative burden, and ensure complete compliance and operational peace of mind.",
  foundedYear: 2018,
  /**
   * Registrations marked TODO are pending — we ship the rest of the site and
   * surface "Registration in progress" rather than placeholder numbers.
   * Update these the moment the certificates are issued.
   */
  registration: {
    icai: null as string | null, // e.g. "ICAI Reg: XXXXXX" — pending
    cin: null as string | null, // e.g. "CIN: UXXXXXXXXX" — pending
    iso: null as string | null, // e.g. "ISO 27001:2022 Certified" — future
  },
  contact: {
    phone: "+91 97422 22976",
    altPhone: "+91 89514 70936",
    email: "connect@vaishnaviconsultant.com",
    supportEmail: "info@vaishnaviconsultant.com",
    address: {
      line1: "H. No. 3-692, Milan Chowk",
      line2: "Gazipur Road, Chakkar Katta, Supermarket",
      city: "Kalaburagi",
      state: "Karnataka",
      pin: "585101",
      country: "India",
    },
    /**
     * Markets the firm actively serves from the Kalaburagi office. Used for
     * local-SEO landing pages and the "X cities" stats.
     */
    branches: ["Kalaburagi"],
    serviceAreas: ["Kalaburagi (Gulbarga)", "Bidar", "Hyderabad"],
    hours: "Mon – Sat · 9:30 AM – 7:00 PM IST",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/vaishnavi-consultant",
    twitter: "https://twitter.com/vaishnaviconsult",
    instagram: "https://instagram.com/vaishnaviconsultant",
    youtube: "https://youtube.com/@vaishnaviconsultant",
  },
  stats: {
    clients: "250+",
    cities: "3",
    yearsActive: "25+", // Practitioner experience (combined team practice)
    firmAgeYears: "7+", // Firm registered in 2018
    penaltyRate: "0",
    employees: "10+",
    filings: "12K+",
  },
} as const;

export type Company = typeof COMPANY;
