"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/seo", label: "SEO", icon: "🔍" },
  { href: "/admin/branding", label: "Branding", icon: "✷" },
  { href: "/admin/navbar", label: "Navbar", icon: "≡" },
  { href: "/admin/footer", label: "Footer", icon: "▭" },
  { href: "/admin/automation", label: "Automation", icon: "✦" },
  { href: "/admin/contact-info", label: "Contact info", icon: "☎" },
  { href: "/admin/form-config", label: "Form options", icon: "▤" },
  { href: "/admin/banner", label: "Site banner", icon: "▥" },
  { href: "/admin/maintenance", label: "Maintenance", icon: "⚠" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* top bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-navy-600 to-teal-600 text-sm font-bold text-white">
              V
            </span>
            <div>
              <div className="text-[0.95rem] font-semibold leading-none text-slate-900">Admin</div>
              <div className="mt-0.5 text-[0.7rem] uppercase tracking-[0.15em] text-slate-500">
                Vaishnavi Consultant
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-[0.82rem] font-medium text-slate-600 hover:text-slate-900"
            >
              View site ↗
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* mobile nav — horizontal scroll, hidden on md+ */}
      <div className="border-b border-slate-200 bg-white md:hidden">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-3">
          <div className="flex gap-2">
            {NAV.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium ${
                    active ? "bg-navy-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 sm:py-8 md:gap-8 lg:gap-10">
        {/* side nav — md+ only */}
        <aside className="hidden w-52 flex-shrink-0 md:block">
          <nav className="space-y-1 sticky top-6">
            {NAV.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[0.88rem] font-medium transition-colors ${
                    active ? "bg-navy-600 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className={`flex w-5 justify-center text-[0.9rem] ${active ? "text-teal-300" : "text-slate-400"}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
