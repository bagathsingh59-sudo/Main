import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/jsonLd";

/**
 * Sitemap consumed by Google Search Console + other crawlers.
 * Served at /sitemap.xml automatically by Next.js.
 *
 * The site is five pages (Home, About, Services, VaishnaviPay, Contact)
 * plus the legal pages, which are yearly and low priority.
 */
export default function sitemap(): MetadataRoute.Sitemap {
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

  return [
    // ── The five pages ──
    make("/", 1.0, "weekly"),
    make("/services", 0.9, "monthly"),
    make("/vaishnavi-pay", 0.9, "monthly"),
    make("/about", 0.8, "monthly"),
    make("/contact", 0.9, "monthly"),

    // ── Legal ──
    make("/privacy", 0.3, "yearly"),
    make("/terms", 0.3, "yearly"),
    make("/cookies", 0.3, "yearly"),
    make("/disclaimer", 0.3, "yearly"),
  ];
}
