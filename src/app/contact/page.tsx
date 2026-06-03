import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { PageHero } from "@/components/shared/PageHero";
import { SectionDots } from "@/components/shared/SectionDots";
import { ImageBanner } from "@/components/shared/ImageBanner";
import { BookConsultation } from "@/sections/BookConsultation";
import { Contact } from "@/sections/Contact";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadata } from "@/utils/seo";

const PAGE_TITLE = "Contact — Book a Free 45-Minute Consultation";
const PAGE_DESC =
  "Reach Vaishnavi Consultants — head office in Bengaluru, with five branches across India. Senior CA replies within one working day.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: "/contact",
  keywords: ["compliance consultant Bengaluru", "tax CA contact", "EPF consultant phone"],
});

const DOTS = [
  { id: "book", label: "Book" },
  { id: "contact", label: "Message" },
];

export default function ContactPage() {
  return (
    <MainLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/contact", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <SectionDots dots={DOTS} />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Get in touch"
        title={
          <>
            One short conversation, <em className="not-italic text-navy-600">a clearer compliance picture.</em>
          </>
        }
        description="Book a 45-minute call or drop us a note. A senior CA replies to every message within one working day — guaranteed."
        image="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1800&q=80&auto=format&fit=crop"
        imageAlt="Client consultation in progress"
      />

      <BookConsultation />

      <ImageBanner
        src="https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=1800&q=80&auto=format&fit=crop"
        alt="Bengaluru office building"
        eyebrow="Head office"
        title={
          <>
            12th Floor, Prestige Trade Tower. <em className="not-italic">Bengaluru.</em>
          </>
        }
        description="Walk-ins by appointment, Monday to Saturday, 9:30 AM – 7:00 PM IST."
        height="sm"
        overlay="brand"
      />

      <Contact />
    </MainLayout>
  );
}
