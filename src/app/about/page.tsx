import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { AboutTwoHero } from "@/components/orisa/legacy/AboutTwoHero";
import { BrandScroll } from "@/components/orisa/legacy/BrandScroll";
import { StatsRow } from "@/components/orisa/legacy/StatsRow";
import { JourneyBlock } from "@/components/orisa/legacy/JourneyBlock";
import { AwardsBlock } from "@/components/orisa/legacy/AwardsBlock";
import { TeamBlock } from "@/components/orisa/legacy/TeamBlock";
import { ContactBlock } from "@/components/orisa/legacy/ContactBlock";
import { BlogBlock } from "@/components/orisa/legacy/BlogBlock";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { getSiteSettings } from "@/services/settings";

const PAGE_TITLE = "About Us — 15 Years of Trusted Compliance";
const PAGE_DESC =
  "From a 3-person Bengaluru CA practice to India's most trusted compliance partner. Founder's note, our journey, leadership team, certifications, awards, and security.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("about", "/about");
}

export default function AboutPage() {
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

      {/* Orisa "About 02" hero (wordmark, social link, banner) */}
      <LegacySection>
        <AboutTwoHero />
      </LegacySection>

      {/* Orisa "About 01", every section after its hero, in the template's order */}
      <LegacySection>
        <StatsRow />
      </LegacySection>
      <LegacySection id="journey">
        <JourneyBlock />
      </LegacySection>
      <LegacySection id="awards">
        <AwardsBlock />
      </LegacySection>
      <LegacySection id="team">
        <TeamBlock />
      </LegacySection>
      <LegacySection id="contact">
        <ContactBlock />
      </LegacySection>
      <LegacySection>
        <BlogBlock />
      </LegacySection>
      <LegacySection>
        <BrandScroll />
      </LegacySection>
    </OrisaLayout>
  );
}
