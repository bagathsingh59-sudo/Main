import Link from "next/link";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BlogPost } from "@/services/settings";

/**
 * Card grid of published blog posts shown on /insights.
 * Renders nothing when there are no posts (admin hasn't published any
 * yet) so the existing Resources section keeps its slot for the
 * empty-state case.
 */
export function BlogPostList({ posts }: { posts: readonly BlogPost[] }) {
  if (posts.length === 0) return null;

  const sorted = posts
    .slice()
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));

  return (
    <SectionLayout id="blog" className="bg-mist">
      <SectionHeader
        eyebrow="Briefings"
        title={
          <>
            Latest from the <em className="not-italic text-navy-600">compliance desk.</em>
          </>
        }
        description="Long-form pieces written by senior partners — published as we research, not on a calendar."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {sorted.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/65 shadow-soft backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <Link href={`/insights/${post.slug}`} className="flex h-full flex-col">
              {post.coverImage && (
                <div className="aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {post.category && (
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-teal-700">
                    {post.category}
                  </div>
                )}
                <h3 className="mt-2 font-display text-[1.25rem] font-bold leading-snug text-navy-900">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-3 line-clamp-3 text-[0.9rem] leading-[1.65] text-navy-900/65">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-auto pt-5 text-[0.78rem] text-navy-900/55">
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </SectionLayout>
  );
}
