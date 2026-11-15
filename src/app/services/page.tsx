import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { SvcDetailHero } from "@/components/orisa/legacy/SvcDetailHero";
import { SvcDetailMedia } from "@/components/orisa/legacy/SvcDetailMedia";
import { SvcPanels } from "@/components/orisa/legacy/SvcPanels";
import { FaqBlock } from "@/components/orisa/legacy/FaqBlock";
import { ContactBlock } from "@/components/orisa/legacy/ContactBlock";
import { GalleryWall } from "@/components/orisa/sections/GalleryWall";
import { PricingPlans } from "@/components/orisa/sections/PricingPlans";
import { HOME_GALLERY } from "@/constants/homeContent";
import { SERVICE_PRICING } from "@/constants/servicesContent";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, serviceListSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { SERVICES } from "@/constants/services";
import { contactForm, faqItems, serviceRows } from "@/components/orisa/fromSettings";
import { getSiteSettings } from "@/services/settings";

const PAGE_TITLE = "Services — EPF, ESI, GST, Payroll & Tax Compliance";
const PAGE_DESC =
  "End-to-end Payroll, EPF, ESI, GST, TDS, Labour Law and Virtual CFO services for Indian businesses. Eight modules, one accountable team.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("services", "/services");
}

export default async function ServicesPage() {
  const settings = await getSiteSettings();
  const services = settings.services.items.length > 0 ? settings.services.items : SERVICES;
  return (
    <OrisaLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/services", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          serviceListSchema(services.map((s) => ({ id: s.id, title: s.title, summary: s.summary }))),
        ]}
      />

      {/* Orisa "Service Details": hero + moving image strip */}
      <LegacySection>
        <SvcDetailHero />
        <SvcDetailMedia />
      </LegacySection>

      {/* Orisa "Service 01", everything after its hero */}
      <LegacySection id="services">
        <SvcPanels items={serviceRows(settings)} />
      </LegacySection>
      <GalleryWall {...HOME_GALLERY} />
      <PricingPlans {...SERVICE_PRICING} />
      <LegacySection id="faq">
        <FaqBlock items={faqItems(settings)} />
      </LegacySection>
      <LegacySection id="contact">
        <ContactBlock {...contactForm(settings)} />
      </LegacySection>
    </OrisaLayout>
  );
}
