import { OrisaLayout } from "@/components/orisa/OrisaLayout";
import { LegacySection } from "@/components/orisa/legacy/LegacySection";
import { NotFound404 } from "@/components/orisa/legacy/NotFound404";
import { getSiteSettings } from "@/services/settings";
import { SERVICES } from "@/constants/services";

/** Orisa 404 page; its search box covers the pages and every service. */
export default async function NotFound() {
  const settings = await getSiteSettings();
  const services = settings.services.items.length ? settings.services.items : SERVICES;
  const targets = [
    { label: "Home", href: "/", keywords: "home start" },
    { label: "About us", href: "/about", keywords: "about team journey company who" },
    { label: "Services", href: "/services", keywords: "services pricing price cost" },
    { label: "VaishnaviPay", href: "/vaishnavi-pay", keywords: "software app payroll software pricing plans demo" },
    { label: "Contact us", href: "/contact", keywords: "contact call email phone address book consultation" },
    { label: "Privacy Policy", href: "/privacy", keywords: "privacy data" },
    { label: "Terms of Service", href: "/terms", keywords: "terms" },
    ...services.map((s) => ({ label: s.title, href: `/services/${s.id}`, keywords: `${s.summary} ${s.points.join(" ")}` })),
  ];
  return (
    <OrisaLayout>
      <LegacySection>
        <NotFound404 targets={targets} />
      </LegacySection>
    </OrisaLayout>
  );
}
