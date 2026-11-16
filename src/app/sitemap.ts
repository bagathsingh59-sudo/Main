import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/jsonLd";
import { SERVICES } from "@/constants/services";
import { getSiteSettings } from "@/services/settings";

/**
 * Sitemap consumed by Google Search Console + other crawlers.
 * Served at /sitemap.xml automatically by Next.js.
 *
 * The site is five pages (Home, About, Services, VaishnaviPay, Contact)
 * plus one page per service and the legal pages (yearly, low priority).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const services = settings.services.items.length ? settings.services.items : SERVICES;
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

    // ── Service pages ──
    ...services.map((svc) => make(`/services/${encodeURIComponent(svc.id)}`, 0.8, "monthly")),

    // ── Legal ──
    make("/privacy", 0.3, "yearly"),
    make("/terms", 0.3, "yearly"),
    make("/cookies", 0.3, "yearly"),
    make("/disclaimer", 0.3, "yearly"),
  ];
}
