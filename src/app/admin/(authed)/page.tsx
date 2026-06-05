import Link from "next/link";

const SHORTCUTS = [
  {
    href: "/admin/automation",
    title: "Automation",
    blurb: "Auto-reply behaviour, notification routing, rate limits.",
    icon: "✦",
  },
  {
    href: "/admin/contact-info",
    title: "Contact info",
    blurb: "Phone, email, address, working hours.",
    icon: "☎",
  },
  {
    href: "/admin/form-config",
    title: "Form options",
    blurb: "Services and company-size choices in the contact form.",
    icon: "▤",
  },
  {
    href: "/admin/banner",
    title: "Site banner",
    blurb: "Sitewide announcement bar with optional link.",
    icon: "▥",
  },
  {
    href: "/admin/maintenance",
    title: "Maintenance",
    blurb: "Emergency switch to disable forms with a polite message.",
    icon: "⚠",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-600">
          Runtime settings for the marketing site. Changes save to Vercel Edge Config and propagate globally
          within a few seconds.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lg hover:shadow-slate-200/60"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-50 to-teal-50 text-lg text-navy-600">
                {s.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-[1rem] font-semibold text-slate-900">{s.title}</h2>
                  <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">→</span>
                </div>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-slate-600">{s.blurb}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-[0.85rem] leading-relaxed text-slate-600">
        <strong className="block text-slate-900">Heads-up</strong>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>This page is <code className="rounded bg-slate-200 px-1 py-0.5 text-[0.78rem]">noindex,nofollow</code> — search engines won&apos;t list it.</li>
          <li>The URL is not linked from the public site. Bookmark <code className="rounded bg-slate-200 px-1 py-0.5 text-[0.78rem]">/admin/login</code>.</li>
          <li>Sign out when finished — sessions last 30 days otherwise.</li>
        </ul>
      </div>
    </div>
  );
}
