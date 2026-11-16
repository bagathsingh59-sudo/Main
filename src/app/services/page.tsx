import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { S1Hero } from "@/components/orisa/legacy/S1Hero";
import { SvcPanels } from "@/components/orisa/legacy/SvcPanels";
import { S1Gallery } from "@/components/orisa/legacy/S1Gallery";
import { S1Pricing } from "@/components/orisa/legacy/S1Pricing";
import { FaqBlock } from "@/components/orisa/legacy/FaqBlock";
import { ContactBlock } from "@/components/orisa/legacy/ContactBlock";
import { contactDetails, contactForm, faqItems, serviceRows } from "@/components/orisa/fromSettings";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, serviceListSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { getSiteSettings } from "@/services/settings";
import { SERVICES } from "@/constants/services";

const PAGE_TITLE = "Services — Payroll, EPF, ESI, GST, TDS & Labour Law Compliance";
const PAGE_DESC =
  "End-to-end Payroll, EPF, ESI, GST, TDS, Labour Law and Virtual CFO services for Indian businesses. Eight modules, one accountable team.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("services", "/services");
}

/**
 * Services — Orisa "Service 01", complete and in the template's order.
 * Each service row opens its own detail page (/services/[slug]).
 */
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
      <LegacySection>
        <S1Hero contact={contactDetails(settings)} />
      </LegacySection>
      <LegacySection id="services">
        <SvcPanels items={serviceRows(settings)} />
      </LegacySection>
      <LegacySection>
        <S1Gallery />
      </LegacySection>
      <LegacySection id="pricing">
        <S1Pricing contact={contactDetails(settings)} />
      </LegacySection>
      <LegacySection id="faq">
        <FaqBlock items={faqItems(settings)} />
      </LegacySection>
      <LegacySection id="contact">
        <ContactBlock {...contactForm(settings)} />
      </LegacySection>
    </OrisaLayout>
  );
}
