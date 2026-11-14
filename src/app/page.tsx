import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { HomeHero } from "@/components/orisa/HomeHero";
import { AboutIntro } from "@/components/orisa/sections/AboutIntro";
import { ProjectList } from "@/components/orisa/sections/ProjectList";
import { CtaPanel } from "@/components/orisa/sections/CtaPanel";
import { ExpertiseList } from "@/components/orisa/sections/ExpertiseList";
import { ProcessTimeline } from "@/components/orisa/sections/ProcessTimeline";
import { TestimonialSlider } from "@/components/orisa/sections/TestimonialSlider";
import { DistinctionList } from "@/components/orisa/sections/DistinctionList";
import { GalleryWall } from "@/components/orisa/sections/GalleryWall";
import {
  HOME_ABOUT,
  HOME_CTA,
  HOME_DISTINCTION,
  HOME_EXPERTISE,
  HOME_GALLERY,
  HOME_PROCESS,
  HOME_SERVICES,
  HOME_TESTIMONIALS,
} from "@/constants/homeContent";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, serviceListSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { SERVICES } from "@/constants/services";
import { getSiteSettings } from "@/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("home", "/");
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const services = settings.services.items.length > 0 ? settings.services.items : SERVICES;
  return (
    <OrisaLayout>
      <JsonLd
        data={[
          webPageSchema({
            path: "/",
            title: "Vaishnavi Consultants — Tax & Compliance Consulting",
            description:
              "EPF, ESI, Payroll, GST, TDS and Labour Law compliance for Indian businesses. Zero-penalty track record across 850+ clients.",
          }),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          serviceListSchema(services.map((s) => ({ id: s.id, title: s.title, summary: s.summary }))),
        ]}
      />
      {/* Orisa index-14 heading + index-15 hero card */}
      <HomeHero
        tagline="Payroll · EPF · ESIC · GST"
        since="Since 2018"
        headline={["Payroll, EPF, ESIC & GST", "compliance, done right."]}
        headlineSwap={{
          lead: "Compliance for",
          words: ["Payroll", "EPF", "ESIC", "GST", "Labour Law"],
          tail: "done right.",
        }}
        copy="Payroll, EPF, ESIC, GST and labour-law filings, and the follow-ups in between — 250+ clients, 12,000+ filings."
        cta={{ label: "Book free consultation", href: "/contact" }}
        image={{ src: "/orisa/hero-placeholder.webp", alt: "" }}
        card={{
          label: "17.3297° N, 76.8343° E",
          email: settings.contactInfo.email,
          tags: [
            { label: "Payroll", href: "/services#payroll" },
            { label: "EPF & ESI", href: "/services#epf-esi" },
            { label: "GST", href: "/services#gst" },
            { label: "Labour Law", href: "/services#labour-law" },
            { label: "VaishnaviPay", href: "/vaishnavi-pay" },
          ],
          hours: settings.contactInfo.hours,
        }}
      />

      {/* Orisa index-13 sections 2–9 */}
      <AboutIntro {...HOME_ABOUT} />
      <ProjectList {...HOME_SERVICES} />
      <CtaPanel {...HOME_CTA(settings.contactInfo.email)} />
      <ExpertiseList {...HOME_EXPERTISE} />
      <ProcessTimeline {...HOME_PROCESS} />
      <TestimonialSlider {...HOME_TESTIMONIALS} />
      <DistinctionList {...HOME_DISTINCTION} />
      <GalleryWall {...HOME_GALLERY} />
    </OrisaLayout>
  );
}
