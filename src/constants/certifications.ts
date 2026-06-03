import type { Certification, Award, Partner } from "@/types";

export const CERTIFICATIONS: Certification[] = [
  { id: "icai", name: "ICAI Registered Firm", code: "010742S", body: "Institute of Chartered Accountants of India" },
  { id: "iso27001", name: "ISO 27001:2022", code: "IS 745120", body: "Information Security Management" },
  { id: "iso9001", name: "ISO 9001:2015", code: "QMS 482910", body: "Quality Management System" },
  { id: "msme", name: "MSME Registered", code: "UDYAM-KR-03-0021947", body: "Ministry of MSME" },
  { id: "gstn", name: "GST Suvidha Provider", code: "GSP-AS18", body: "Goods & Services Tax Network" },
  { id: "icsi", name: "ICSI Affiliate Firm", code: "P201930KA01200", body: "Institute of Company Secretaries of India" },
];

export const AWARDS: Award[] = [
  {
    id: "a1",
    year: "2024",
    title: "Compliance Firm of the Year — South India",
    issuer: "India CA Excellence Awards",
  },
  { id: "a2", year: "2024", title: "Top 50 Tax Consulting Firms in India", issuer: "Business Today" },
  { id: "a3", year: "2023", title: "Best Workplace in Professional Services", issuer: "Great Place To Work" },
  { id: "a4", year: "2023", title: "GST Excellence Award", issuer: "PHD Chamber of Commerce" },
  { id: "a5", year: "2022", title: "Emerging Consulting Brand", issuer: "Economic Times Iconic Awards" },
  { id: "a6", year: "2021", title: "Innovation in RegTech", issuer: "CII India RegTech Summit" },
];

export const PARTNERS: Partner[] = [
  { id: "zoho", name: "Zoho" },
  { id: "tally", name: "Tally Solutions" },
  { id: "razorpay", name: "Razorpay" },
  { id: "keka", name: "Keka HR" },
  { id: "greythr", name: "GreytHR" },
  { id: "darwinbox", name: "Darwinbox" },
  { id: "quickbooks", name: "QuickBooks" },
  { id: "sap", name: "SAP" },
  { id: "icai-body", name: "ICAI" },
  { id: "nasscom", name: "NASSCOM" },
  { id: "ficci", name: "FICCI" },
  { id: "cii", name: "CII" },
];
