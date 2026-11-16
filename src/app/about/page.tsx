import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { AboutTwoHero } from "@/components/orisa/legacy/AboutTwoHero";
import { AboutTwoTeam } from "@/components/orisa/legacy/AboutTwoTeam";
import { A2Journey } from "@/components/orisa/legacy/A2Journey";
import { A2Media } from "@/components/orisa/legacy/A2Media";
import { A2Figures } from "@/components/orisa/legacy/A2Figures";
import { ContactBlock } from "@/components/orisa/legacy/ContactBlock";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { getSiteSettings } from "@/services/settings";
import { contactForm, linkedinUrl, teamMembers } from "@/components/orisa/fromSettings";

const PAGE_TITLE = "About Us — Vaishnavi Consultant";
const PAGE_DESC =
  "Meet the team behind Vaishnavi Consultant — 25+ years of combined practitioner experience across payroll, EPF, ESI and labour compliance.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("about", "/about");
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <OrisaLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/about", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      {/* Orisa "About 02", complete and in the template's order */}
      <LegacySection>
        <AboutTwoHero linkedinUrl={linkedinUrl(settings)} />
      </LegacySection>
      <LegacySection id="team">
        <AboutTwoTeam members={teamMembers(settings)?.slice(0, 3)} />
      </LegacySection>
      <LegacySection id="journey">
        <A2Journey />
      </LegacySection>
      <LegacySection>
        <A2Media />
      </LegacySection>
      <LegacySection>
        <A2Figures />
      </LegacySection>
      <LegacySection id="contact">
        <ContactBlock {...contactForm(settings)} />
      </LegacySection>
    </OrisaLayout>
  );
}
