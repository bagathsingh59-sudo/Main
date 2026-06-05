import Link from "next/link";

const SHORTCUTS = [
  {
    href: "/admin/seo",
    title: "SEO",
    blurb: "Per-page titles, meta descriptions, keywords, OG images.",
    icon: "🔍",
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30",
  },
  {
    href: "/admin/branding",
    title: "Branding",
    blurb: "Upload logo, favicon, and Open Graph image.",
    icon: "✷",
    gradient: "from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30",
  },
  {
    href: "/admin/navbar",
    title: "Navbar",
    blurb: "Edit primary nav links — order, visibility, labels.",
    icon: "≡",
    gradient: "from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30",
  },
  {
    href: "/admin/footer",
    title: "Footer",
    blurb: "Columns, tagline, copyright, social URLs.",
    icon: "▭",
    gradient: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700",
  },
  {
    href: "/admin/automation",
    title: "Automation",
    blurb: "Auto-reply mode, notification routing, rate limits.",
    icon: "✦",
    gradient: "from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30",
  },
  {
    href: "/admin/email-templates",
    title: "Email templates",
    blurb: "Edit subject lines, badge text, body copy for emails.",
    icon: "✉",
    gradient: "from-violet-50 to-indigo-50 dark:from-violet-900/30 dark:to-indigo-900/30",
  },
  {
    href: "/admin/contact-info",
    title: "Contact info",
    blurb: "Phone, email, address, working hours.",
    icon: "☎",
    gradient: "from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30",
  },
  {
    href: "/admin/form-config",
    title: "Form options",
    blurb: "Services and company-size dropdowns.",
    icon: "▤",
    gradient: "from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30",
  },
  {
    href: "/admin/banner",
    title: "Site banner",
    blurb: "Sitewide announcement strip.",
    icon: "▥",
    gradient: "from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30",
  },
  {
    href: "/admin/maintenance",
    title: "Maintenance",
    blurb: "Emergency switch to disable forms.",
    icon: "⚠",
    gradient: "from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-600 dark:text-slate-400">
          Runtime settings for the marketing site. Changes save to Vercel Edge Config and propagate globally
          within a few seconds.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lg hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-navy-700 dark:hover:shadow-black/40"
          >
            <div className="flex items-start gap-4">
              <span
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-lg text-navy-700 dark:text-slate-100`}
              >
                {s.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-[1rem] font-semibold text-slate-900 dark:text-slate-100">{s.title}</h2>
                  <span className="text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-500">→</span>
                </div>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-slate-600 dark:text-slate-400">{s.blurb}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-[0.85rem] leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <strong className="block text-slate-900 dark:text-slate-100">Heads-up</strong>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            This page is{" "}
            <code className="rounded bg-slate-200 px-1 py-0.5 text-[0.78rem] dark:bg-slate-800">noindex,nofollow</code>{" "}
            — search engines won&apos;t list it.
          </li>
          <li>
            The URL is not linked from the public site. Bookmark{" "}
            <code className="rounded bg-slate-200 px-1 py-0.5 text-[0.78rem] dark:bg-slate-800">/admin/login</code>.
          </li>
          <li>Sign out when finished — sessions last 30 days otherwise.</li>
        </ul>
      </div>
    </div>
  );
}
