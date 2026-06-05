import { type ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { getSiteSettings } from "@/services/settings";

export async function MainLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <Navbar
        links={settings.navigation.navbarLinks}
        logoUrl={settings.branding.logoUrl}
      />
      <main id="main">{children}</main>
      <ScrollToTop />
      <Footer navigation={settings.navigation} logoUrl={settings.branding.logoUrl} contactInfo={settings.contactInfo} />
    </SmoothScrollProvider>
  );
}
