import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { H7Hero } from "@/components/orisa/legacy/H7Hero";
import { H7Intro } from "@/components/orisa/legacy/H7Intro";
import { H7Strip } from "@/components/orisa/legacy/H7Strip";
import { H7Partner } from "@/components/orisa/legacy/H7Partner";
import { H7Products } from "@/components/orisa/legacy/H7Products";
import { H7Process } from "@/components/orisa/legacy/H7Process";
import { H7Ticker } from "@/components/orisa/legacy/H7Ticker";
import { H7Team } from "@/components/orisa/legacy/H7Team";
import { H7Band } from "@/components/orisa/legacy/H7Band";
import { H7Insights } from "@/components/orisa/legacy/H7Insights";
import { H7Contact } from "@/components/orisa/legacy/H7Contact";
import { contactDetails, teamMembers } from "@/components/orisa/fromSettings";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, serviceListSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { SERVICES } from "@/constants/services";
import { getSiteSettings } from "@/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("home", "/");
}

/**
 * Home page — Orisa index-7, in the template's order. The header sits over
 * the hero with the slide-open menu (`home`). The template's "Insights"
 * block lists compliance guides that open the matching service pages.
 */
export default async function HomePage() {
  const settings = await getSiteSettings();
  const services = settings.services.items.length > 0 ? settings.services.items : SERVICES;
  const team = teamMembers(settings)?.slice(0, 4);

  return (
    <OrisaLayout home>
      <JsonLd
        data={[
          webPageSchema({
            path: "/",
            title: "Vaishnavi Consultant — Tax & Compliance Consulting",
            description:
              "Supporting businesses with accurate and professional Payroll, EPF, ESIC, GST and Labour Compliance services that help minimise risk, maintain accuracy, reduce administrative burden, and ensure complete compliance and operational peace of mind.",
          }),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          serviceListSchema(services.map((s) => ({ id: s.id, title: s.title, summary: s.summary }))),
        ]}
      />
      <LegacySection className="o-duo">
        <H7Hero />
      </LegacySection>
      <LegacySection className="o-duo">
        <H7Intro />
      </LegacySection>
      <LegacySection className="o-duo">
        <H7Strip />
      </LegacySection>
      <LegacySection className="o-duo">
        <H7Partner contact={contactDetails(settings)} />
      </LegacySection>
      <LegacySection className="o-duo" id="services">
        <H7Products />
      </LegacySection>
      <LegacySection className="o-duo">
        <H7Process />
      </LegacySection>
      <LegacySection className="o-duo">
        <H7Ticker />
      </LegacySection>
      <LegacySection id="team">
        <H7Team members={team} />
      </LegacySection>
      <LegacySection>
        <H7Band />
      </LegacySection>
      <LegacySection className="o-duo" id="guides">
        <H7Insights />
      </LegacySection>
      <LegacySection id="contact">
        <H7Contact />
      </LegacySection>
    </OrisaLayout>
  );
}
