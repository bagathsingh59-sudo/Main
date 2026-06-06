import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MainLayout } from "@/layouts/MainLayout";
import { JsonLd } from "@/components/shared/JsonLd";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";
import { articleSchema, breadcrumbSchema, SITE_URL } from "@/utils/jsonLd";
import { getSiteSettings, type UpdateItem } from "@/services/settings";

interface Params {
  params: { slug: string };
}

const SEVERITY_PILL: Record<UpdateItem["severity"], string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
};

async function fetchUpdate(slug: string): Promise<UpdateItem | null> {
  const settings = await getSiteSettings();
  return settings.updates.items.find((u) => u.slug === slug && !u.isDraft) ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const u = await fetchUpdate(params.slug);
  if (!u) return { title: "Not found · Vaishnavi Consultant" };
  return {
    title: `${u.title} · Vaishnavi Consultant`,
    description: u.summary,
    alternates: { canonical: `/insights/updates/${u.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/insights/updates/${u.slug}`,
      title: u.title,
      description: u.summary,
      publishedTime: u.publishedAt,
      modifiedTime: u.updatedAt,
      tags: [u.tag],
    },
    twitter: { card: "summary_large_image", title: u.title, description: u.summary },
  };
}

export default async function UpdateDetailPage({ params }: Params) {
  const update = await fetchUpdate(params.slug);
  if (!update) notFound();

  return (
    <MainLayout>
      <JsonLd
        data={[
          articleSchema({
            title: update.title,
            description: update.summary,
            path: `/insights/updates/${update.slug}`,
            datePublished: update.publishedAt,
            category: update.tag,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: "Updates", path: "/insights#updates" },
            { name: update.title, path: `/insights/updates/${update.slug}` },
          ]),
        ]}
      />

      <article className="pt-[120px] pb-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <nav className="mb-6 text-[0.82rem] text-navy-900/55">
            <Link href="/" className="hover:text-navy-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/insights" className="hover:text-navy-600">Insights</Link>
            <span className="mx-2">/</span>
            <Link href="/insights#updates" className="hover:text-navy-600">Updates</Link>
          </nav>

          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-[0.78rem]">
              <span className="font-mono text-navy-900/60">{update.date}</span>
              <span className={`rounded-full border px-3 py-0.5 font-bold ${SEVERITY_PILL[update.severity]}`}>
                {update.tag}
              </span>
              <span className="font-semibold uppercase tracking-[0.12em] text-navy-900/50">
                {update.severity === "high" ? "High impact" : update.severity === "medium" ? "Medium impact" : "Low impact"}
              </span>
            </div>
            <h1 className="font-display text-[2.2rem] font-bold leading-[1.15] tracking-tight text-navy-900 sm:text-[2.8rem]">
              {update.title}
            </h1>
            {update.summary && (
              <p className="mt-5 text-[1.02rem] leading-[1.65] text-navy-900/70">{update.summary}</p>
            )}
          </header>

          <BlogArticleBody content={update.content || "*The full briefing will be published shortly.*"} />

          <div className="mt-14 border-t border-navy-900/10 pt-7">
            <Link
              href="/insights#updates"
              className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-navy-600 hover:text-navy-700"
            >
              ← All updates
            </Link>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
