import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { P12Hero } from "@/components/orisa/legacy/P12Hero";
import { P12Projects } from "@/components/orisa/legacy/P12Projects";
import { P12Services } from "@/components/orisa/legacy/P12Services";
import { P12Approach } from "@/components/orisa/legacy/P12Approach";
import { P12Band } from "@/components/orisa/legacy/P12Band";
import { P12Process } from "@/components/orisa/legacy/P12Process";
import { P12Faq } from "@/components/orisa/legacy/P12Faq";
import { PricingPlans } from "@/components/orisa/sections/PricingPlans";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, faqSchema, SITE_URL, webPageSchema } from "@/utils/jsonLd";
import { VP_FAQ, VP_PRICING } from "@/constants/vaishnaviPayContent";

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
 * VaishnaviPay product page — Orisa index-12, complete and in the
 * template's order. The pricing block is index-12's own pricing section
 * (PricingPlans) with the real plans from the owner console.
 */
export default function VaishnaviPayPage() {
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
        <P12Hero />
      </LegacySection>
      <LegacySection id="modules">
        <P12Projects />
      </LegacySection>
      <LegacySection id="features">
        <P12Services />
      </LegacySection>
      <LegacySection>
        <P12Approach />
      </LegacySection>
      <div className="o-product">
        <PricingPlans {...VP_PRICING} />
      </div>
      <LegacySection>
        <P12Band />
      </LegacySection>
      <LegacySection>
        <P12Process />
      </LegacySection>
      <LegacySection id="faq">
        <P12Faq />
      </LegacySection>
    </OrisaLayout>
  );
}
