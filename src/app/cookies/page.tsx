import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { LegalStub } from "@/sections/LegalStub";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadata } from "@/utils/seo";

const PAGE_TITLE = "Cookie Policy — Vaishnavi Consultant";
const PAGE_DESC =
  "Which cookies vaishnaviconsultant.com sets, what each one does, and how to opt out.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/cookies", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Cookie Policy", path: "/cookies" },
          ]),
        ]}
      />
      <LegalStub
        title="Cookie Policy"
        intro="We use a small number of cookies and similar storage technologies. This page explains what each one is for and how to disable them."
        sections={[
          {
            heading: "Strictly necessary",
            body:
              "Used to keep the site working — for example to remember your dark / light theme preference or to deliver the page from Vercel's CDN. These cannot be disabled.",
          },
          {
            heading: "Analytics",
            body:
              "Vercel Web Analytics and Google Analytics 4 set cookies to count visits, identify popular pages and measure performance. The data is aggregated and never used to identify individual visitors.",
          },
          {
            heading: "Marketing",
            body:
              "We do not currently run advertising cookies. If we add them, we will update this page and request your consent first.",
          },
          {
            heading: "How to opt out",
            body:
              "You can block all non-essential cookies through your browser settings (Chrome: Settings → Privacy and security → Cookies; Safari: Preferences → Privacy). Blocking cookies does not affect any compliance engagement you have with us.",
          },
        ]}
      />
    </MainLayout>
  );
}
