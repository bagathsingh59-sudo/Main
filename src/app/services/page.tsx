import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { PageHero } from "@/components/shared/PageHero";
import { SectionDots } from "@/components/shared/SectionDots";
import { ImageBanner } from "@/components/shared/ImageBanner";
import { Services } from "@/sections/Services";
import { WhyChooseUs } from "@/sections/WhyChooseUs";
import { ComplianceProcess } from "@/sections/ComplianceProcess";
import { ComplianceCalculator } from "@/sections/ComplianceCalculator";
import { CTABanner } from "@/sections/CTABanner";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, serviceListSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { SERVICES } from "@/constants/services";

const PAGE_TITLE = "Services — EPF, ESI, GST, Payroll & Tax Compliance";
const PAGE_DESC =
  "End-to-end Payroll, EPF, ESI, GST, TDS, Labour Law and Virtual CFO services for Indian businesses. Eight modules, one accountable team.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("services", "/services");
}

const DOTS = [
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "why", label: "Why Us" },
  { id: "calculator", label: "Calculator" },
];

export default function ServicesPage() {
  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/services", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          serviceListSchema(SERVICES.map((s) => ({ id: s.id, title: s.title, summary: s.summary }))),
        ]}
      />
      <SectionDots dots={DOTS} />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="What we do"
        title={
          <>
            Eight services. <em className="not-italic text-navy-600">One accountable team.</em>
          </>
        }
        description="Pick the modules you need — payroll, EPF, ESI, GST, TDS, labour law, CFO advisory, or the full suite. We own the rest."
        image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1800&q=80&auto=format&fit=crop"
        imageAlt="Compliance and finance workflows"
      />

      <Services />

      <ImageBanner
        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1800&q=80&auto=format&fit=crop"
        alt="A team reviewing compliance filings"
        eyebrow="The Vaishnavi Promise"
        title={
          <>
            Zero penalties. <em className="not-italic">Four years running.</em>
          </>
        }
        description="If a filing penalty occurs due to our oversight, we cover it. That is our contractual commitment to every client we onboard."
        stats={[
          { value: "0", label: "Penalties · 4 yrs" },
          { value: "99.8%", label: "On-time rate" },
          { value: "24h", label: "Query SLA" },
        ]}
        height="md"
        overlay="brand"
      />

      <ComplianceProcess />
      <WhyChooseUs />
      <ComplianceCalculator />

      <CTABanner
        eyebrow="Talk to a specialist"
        title={<>Pick the modules you need. <em className="not-italic">We'll handle the rest.</em></>}
        description="A 45-minute call with a senior CA — indicative pricing, migration plan, no follow-ups unless you ask."
        cta={{ label: "Book free consultation", href: "/contact" }}
        secondary={{ label: "Read case studies", href: "/industries" }}
        variant="dark"
        className="bg-mist"
      />
    </MainLayout>
  );
}
