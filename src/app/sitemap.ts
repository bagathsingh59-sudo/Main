import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/jsonLd";
import { getSiteSettings } from "@/services/settings";

/**
 * Sitemap consumed by Google Search Console + other crawlers.
 * Served at /sitemap.xml automatically by Next.js.
 *
 * Marketing pages: priorities tuned to commercial intent. Legal pages:
 * yearly, low priority. Blog posts: pulled live from admin storage so
 * a newly-published post becomes crawlable within ~30 seconds (settings
 * cache TTL) — no rebuild needed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const make = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    lastModified: Date = now,
  ) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  const settings = await getSiteSettings();
  const publishedPosts = settings.blog.posts.filter((p) => !p.isDraft && p.slug);
  const publishedUpdates = settings.updates.items.filter((u) => !u.isDraft && u.slug);

  return [
    // ── Marketing core ──
    make("/", 1.0, "weekly"),
    make("/services", 0.9, "monthly"),
    make("/industries", 0.85, "monthly"),
    make("/about", 0.8, "monthly"),
    make("/insights", 0.75, "weekly"),
    make("/contact", 0.9, "monthly"),

    // ── Blog posts (long-form briefings) ──
    ...publishedPosts.map((p) =>
      make(`/insights/${p.slug}`, 0.7, "monthly", new Date(p.updatedAt || p.publishedAt)),
    ),

    // ── Compliance updates (regulatory news) — these refresh more
    //    frequently than long-form blog posts, so we signal weekly
    //    changeFrequency to encourage faster recrawls. ──
    ...publishedUpdates.map((u) =>
      make(`/insights/updates/${u.slug}`, 0.65, "weekly", new Date(u.updatedAt || u.publishedAt)),
    ),

    // ── Legal ──
    make("/privacy", 0.3, "yearly"),
    make("/terms", 0.3, "yearly"),
    make("/cookies", 0.3, "yearly"),
    make("/disclaimer", 0.3, "yearly"),
  ];
}
