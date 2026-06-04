import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { LegalStub } from "@/sections/LegalStub";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadata } from "@/utils/seo";

const PAGE_TITLE = "Terms of Service — Vaishnavi Consultant";
const PAGE_DESC =
  "Terms that govern your use of the Vaishnavi Consultant website and any compliance engagement we enter into.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/terms", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: "/terms" },
          ]),
        ]}
      />
      <LegalStub
        title="Terms of Service"
        intro="These terms govern your use of vaishnaviconsultant.com and any subsequent compliance engagement with Vaishnavi Consultant."
        sections={[
          {
            heading: "1. Service scope",
            body:
              "Vaishnavi Consultant provides Payroll Management, EPF & ESIC compliance, GST returns, TDS, Income Tax, Labour Law and Virtual CFO advisory services. The specific scope, deliverables and timelines for any engagement are documented in a separate Statement of Work signed by both parties.",
          },
          {
            heading: "2. Information you share",
            body:
              "You confirm that all data shared with us is accurate, current and legally yours to share. Any inaccuracy that results in a regulatory issue is excluded from our zero-penalty guarantee.",
          },
          {
            heading: "3. Our obligations",
            body:
              "We act with reasonable professional care, follow applicable Indian standards (CA Act, ICAI guidelines, Income Tax / GST / EPF / ESIC regulations) and meet the SLAs documented in your engagement.",
          },
          {
            heading: "4. Fees & payment",
            body:
              "Fees are billed per the Statement of Work — monthly retainer, project-based or hourly. Invoices are due within 14 days of issue. GST is charged at applicable rates.",
          },
          {
            heading: "5. Limitation of liability",
            body:
              "Our aggregate liability for any engagement is capped at the fees paid by you to us in the immediately preceding 12 months. We do not accept liability for indirect, consequential or reputational loss.",
          },
          {
            heading: "6. Governing law",
            body:
              "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of Kalaburagi, Karnataka.",
          },
        ]}
      />
    </MainLayout>
  );
}
