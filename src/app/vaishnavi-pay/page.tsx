import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { HomeHero } from "@/components/orisa/HomeHero";
import { AboutIntro } from "@/components/orisa/sections/AboutIntro";
import { ProjectList } from "@/components/orisa/sections/ProjectList";
import { ProcessTimeline } from "@/components/orisa/sections/ProcessTimeline";
import { ExpertiseList } from "@/components/orisa/sections/ExpertiseList";
import { ComparisonTable } from "@/components/orisa/sections/ComparisonTable";
import { PricingPlans } from "@/components/orisa/sections/PricingPlans";
import { DistinctionList } from "@/components/orisa/sections/DistinctionList";
import { FaqList } from "@/components/orisa/sections/FaqList";
import { CtaPanel } from "@/components/orisa/sections/CtaPanel";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, faqSchema, SITE_URL, webPageSchema } from "@/utils/jsonLd";
import { getSiteSettings } from "@/services/settings";
import {
  VP_ABOUT,
  VP_ADDONS,
  VP_COMPARE,
  VP_CTA,
  VP_FAQ,
  VP_HERO,
  VP_MODULES,
  VP_MONTH,
  VP_PRICING,
  VP_WHY,
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

export default async function VaishnaviPayPage() {
  const settings = await getSiteSettings();
  const ci = settings.contactInfo;

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

      <div className="o-product">
        <HomeHero
          tagline={VP_HERO.tagline}
          since={VP_HERO.since}
          headline={VP_HERO.headline}
          copy={VP_HERO.copy}
          cta={VP_HERO.cta}
          image={VP_HERO.image}
          card={{ label: VP_HERO.label, email: ci.email, tags: VP_HERO.tags, hours: ci.hours }}
          /* Office status, deadline ticker and the Explore cursor belong to the home page. */
          ideas={{ 4: false, 5: false, 10: false }}
        />
        <AboutIntro {...VP_ABOUT} />
        <div id="modules">
          <ProjectList {...VP_MODULES} />
        </div>
        <ProcessTimeline {...VP_MONTH} />
        <ExpertiseList {...VP_ADDONS} />
        <ComparisonTable {...VP_COMPARE} />
        <PricingPlans {...VP_PRICING} />
        <div id="why">
          <DistinctionList {...VP_WHY} />
        </div>
        <FaqList {...VP_FAQ} />
        <CtaPanel {...VP_CTA(ci.email)} />
      </div>
    </OrisaLayout>
  );
}
