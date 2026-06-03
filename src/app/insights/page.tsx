import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { PageHero } from "@/components/shared/PageHero";
import { SectionDots } from "@/components/shared/SectionDots";
import { ImageBanner } from "@/components/shared/ImageBanner";
import { Resources } from "@/sections/Resources";
import { Updates } from "@/sections/Updates";
import { FAQ } from "@/sections/FAQ";
import { CTABanner } from "@/sections/CTABanner";

export const metadata: Metadata = {
  title: "Insights — Compliance Briefings, Updates & FAQs",
  description:
    "Curated regulatory updates, in-depth compliance briefings, and answers to the questions CFOs ask first.",
};

const DOTS = [
  { id: "resources", label: "Briefings" },
  { id: "updates", label: "Updates" },
  { id: "faq", label: "FAQ" },
];

export default function InsightsPage() {
  return (
    <MainLayout>
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

      <Resources />

      <ImageBanner
        src="https://images.unsplash.com/photo-1554224155-1696413565d3?w=1800&q=80&auto=format&fit=crop"
        alt="Compliance updates and regulatory alerts"
        eyebrow="Weekly desk digest"
        title={<>23 portals. <em className="not-italic">One Monday email.</em></>}
        description="Our compliance desk monitors central and state portals every day. The five updates that actually matter to you, summarised every Monday."
        height="sm"
        overlay="brand"
        align="center"
      />

      <Updates />
      <FAQ />

      <CTABanner
        eyebrow="Subscribe"
        title={<>Get the Monday digest. <em className="not-italic">Free, always.</em></>}
        description="No marketing. No content marketing. Just the regulatory updates that affect your tax, payroll, and compliance posture."
        cta={{ label: "Subscribe to digest", href: "/contact" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
        variant="dark"
        className="bg-mist"
      />
    </MainLayout>
  );
}
