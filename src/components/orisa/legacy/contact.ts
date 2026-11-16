import { COMPANY } from "@/constants/company";

/** Contact details shown in the page blocks (Admin → Contact info). */
export interface SiteContact {
  phone: string;
  altPhone: string;
  email: string;
  supportEmail: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pin: string;
  linkedin: string;
}

const a = COMPANY.contact.address;

export const DEFAULT_CONTACT: SiteContact = {
  phone: COMPANY.contact.phone,
  altPhone: COMPANY.contact.altPhone,
  email: COMPANY.contact.email,
  supportEmail: COMPANY.contact.supportEmail,
  addressLine1: a.line1,
  addressLine2: a.line2,
  city: a.city,
  state: a.state,
  pin: a.pin,
  linkedin: COMPANY.social.linkedin,
};

/** "+91 97422 22976" → "tel:+919742222976" */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
