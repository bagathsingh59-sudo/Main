import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { LegalStub } from "@/sections/LegalStub";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadata } from "@/utils/seo";

const PAGE_TITLE = "Privacy Policy — Vaishnavi Consultant";
const PAGE_DESC =
  "How Vaishnavi Consultant collects, stores, processes and safeguards client data across our Payroll, EPF, ESIC, GST and TDS compliance practice.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/privacy", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy" },
          ]),
        ]}
      />
      <LegalStub
        title="Privacy Policy"
        intro="Your payroll, financial and statutory data carry enormous regulatory weight. This policy explains the categories of data we collect, why, how long we retain it, and how you can ask us to delete or transfer it."
        sections={[
          {
            heading: "1. Data we collect",
            body:
              "Identifiers and contact details you provide, business details for compliance engagements (PAN, GSTIN, TAN, employee master data, salary structures), and standard analytics signals to operate this website (page views, device class, region). We never sell client data.",
          },
          {
            heading: "2. Why we collect it",
            body:
              "To deliver the compliance services you engage us for, to respond to enquiries, to issue invoices and statutory documents, and to comply with applicable Indian law (IT Act, GST, EPF, ESIC, labour codes).",
          },
          {
            heading: "3. Where it lives",
            body:
              "All primary and disaster-recovery storage sits in Indian data-centre regions. Encryption in transit (TLS 1.3) and at rest (AES-256). Access is role-based and least-privilege; every change is logged.",
          },
          {
            heading: "4. Your rights",
            body:
              "You may request access, correction, portability or deletion of your data at any time by writing to info@vaishnaviconsultant.com. We will respond within one working week.",
          },
          {
            heading: "5. Cookies & analytics",
            body:
              "We use Vercel Web Analytics and Google Analytics 4 to understand site usage in aggregate. Cookies are limited to functional, analytics and consent management — never advertising or cross-site tracking.",
          },
        ]}
      />
    </MainLayout>
  );
}
