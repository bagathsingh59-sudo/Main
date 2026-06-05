import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { PageHero } from "@/components/shared/PageHero";
import { SectionDots } from "@/components/shared/SectionDots";
import { ImageBanner } from "@/components/shared/ImageBanner";
import { AboutUs } from "@/sections/AboutUs";
import { FounderMessage } from "@/sections/FounderMessage";
import { CompanyJourney } from "@/sections/CompanyJourney";
import { Team } from "@/sections/Team";
import { Certifications } from "@/sections/Certifications";
import { Awards } from "@/sections/Awards";
import { TrustSecurity } from "@/sections/TrustSecurity";
import { Partners } from "@/sections/Partners";
import { ClientMetrics } from "@/sections/ClientMetrics";
import { CTABanner } from "@/sections/CTABanner";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";

const PAGE_TITLE = "About Us — 15 Years of Trusted Compliance";
const PAGE_DESC =
  "From a 3-person Bengaluru CA practice to India's most trusted compliance partner. Founder's note, our journey, leadership team, certifications, awards, and security.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("about", "/about");
}

const DOTS = [
  { id: "about", label: "About" },
  { id: "founder", label: "Founder" },
  { id: "journey", label: "Journey" },
  { id: "team", label: "Team" },
  { id: "certifications", label: "Credentials" },
  { id: "awards", label: "Awards" },
  { id: "trust", label: "Security" },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/about", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <SectionDots dots={DOTS} />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="Since 2009"
        title={
          <>
            Built quietly. <em className="not-italic text-navy-600">Trusted publicly.</em>
          </>
        }
        description="Fifteen years, eighteen cities, eight hundred and fifty clients — and one consistent principle."
        image="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1800&q=80&auto=format&fit=crop"
        imageAlt="Vaishnavi Consultants leadership"
      />

      <AboutUs />
      <FounderMessage />

      <ImageBanner
        src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1800&q=80&auto=format&fit=crop"
        alt="Bengaluru city skyline"
        eyebrow="Headquartered in Bengaluru"
        title={
          <>
            One office in 2009. <em className="not-italic">Eighteen cities today.</em>
          </>
        }
        description="Bengaluru · Mumbai · Hyderabad · Chennai · Pune — and twelve regional desks supporting every state of India."
        height="md"
        overlay="navy"
      />

      <CompanyJourney />
      <ClientMetrics />
      <Team />

      <ImageBanner
        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&q=80&auto=format&fit=crop"
        alt="Compliance team collaborating"
        eyebrow="80+ CAs · 40+ specialists"
        title={
          <>
            The people <em className="not-italic">behind every filing.</em>
          </>
        }
        height="sm"
        overlay="brand"
        align="center"
      />

      <Certifications />
      <Awards />
      <Partners />
      <TrustSecurity />

      <CTABanner
        eyebrow="Work with us"
        title={<>Two decades of practice. <em className="not-italic">One forty-five-minute call.</em></>}
        description="The fastest way to understand how Vaishnavi works is a quick conversation. We'll do most of the listening."
        cta={{ label: "Book free consultation", href: "/contact" }}
        secondary={{ label: "Explore services", href: "/services" }}
        variant="brand"
        className="bg-mist"
      />
    </MainLayout>
  );
}
