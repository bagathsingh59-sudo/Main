/**
 * Fallback settings — used when Edge Config isn't configured yet OR
 * when no settings have been saved by an admin yet. Mirrors what was
 * previously hard-coded in `src/constants/` and the API routes.
 */

import { COMPANY } from "@/constants/company";
import { CURRENT_VERSION, type SiteSettings } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  version: CURRENT_VERSION,

  automation: {
    autoReplyMode: "immediate",
    notificationTo: "",
    fromName: "",
    fromAddress: "",
  },

  rateLimit: {
    perIpMax: 5,
    perIpWindowMinutes: 10,
    globalMax: 30,
    globalWindowSeconds: 60,
  },

  contactInfo: {
    phone: COMPANY.contact.phone,
    altPhone: COMPANY.contact.altPhone,
    email: COMPANY.contact.email,
    supportEmail: COMPANY.contact.supportEmail,
    addressLine1: COMPANY.contact.address.line1,
    addressLine2: COMPANY.contact.address.line2,
    city: COMPANY.contact.address.city,
    state: COMPANY.contact.address.state,
    pin: COMPANY.contact.address.pin,
    hours: COMPANY.contact.hours,
  },

  formConfig: {
    services: [
      "Payroll & Statutory Compliance",
      "EPF & ESI Compliance",
      "GST Compliance",
      "Income Tax Advisory",
      "Labour Law Compliance",
      "Virtual CFO Advisory",
      "Audit & Assurance",
      "Full Compliance Suite",
    ],
    sizes: ["1-10", "11-50", "51-250", "250+"],
  },

  banner: {
    enabled: false,
    message: "",
    linkUrl: "",
    linkLabel: "",
    tone: "info",
  },

  maintenance: {
    formsDisabled: false,
    message:
      "Our contact forms are briefly offline for maintenance. Please email connect@vaishnaviconsultant.com or call +91 97422 22976 in the meantime.",
  },
};
