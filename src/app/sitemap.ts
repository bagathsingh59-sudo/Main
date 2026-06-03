import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/jsonLd";

/**
 * Sitemap consumed by Google Search Console + other crawlers.
 * Served at /sitemap.xml automatically by Next.js.
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
    make("/", 1.0, "weekly"),
    make("/services", 0.9, "monthly"),
    make("/industries", 0.85, "monthly"),
    make("/about", 0.8, "monthly"),
    make("/insights", 0.75, "weekly"),
    make("/contact", 0.9, "monthly"),
  ];
}
