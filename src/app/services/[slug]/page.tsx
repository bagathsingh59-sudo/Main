import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { SvcDetailHero } from "@/components/orisa/legacy/SvcDetailHero";
import { SvcDetailMedia } from "@/components/orisa/legacy/SvcDetailMedia";
import { SdBody } from "@/components/orisa/legacy/SdBody";
import { SdApproach } from "@/components/orisa/legacy/SdApproach";
import { SdCta } from "@/components/orisa/legacy/SdCta";
import { SdNewsletter } from "@/components/orisa/legacy/SdNewsletter";
import { findService } from "@/components/orisa/fromSettings";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, SITE_URL, webPageSchema } from "@/utils/jsonLd";
import { getSiteSettings } from "@/services/settings";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item } = findService(await getSiteSettings(), params.slug);
  if (!item) return {};
  const title = `${item.title} — Vaishnavi Consultant`;
  return {
    title,
    description: item.summary,
    alternates: { canonical: `/services/${item.id}` },
    openGraph: { type: "website", url: `${SITE_URL}/services/${item.id}`, title, description: item.summary, locale: "en_IN" },
  };
}

/**
 * One service — Orisa "Service Details", complete and in the template's
 * order. Title, summary and points come from Admin → Services.
 */
export default async function ServiceDetailPage({ params }: Props) {
  const { item, all } = findService(await getSiteSettings(), params.slug);
  if (!item) notFound();

  const points = item.points.length ? item.points : [item.title];
  return (
    <OrisaLayout>
      <JsonLd
        data={[
          webPageSchema({ path: `/services/${item.id}`, title: item.title, description: item.summary }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: item.title, path: `/services/${item.id}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: item.title,
            description: item.summary,
            areaServed: "IN",
            provider: { "@id": `${SITE_URL}#organization` },
          },
        ]}
      />
      <LegacySection>
        <SvcDetailHero
          crumb="Services"
          title={item.title}
          lead={item.summary}
          tags={all.filter((s) => s.id !== item.id).slice(0, 4).map((s) => ({ label: s.title, href: `/services/${s.id}` }))}
        />
        <SvcDetailMedia />
      </LegacySection>
      <LegacySection>
        <SdBody
          label="What we do"
          heading={`What our ${item.title} service covers.`}
          sub={`${item.summary} Everything is handled end to end by your named compliance manager and checked twice before anything is filed.`}
          items={points.slice(0, 4).map((p) => ({
            title: p,
            text: `Part of our ${item.title} service — prepared, reviewed and filed on time, with the proof shared with you every month.`,
          }))}
        />
      </LegacySection>
      <LegacySection>
        <SdApproach />
      </LegacySection>
      <LegacySection>
        <SdCta
          heading={`What you’ll receive with ${item.title}`}
          receive={["A named compliance manager", "A monthly deadline calendar", "Filed returns and challans", "A clear monthly statement"]}
          promise="Every filing is prepared, reviewed by a second person and submitted before its due date. If a penalty ever arises from our oversight, we cover it."
        />
      </LegacySection>
      <LegacySection>
        <SdNewsletter />
      </LegacySection>
    </OrisaLayout>
  );
}
