import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { PageHero } from "@/components/shared/PageHero";
import { SectionDots } from "@/components/shared/SectionDots";
import { ImageBanner } from "@/components/shared/ImageBanner";
import { BookConsultation } from "@/sections/BookConsultation";
import { Contact } from "@/sections/Contact";
import { LicenseCard } from "@/components/shared/LicenseCard";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/utils/jsonLd";
import { buildPageMetadataFromSettings } from "@/utils/seo";
import { getSiteSettings } from "@/services/settings";

const PAGE_TITLE = "Contact — Book a Free 45-Minute Consultation";
const PAGE_DESC =
  "Reach Vaishnavi Consultants — head office in Bengaluru, with five branches across India. Senior CA replies within one working day.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromSettings("contact", "/contact");
}

const DOTS = [
  { id: "book", label: "Book" },
  { id: "contact", label: "Message" },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
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

      <BookConsultation
        contactInfo={settings.contactInfo}
        maintenanceMessage={settings.maintenance.formsDisabled ? settings.maintenance.message : undefined}
      />

      <ImageBanner
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=80&auto=format&fit=crop"
        alt="Vaishnavi Consultant — Kalaburagi office"
        eyebrow="Head office"
        title={
          <>
            Milan Chowk, <em className="not-italic">Kalaburagi.</em>
          </>
        }
        description="Walk-ins by appointment, Monday to Saturday, 9:30 AM – 7:00 PM IST. Pan-India clients served remotely."
        height="sm"
        overlay="brand"
      />

      {/* Compact verified-business card above the contact form —
          reduces lead-form hesitation by proving we're a real,
          government-registered firm before the visitor parts with
          their email + phone. */}
      <section className="bg-mist pt-12 pb-2 sm:pt-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <LicenseCard variant="compact" />
        </div>
      </section>

      <Contact
        services={settings.formConfig.services}
        sizes={settings.formConfig.sizes}
        contactInfo={settings.contactInfo}
        maintenanceMessage={settings.maintenance.formsDisabled ? settings.maintenance.message : undefined}
      />
    </MainLayout>
  );
}
