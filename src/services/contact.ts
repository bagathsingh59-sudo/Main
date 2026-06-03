import { z } from "zod";
import { request } from "./api";
import type { ContactPayload } from "@/types";

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  email: z.string().email("Enter a valid business email"),
  phone: z
    .string()
    .regex(/^[+\d\s-]{7,16}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  companySize: z.enum(["1-10", "11-50", "51-250", "250+"]),
  service: z.string().min(1, "Select a service"),
  message: z.string().min(8, "Message should be at least 8 characters").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export async function submitContact(payload: ContactPayload) {
  return request<{ ok: true; id: string }>("/api/contact", {
    method: "POST",
    body: payload,
  });
}
