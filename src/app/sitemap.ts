import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/jsonLd";

/**
 * Sitemap consumed by Google Search Console + other crawlers.
 * Served at /sitemap.xml automatically by Next.js.
 *
 * Priority + changeFrequency are guidance for Google — not commitments. We
 * keep the marketing pages weekly/monthly and the legal pages yearly because
 * those genuinely change on those cadences.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const make = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    // ── Marketing core ──
    make("/", 1.0, "weekly"),
    make("/services", 0.9, "monthly"),
    make("/industries", 0.85, "monthly"),
    make("/about", 0.8, "monthly"),
    make("/insights", 0.75, "weekly"),
    make("/contact", 0.9, "monthly"),

    // ── Legal ──
    make("/privacy", 0.3, "yearly"),
    make("/terms", 0.3, "yearly"),
    make("/cookies", 0.3, "yearly"),
    make("/disclaimer", 0.3, "yearly"),
  ];
}
