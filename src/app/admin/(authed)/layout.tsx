import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ADMIN_COOKIE, verifySession } from "@/services/adminAuth";
import { AdminShell } from "../_components/AdminShell";

export const metadata: Metadata = {
  title: "Admin · Vaishnavi Consultant",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminAuthedLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(ADMIN_COOKIE.name)?.value;
  const session = verifySession(token);
  if (!session.ok) {
    redirect(`/admin/login?reason=${session.reason}`);
  }
  return <AdminShell>{children}</AdminShell>;
}
