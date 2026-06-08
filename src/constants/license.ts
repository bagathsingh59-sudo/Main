/**
 * Government of Karnataka — Department of Labour
 * Registration Certificate of Establishment (Form 'C')
 *
 * Real, verifiable credential for M/s. Vaishnavi Consultant. The
 * registration number below can be checked against the Karnataka
 * Labour department's public records.
 *
 * Personal contact details from the scanned cert (founder's personal
 * mobile and Gmail) are deliberately NOT exposed here — the public
 * card displays the business contact channels instead.
 *
 * When the cert is renewed next, update `lastRenewedOn` and
 * `validUntil` and replace the redacted PDF at the path below.
 */
export const LICENSE = {
  // Government details
  issuer: "Government of Karnataka",
  department: "Department of Labour",
  authority: "Office of the Senior Labour Inspector, Gulbarga 1st Circle",
  formCode: "Form 'C'",
  formDescription: "Karnataka Shops & Commercial Establishments Act, 1961",

  // Registration details
  registrationNumber: "Gu1/1/CE/0028/2018",
  establishmentName: "M/s. Vaishnavi Consultant",
  employerName: "Bhagatsing S/O Kishansing Thakur",
  natureOfBusiness: "Tax Consultants Office",

  // Address — matches the registered business address on the site
  address: {
    line1: "Shop No 3-692, Goury Nilaya, Gazipur Road",
    line2: "Near Milan Chowk, Super Market",
    city: "Kalaburagi",
    state: "Karnataka",
    pin: "585103",
  },

  // Dates — update when renewed
  registeredOn: "14 Aug 2018",
  lastRenewedOn: "23 Mar 2023",
  validUntil: "31 Dec 2027",

  // Employee count at last renewal (per the certificate body)
  employees: { male: 6, female: 1 },

  // PDF served from public/legal/. Drop in the redacted version that
  // hides the personal mobile + Gmail before this URL goes live.
  pdfUrl: "/legal/vaishnavi-license.pdf",
  pdfFilename: "vaishnavi-consultant-govt-registration-2027.pdf",
} as const;

export type License = typeof LICENSE;
