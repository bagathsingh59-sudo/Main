import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string; reason?: string };
}) {
  return <LoginForm next={searchParams.next ?? "/admin"} reason={searchParams.reason} />;
}
