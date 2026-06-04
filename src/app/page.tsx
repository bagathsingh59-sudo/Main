import { MainLayout } from "@/layouts/MainLayout";
import { Hero } from "@/sections/Hero";
import { ShieldStory } from "@/sections/ShieldStory";
import { AboutTeaser } from "@/sections/AboutTeaser";
import { ServicesPreview } from "@/sections/ServicesPreview";
import { TestimonialsCarousel } from "@/sections/TestimonialsCarousel";
import { ImageBanner } from "@/components/shared/ImageBanner";
import { CTABanner } from "@/sections/CTABanner";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, serviceListSchema, webPageSchema } from "@/utils/jsonLd";
import { SERVICES } from "@/constants/services";

export default function HomePage() {
  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({
            path: "/",
            title: "Vaishnavi Consultants — Tax & Compliance Consulting",
            description:
              "EPF, ESI, Payroll, GST, TDS and Labour Law compliance for Indian businesses. Zero-penalty track record across 850+ clients.",
          }),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          serviceListSchema(SERVICES.map((s) => ({ id: s.id, title: s.title, summary: s.summary }))),
        ]}
      />
      {/* Header section — untouched */}
      <Hero />

      {/* Scroll-driven 3D shield — untouched */}
      <ShieldStory />

      {/* Visual break #1 — service footprint banner */}
      <ImageBanner
        src="https://images.unsplash.com/photo-1577086664693-894d8405334a?w=1800&q=80&auto=format&fit=crop"
        alt="Compliance services across Karnataka, Telangana and beyond"
        eyebrow="Headquartered in Kalaburagi"
        title={
          <>
            Backed by <em className="not-italic">250+ businesses</em>,<br className="hidden sm:block" /> across
            3 cities.
          </>
        }
        description="From Kalaburagi (Gulbarga) and Bidar to Hyderabad — one accountable team for every filing your business needs."
        stats={[
          { value: "250+", label: "Clients" },
          { value: "3", label: "Cities served" },
          { value: "25+", label: "Years practice" },
          { value: "0", label: "Penalties" },
        ]}
        height="md"
        overlay="navy"
      />

      {/* Slim about teaser → /about */}
      <AboutTeaser />

      {/* Slim services preview → /services */}
      <ServicesPreview />

      {/* Visual break #2 — dashboard / product moment */}
      <ImageBanner
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1800&q=80&auto=format&fit=crop"
        alt="Compliance dashboard in action"
        eyebrow="Built for finance teams"
        title={
          <>
            One dashboard. Every filing, <em className="not-italic">live.</em>
          </>
        }
        description="Real-time PF, ESI, GST, TDS status across every entity, every state — visible to your CXO team 24×7."
        stats={[
          { value: "99.8%", label: "On-time rate" },
          { value: "12K+", label: "Filings done" },
          { value: "250+", label: "Active clients" },
        ]}
        height="md"
        overlay="brand"
        align="center"
      />

      {/* Carousel — single quote on screen, not a wall of text */}
      <TestimonialsCarousel />

      {/* Final CTA */}
      <CTABanner
        eyebrow="Ready when you are"
        title={
          <>
            Get a free 45-minute compliance audit. <em className="not-italic">Worth ₹15,000.</em>
          </>
        }
        description="One call, one CA, one clear plan. No follow-ups unless you ask for them."
        cta={{ label: "Book free consultation", href: "/contact" }}
        secondary={{ label: "Explore services", href: "/services" }}
        variant="brand"
        className="bg-mist"
      />
    </MainLayout>
  );
}
