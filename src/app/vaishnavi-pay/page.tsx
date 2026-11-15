import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { VpHero } from "@/components/orisa/legacy/VpHero";
import { VpMarquee } from "@/components/orisa/legacy/VpMarquee";
import { VpAbout } from "@/components/orisa/legacy/VpAbout";
import { VpModules } from "@/components/orisa/legacy/VpModules";
import { VpBrands } from "@/components/orisa/legacy/VpBrands";
import { VpScreens } from "@/components/orisa/legacy/VpScreens";
import { VpRails } from "@/components/orisa/legacy/VpRails";
import { VpReviews } from "@/components/orisa/legacy/VpReviews";
import { VpCta } from "@/components/orisa/legacy/VpCta";
import { VpBlog } from "@/components/orisa/legacy/VpBlog";
import { PricingPlans } from "@/components/orisa/sections/PricingPlans";
import { ComparisonTable } from "@/components/orisa/sections/ComparisonTable";
import { FaqList } from "@/components/orisa/sections/FaqList";
import { articleCards } from "@/components/orisa/fromSettings";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, faqSchema, SITE_URL, webPageSchema } from "@/utils/jsonLd";
import { getSiteSettings } from "@/services/settings";
import {
  VP_COMPARE,
  VP_FAQ,
  VP_PRICING,
  VP8_ABOUT,
  VP8_AUDIENCE,
  VP8_BLOG_FALLBACK,
  VP8_CTA,
  VP8_HERO,
  VP8_MARQUEE,
  VP8_MODULES,
  VP8_RAILS,
  VP8_REVIEWS,
  VP8_SCREENS,
} from "@/constants/vaishnaviPayContent";

const TITLE = "VaishnaviPay — Payroll & Compliance Software for Firms";
const DESCRIPTION =
  "VaishnaviPay runs payroll, 32 statutory reports, client logins and digitally signed documents in your browser. Built and used by Vaishnavi Consultant. Free demo available.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/vaishnavi-pay" },
  openGraph: { type: "website", url: `${SITE_URL}/vaishnavi-pay`, title: TITLE, description: DESCRIPTION, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * VaishnaviPay product page — Orisa index-8 layout, in the template's
 * order, with pricing, the comparison table and FAQ before the closing CTA.
 */
export default async function VaishnaviPayPage() {
  const settings = await getSiteSettings();
  const posts = articleCards(settings, VP8_BLOG_FALLBACK.map((p) => p.image)) ?? VP8_BLOG_FALLBACK;

  return (
    <OrisaLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/vaishnavi-pay", title: TITLE, description: DESCRIPTION }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "VaishnaviPay", path: "/vaishnavi-pay" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "VaishnaviPay",
            applicationCategory: "BusinessApplication",
            applicationSubCategory: "Payroll and statutory compliance software",
            operatingSystem: "Web browser",
            description: DESCRIPTION,
            url: `${SITE_URL}/vaishnavi-pay`,
            provider: { "@id": `${SITE_URL}#organization` },
          },
          faqSchema(VP_FAQ.items),
        ]}
      />

      <LegacySection>
        <VpHero {...VP8_HERO(settings.contactInfo.email)} />
      </LegacySection>
      <LegacySection>
        <VpMarquee items={VP8_MARQUEE} />
      </LegacySection>
      <LegacySection>
        <VpAbout {...VP8_ABOUT} />
      </LegacySection>
      <LegacySection id="modules">
        <VpModules {...VP8_MODULES} />
      </LegacySection>
      <LegacySection>
        <VpBrands items={VP8_AUDIENCE} />
      </LegacySection>
      <LegacySection id="screens">
        <VpScreens {...VP8_SCREENS} />
      </LegacySection>
      <LegacySection>
        <VpRails {...VP8_RAILS} />
      </LegacySection>
      <LegacySection>
        <VpReviews {...VP8_REVIEWS} />
      </LegacySection>

      <div className="o-product">
        <PricingPlans {...VP_PRICING} />
        <ComparisonTable {...VP_COMPARE} />
        <FaqList {...VP_FAQ} />
      </div>

      <LegacySection>
        <VpCta {...VP8_CTA} />
      </LegacySection>
      <LegacySection>
        <VpBlog label="Insights" title={["Latest from", "our compliance desk."]} viewAll={{ label: "All articles", href: "/insights" }} posts={posts} />
      </LegacySection>
    </OrisaLayout>
  );
}
