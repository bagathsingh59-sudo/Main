import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MainLayout } from "@/layouts/MainLayout";
import { JsonLd } from "@/components/shared/JsonLd";
import { articleSchema, breadcrumbSchema, SITE_URL } from "@/utils/jsonLd";
import { getSiteSettings, type BlogPost } from "@/services/settings";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";

interface Params {
  params: { slug: string };
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  const settings = await getSiteSettings();
  const post = settings.blog.posts.find((p) => p.slug === slug && !p.isDraft);
  return post ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  if (!post) return { title: "Not found · Vaishnavi Consultant" };
  const title = post.seo.title || post.title;
  const description = post.seo.description || post.excerpt;
  const ogImage = post.seo.ogImage || post.coverImage;
  const url = `${SITE_URL}/insights/${post.slug}`;
  return {
    title,
    description,
    keywords: post.seo.keywords.length > 0 ? post.seo.keywords : undefined,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const post = await fetchPost(params.slug);
  if (!post) notFound();

  const settings = await getSiteSettings();
  const related = settings.blog.posts
    .filter((p) => !p.isDraft && p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  const published = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <MainLayout>
      <JsonLd
        data={[
          articleSchema({
            title: post.seo.title || post.title,
            description: post.seo.description || post.excerpt,
            path: `/insights/${post.slug}`,
            datePublished: post.publishedAt,
            category: post.category,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: post.title, path: `/insights/${post.slug}` },
          ]),
        ]}
      />

      <article className="pt-[120px] pb-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-[0.82rem] text-navy-900/55">
            <Link href="/" className="hover:text-navy-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/insights" className="hover:text-navy-600">
              Insights
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy-900/75">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            {post.category && (
              <div className="mb-3 inline-block rounded-full bg-navy-50 px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-navy-700">
                {post.category}
              </div>
            )}
            <h1 className="font-display text-[2.4rem] font-bold leading-[1.15] tracking-tight text-navy-900 sm:text-[3rem]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-[1.05rem] leading-[1.65] text-navy-900/70">{post.excerpt}</p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.82rem] text-navy-900/55">
              <span className="font-medium text-navy-900/75">{post.author}</span>
              <span>·</span>
              <time dateTime={post.publishedAt}>{published}</time>
            </div>
          </header>

          {/* Cover image */}
          {post.coverImage && (
            <div className="mb-12 overflow-hidden rounded-3xl border border-white/70 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt="" className="aspect-[16/9] w-full object-cover" />
            </div>
          )}

          {/* Body */}
          <BlogArticleBody content={post.content} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2">
              <span className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-navy-900/50">Tags</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-navy-50 px-3 py-1 text-[0.78rem] font-medium text-navy-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-14 border-t border-navy-900/10 pt-7">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-navy-600 hover:text-navy-700"
            >
              ← All insights
            </Link>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <aside className="mt-14">
              <h2 className="mb-5 font-display text-[1.4rem] font-bold text-navy-900">Related reading</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-2xl border border-navy-900/10 bg-white/60 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                  >
                    <Link href={`/insights/${p.slug}`} className="block">
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-teal-600">
                        {p.category || "Insights"}
                      </div>
                      <h3 className="mt-1.5 font-display text-[1.1rem] font-semibold text-navy-900">{p.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.85rem] text-navy-900/65">{p.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>
    </MainLayout>
  );
}
