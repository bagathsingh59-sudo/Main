import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { LegalStub } from "@/sections/LegalStub";
import { JsonLd } from "@/components/shared/JsonLd";
import { LicenseCard } from "@/components/shared/LicenseCard";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadata } from "@/utils/seo";

const PAGE_TITLE = "Disclaimer — Vaishnavi Consultant";
const PAGE_DESC =
  "Important disclaimers about the information published on vaishnaviconsultant.com.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/disclaimer", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Disclaimer", path: "/disclaimer" },
          ]),
        ]}
      />
      <LegalStub
        title="Disclaimer"
        intro="Information on this website is provided for general guidance only. It does not constitute professional tax, legal or accounting advice."
        sections={[
          {
            heading: "Not professional advice",
            body:
              "Content published on this site — blogs, case studies, regulatory updates and explainers — is curated by our team for educational purposes. Tax, payroll, GST and labour-law facts change frequently. Always engage qualified professional advice before acting on anything you read here.",
          },
          {
            heading: "Marketing examples",
            body:
              "Case studies and testimonials may be illustrative and have been edited to preserve client confidentiality. Specific figures (₹ amounts, days saved, etc.) are accurate at the time of writing but are not predictions of future outcomes.",
          },
          {
            heading: "External links",
            body:
              "We sometimes link to external websites (government portals, tax authorities, partner products). We do not control those sites and are not responsible for their content or availability.",
          },
          {
            heading: "Contact",
            body:
              "For anything you read here that you would like to act on, write to info@vaishnaviconsultant.com or book a free 45-minute consultation — we will give you a precise answer for your facts and circumstances.",
          },
        ]}
      />
      {/* Government registration — verifiable proof of identity that
          supports every disclaimer above. The full license card sits
          here so a sceptical visitor finishing the disclaimer text
          immediately sees credentials. */}
      <section className="bg-mist py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="mb-7 text-center">
            <div className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-navy-600">
              Statutory credentials
            </div>
            <h2 className="mt-2 font-display text-2xl text-navy-900 sm:text-3xl">
              Government registration
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-slate-600">
              We are a registered commercial establishment under the
              Karnataka Shops &amp; Commercial Establishments Act. The
              certificate below is the digital rendering of our active
              registration — the original PDF is available for download.
            </p>
          </div>
          <LicenseCard variant="full" />
        </div>
      </section>
    </MainLayout>
  );
}
