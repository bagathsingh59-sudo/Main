import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { PageHero } from "@/components/shared/PageHero";
import { SectionDots } from "@/components/shared/SectionDots";
import { ImageBanner } from "@/components/shared/ImageBanner";
import { Updates } from "@/sections/Updates";
import { FAQ } from "@/sections/FAQ";
import { CTABanner } from "@/sections/CTABanner";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { getSiteSettings } from "@/services/settings";
import { FAQS } from "@/constants/faq";
import { BlogPostList } from "@/components/blog/BlogPostList";

const PAGE_TITLE = "Insights — Compliance Briefings, Updates & FAQs";
const PAGE_DESC =
  "Curated regulatory updates, in-depth compliance briefings, and answers to the questions CFOs ask first.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("insights", "/insights");
}

const DOTS = [
  { id: "updates", label: "Updates" },
  { id: "faq", label: "FAQ" },
];

export default async function InsightsPage() {
  // Admin-edited FAQs override the bundled defaults. Only items with
  // both a question AND an answer are published; drafts are skipped
  // (they'd otherwise pollute the JSON-LD and the visible FAQ list).
  const settings = await getSiteSettings();
  const adminFaqs = settings.faq.items.filter(
    (f) => f.question.trim().length >= 5 && f.answer.trim().length >= 10,
  );
  const faqs =
    adminFaqs.length > 0
      ? adminFaqs.map((f, i) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }))
      : FAQS;

  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/insights", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
          ]),
          faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer }))),
        ]}
      />
      <SectionDots dots={DOTS} />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        eyebrow="Resources"
        title={
          <>
            Compliance, <em className="not-italic text-navy-600">demystified.</em>
          </>
        }
        description="Briefings written by our partners and senior associates — for finance teams, by finance teams."
        image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1800&q=80&auto=format&fit=crop"
        imageAlt="Reading a compliance briefing"
      />

      <BlogPostList posts={settings.blog.posts.filter((p) => !p.isDraft)} />

      <ImageBanner
        src="https://images.unsplash.com/photo-1554224155-1696413565d3?w=1800&q=80&auto=format&fit=crop"
        alt="Compliance briefings and regulatory guidance"
        eyebrow="Speak with a partner"
        title={<>23 portals. <em className="not-italic">One trusted desk.</em></>}
        description="Our compliance desk monitors central and state portals every day. When something changes that affects your business, we tell you what to do — and we do it for you."
        height="sm"
        overlay="brand"
        align="center"
      />

      <Updates items={settings.updates.items} />
      <FAQ items={faqs} />

      <CTABanner
        eyebrow="Talk to our compliance desk"
        title={<>A 45-minute audit. <em className="not-italic">Zero obligation.</em></>}
        description="Pick a time that suits you. We'll review your last six filings, surface the two or three priority fixes, and tell you exactly what they'll cost you if left unaddressed."
        cta={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Browse services", href: "/services" }}
        variant="dark"
        className="bg-mist"
      />
    </MainLayout>
  );
}
