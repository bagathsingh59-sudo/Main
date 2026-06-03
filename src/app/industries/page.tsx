import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { PageHero } from "@/components/shared/PageHero";
import { SectionDots } from "@/components/shared/SectionDots";
import { ImageBanner } from "@/components/shared/ImageBanner";
import { Industries } from "@/sections/Industries";
import { DashboardShowcase } from "@/sections/DashboardShowcase";
import { CaseStudies } from "@/sections/CaseStudies";
import { CTABanner } from "@/sections/CTABanner";

export const metadata: Metadata = {
  title: "Industries — SaaS, Manufacturing, Healthcare, E-Com & More",
  description:
    "Compliance expertise across the sectors we serve, with live case studies and the Vaishnavi Dashboard in action.",
};

const DOTS = [
  { id: "industries", label: "Industries" },
  { id: "dashboard", label: "Dashboard" },
  { id: "case-studies", label: "Case Studies" },
];

export default function IndustriesPage() {
  return (
    <MainLayout>
      <SectionDots dots={DOTS} />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        eyebrow="Sector expertise"
        title={
          <>
            Your industry has its own <em className="not-italic text-navy-600">rulebook.</em> We know it cold.
          </>
        }
        description="Eight sectors. Specialist teams in each. From SaaS ESOP compliance to factory-floor labour law, we already speak your language."
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1800&q=80&auto=format&fit=crop"
        imageAlt="Industries we serve"
      />

      <Industries />

      <ImageBanner
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=80&auto=format&fit=crop"
        alt="Manufacturing shop floor"
        eyebrow="Real engagements"
        title={
          <>
            Compliance, <em className="not-italic">in motion.</em>
          </>
        }
        description="Three engagements drawn from our active book. Numbers used with written permission."
        height="md"
        overlay="navy"
      />

      <DashboardShowcase />
      <CaseStudies />

      <CTABanner
        eyebrow="Your industry, our specialists"
        title={<>Tell us your sector. <em className="not-italic">We'll send a custom brief.</em></>}
        description="A 1-page brief tailored to your industry's specific compliance pressure points — delivered within 24 hours."
        cta={{ label: "Request industry brief", href: "/contact" }}
        secondary={{ label: "Read case studies", href: "#case-studies" }}
        variant="brand"
        className="bg-mist"
      />
    </MainLayout>
  );
}
