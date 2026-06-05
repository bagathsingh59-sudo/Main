import { z } from "zod";
import { request } from "./api";

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(80),
  email: z.string().email("Enter a valid email"),
  companyRole: z.string().max(120).optional().or(z.literal("")),
  day: z.enum(["Mon", "Tue", "Wed", "Thu", "Fri"]),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Pick a slot"),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export async function submitBooking(payload: BookingInput) {
  return request<{ ok: true; id: string }>("/api/book-consultation", {
    method: "POST",
    body: payload,
  });
}
