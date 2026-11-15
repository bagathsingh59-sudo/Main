import type { SiteSettings } from "@/services/settings";
import { SERVICES } from "@/constants/services";
import { BLOG_FALLBACK_IMAGES, type BlogBlockPost } from "./legacy/BlogBlock";
import type { ContactBlockProps } from "./legacy/ContactBlock";
import type { FaqBlockItem } from "./legacy/FaqBlock";
import type { SvcPanelItem } from "./legacy/SvcPanels";
import type { TeamBlockMember } from "./legacy/TeamBlock";
import type { VpBlogPost } from "./legacy/VpBlog";

/**
 * Admin settings → props for the redesigned sections.
 * Each mapper returns `undefined` when the admin list is empty, so the
 * section falls back to its built-in placeholder content.
 */

const orUndefined = <T,>(list: T[]) => (list.length ? list : undefined);

/** Admin → Services (falls back to the bundled list). */
export function serviceRows(s: SiteSettings): SvcPanelItem[] {
  const items = s.services.items.length ? s.services.items : SERVICES;
  return items.map((it) => ({ title: it.title, summary: it.summary, href: `/contact?service=${encodeURIComponent(it.id)}` }));
}

/** Admin → FAQ (questions without an answer yet are skipped). */
export function faqItems(s: SiteSettings): FaqBlockItem[] | undefined {
  return orUndefined(s.faq.items.filter((i) => i.question.trim() && i.answer.trim()));
}

/** Admin → Team. */
export function teamMembers(s: SiteSettings): TeamBlockMember[] | undefined {
  return orUndefined(s.team.members);
}

/** Admin → Blog: published posts, newest first. */
export function blogPosts(s: SiteSettings, limit = 6): BlogBlockPost[] | undefined {
  const posts = s.blog.posts
    .filter((p) => !p.isDraft)
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
    .slice(0, limit)
    .map((p, i) => ({
      title: p.title,
      category: p.category,
      author: p.author,
      date: formatMonth(p.publishedAt),
      href: `/insights/${p.slug}`,
      image: p.coverImage || BLOG_FALLBACK_IMAGES[i % BLOG_FALLBACK_IMAGES.length],
    }));
  return orUndefined(posts);
}

/** Admin → Blog for the three-card article block (index-8 layout). */
export function articleCards(s: SiteSettings, fallbackImages: string[]): VpBlogPost[] | undefined {
  const posts = s.blog.posts
    .filter((p) => !p.isDraft)
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
    .slice(0, 3)
    .map((p, i) => ({
      title: p.title,
      category: p.category,
      excerpt: p.excerpt,
      author: p.author,
      date: formatMonth(p.publishedAt),
      href: `/insights/${p.slug}`,
      image: p.coverImage || fallbackImages[i % fallbackImages.length],
    }));
  return orUndefined(posts);
}

/** Admin → Form config + Maintenance. */
export function contactForm(s: SiteSettings): ContactBlockProps {
  return {
    services: s.formConfig.services,
    sizes: s.formConfig.sizes,
    disabledMessage: s.maintenance.formsDisabled ? s.maintenance.message || "Enquiries are paused for a short while." : undefined,
  };
}

/** Admin → Footer → social links. */
export function linkedinUrl(s: SiteSettings): string | undefined {
  return s.navigation.socialLinks.find((l) => l.platform === "linkedin" && l.url.trim())?.url;
}

function formatMonth(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}
