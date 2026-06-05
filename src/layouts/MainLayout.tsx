import { type ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { getSiteSettings } from "@/services/settings";

export async function MainLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  // Strips are part of the Navbar's fixed header so they stack cleanly
  // without overlapping the nav row.
  const banner =
    settings.banner.enabled && settings.banner.message.trim()
      ? {
          message: settings.banner.message,
          linkUrl: settings.banner.linkUrl || undefined,
          linkLabel: settings.banner.linkLabel || undefined,
          tone: settings.banner.tone,
        }
      : null;
  const maintenance = settings.maintenance.formsDisabled
    ? { message: settings.maintenance.message }
    : null;

  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <Navbar
        links={settings.navigation.navbarLinks}
        logoUrl={settings.branding.logoUrl}
        banner={banner}
        maintenance={maintenance}
      />
      <main id="main">{children}</main>
      <ScrollToTop />
      <Footer
        navigation={settings.navigation}
        logoUrl={settings.branding.logoUrl}
        contactInfo={settings.contactInfo}
      />
    </SmoothScrollProvider>
  );
}
