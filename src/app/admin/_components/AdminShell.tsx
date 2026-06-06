"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* Inline SVG icon set — colored backgrounds per section. */
const ICONS: Record<string, { bg: string; fg: string; path: React.ReactNode }> = {
  Dashboard: {
    bg: "bg-navy-100 dark:bg-navy-900/50",
    fg: "text-navy-700 dark:text-navy-300",
    path: <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" />,
  },
  SEO: {
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    fg: "text-emerald-700 dark:text-emerald-300",
    path: <><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></>,
  },
  Branding: {
    bg: "bg-purple-100 dark:bg-purple-900/40",
    fg: "text-purple-700 dark:text-purple-300",
    path: <path d="M12 2 14.2 8.6 21 9.3l-5.2 4.5L17.3 21 12 17.3 6.7 21l1.5-7.2L3 9.3l6.8-.7z" />,
  },
  Navbar: {
    bg: "bg-sky-100 dark:bg-sky-900/40",
    fg: "text-sky-700 dark:text-sky-300",
    path: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  },
  Footer: {
    bg: "bg-slate-200 dark:bg-slate-700",
    fg: "text-slate-700 dark:text-slate-300",
    path: <><path d="M4 18h16" strokeWidth="2.5" /><path d="M4 13h10M4 8h7" /></>,
  },
  Automation: {
    bg: "bg-amber-100 dark:bg-amber-900/40",
    fg: "text-amber-700 dark:text-amber-300",
    path: <path d="m12 2 2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z" />,
  },
  "Email templates": {
    bg: "bg-violet-100 dark:bg-violet-900/40",
    fg: "text-violet-700 dark:text-violet-300",
    path: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  },
  FAQ: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/40",
    fg: "text-fuchsia-700 dark:text-fuchsia-300",
    path: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></>,
  },
  "Contact info": {
    bg: "bg-rose-100 dark:bg-rose-900/40",
    fg: "text-rose-700 dark:text-rose-300",
    path: <path d="M22 16.92V21a1 1 0 0 1-1.11 1A19.79 19.79 0 0 1 2 4.11 1 1 0 0 1 3 3h4.09a1 1 0 0 1 1 .75l1 4a1 1 0 0 1-.28 1L7.21 10.21a16 16 0 0 0 6.58 6.58l1.46-1.59a1 1 0 0 1 1-.28l4 1a1 1 0 0 1 .75 1z" />,
  },
  "Form options": {
    bg: "bg-indigo-100 dark:bg-indigo-900/40",
    fg: "text-indigo-700 dark:text-indigo-300",
    path: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6M9 13h6M9 17h3" /></>,
  },
  "Site banner": {
    bg: "bg-teal-100 dark:bg-teal-900/40",
    fg: "text-teal-700 dark:text-teal-300",
    path: <path d="M3 11 22 4l-3 16-7-3-3 5-3-7L3 11z" />,
  },
  Maintenance: {
    bg: "bg-red-100 dark:bg-red-900/40",
    fg: "text-red-700 dark:text-red-300",
    path: <><path d="m12 3 10 18H2z" /><path d="M12 9v5M12 18h.01" strokeWidth="2.5" /></>,
  },
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/branding", label: "Branding" },
  { href: "/admin/navbar", label: "Navbar" },
  { href: "/admin/footer", label: "Footer" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/automation", label: "Automation" },
  { href: "/admin/email-templates", label: "Email templates" },
  { href: "/admin/contact-info", label: "Contact info" },
  { href: "/admin/form-config", label: "Form options" },
  { href: "/admin/banner", label: "Site banner" },
  { href: "/admin/maintenance", label: "Maintenance" },
];

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <span
      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
        active ? "bg-white/20 text-white" : `${icon.bg} ${icon.fg}`
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        {icon.path}
      </svg>
    </span>
  );
}

/* ─── theme management ───────────────────────────────────── */

type Theme = "light" | "dark";
const THEME_KEY = "vc-admin-theme";

function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.adminTheme = t;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = readTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100"
      data-shell-root
    >
      {/* top bar */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-navy-600 to-teal-600 text-sm font-bold text-white shadow-sm">
              V
            </span>
            <div>
              <div className="text-[0.95rem] font-semibold leading-none text-slate-900 dark:text-slate-100">
                Admin
              </div>
              <div className="mt-0.5 text-[0.7rem] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Vaishnavi Consultant
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <Link
              href="/"
              target="_blank"
              className="hidden text-[0.82rem] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 sm:inline-block"
            >
              View site ↗
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* mobile nav */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-3">
          <div className="flex gap-2">
            {NAV.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium ${
                    active
                      ? "bg-navy-600 text-white"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
        <aside className="hidden w-56 flex-shrink-0 md:block">
          <nav className="sticky top-6 space-y-1">
            {NAV.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-[0.88rem] font-medium transition-colors ${
                    active
                      ? "bg-navy-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <NavIcon name={item.label} active={active} />
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
