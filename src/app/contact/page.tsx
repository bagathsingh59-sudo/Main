import type { Metadata } from "next";
import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { ContactBlock } from "@/components/orisa/legacy/ContactBlock";
import { contactForm } from "@/components/orisa/fromSettings";
import { ProcessTimeline } from "@/components/orisa/sections/ProcessTimeline";
import { CtaPanel } from "@/components/orisa/sections/CtaPanel";
import { LicenseStrip } from "@/components/orisa/sections/LicenseStrip";
import { MapEmbed } from "@/components/shared/MapEmbed";
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

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const ci = settings.contactInfo;
  return (
    <OrisaLayout>
      <JsonLd
        data={[
          webPageSchema({ path: "/contact", title: PAGE_TITLE, description: PAGE_DESC }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      {/* Orisa "Contact 01": heading, office details and the message form
          (the form posts to the existing lead API). */}
      <LegacySection id="contact">
        <ContactBlock {...contactForm(settings)} />
      </LegacySection>

      {/* Previous design's "Book a consultation" block → process timeline */}
      <div id="book">
        <ProcessTimeline
          label="BOOK A CONSULTATION"
          title="Get a 45-minute audit on us. Worth ₹15,000."
          description="Pick a slot from our live calendar — the invite, the Meet link and the reminders are handled for you. You just show up."
          metrics={[
            { value: "45m", label: "CALL LENGTH" },
            { value: "₹0", label: "COST TO YOU" },
          ]}
          deliverablesLabel="WHAT YOU GET"
          phases={[
            { when: "Step 1", title: "Pick a slot", text: "A live calendar — only times we are actually free show up.", deliverables: ["45-minute call", "Senior consultant"] },
            { when: "Step 2", title: "Auto-confirmed", text: "A Google Meet invite reaches your inbox the moment you confirm.", deliverables: ["Meet link", "Reminders"] },
            { when: "Step 3", title: "We do the prep", text: "A short questionnaire arrives so the call starts where it matters.", deliverables: ["Health-check", "PF · ESI · GST · TDS"] },
            { when: "After", title: "A clear plan", text: "Indicative pricing and a migration plan. No sales pitch, no follow-up unless you ask.", deliverables: ["Pricing", "Migration plan"] },
          ]}
        />
      </div>

      <CtaPanel
        bar={{ left: settings.maintenance.formsDisabled ? "BOOKING PAUSED" : "SLOTS OPEN THIS WEEK", center: ci.hours, right: "FREE 45-MIN AUDIT" }}
        tag="PREFER TO TALK FIRST"
        title={["Talk", "to", "us."]}
        lede={[
          settings.maintenance.formsDisabled ? settings.maintenance.message : "Open the booking calendar, or simply call or email.",
          "A senior consultant replies to every message within one working day.",
        ]}
        chips={[
          ...(BOOKING_URL && !settings.maintenance.formsDisabled ? [{ label: "Open the booking calendar", href: BOOKING_URL }] : []),
          { label: `Call ${ci.phone}`, href: `tel:${ci.phone.replace(/\s/g, "")}` },
          { label: `Also on ${ci.altPhone}`, href: `tel:${ci.altPhone.replace(/\s/g, "")}` },
        ]}
        contact={{ label: "EMAIL", text: ci.email, href: `mailto:${ci.email}` }}
      />

      {/* Previous design's verified-business card → registration strip */}
      <LicenseStrip />

      {ci.mapEmbedUrl && (
        <section className="o-map" aria-label="Find us">
          <div className="o-wrap">
            <MapEmbed url={ci.mapEmbedUrl} title={`${ci.addressLine1} — map`} />
          </div>
        </section>
      )}
    </OrisaLayout>
  );
}
