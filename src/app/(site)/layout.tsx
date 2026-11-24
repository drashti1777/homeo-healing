import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollEffects } from "@/components/ScrollEffects";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { clinicJsonLd, jsonLdString } from "@/lib/seo";
import { defaultSettings, getSettings, type SettingsDoc } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let settings: SettingsDoc = defaultSettings;
  try {
    settings = await getSettings();
  } catch (err) {
    console.error("[layout] settings unavailable", err);
  }
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest-800 focus:px-5 focus:py-3 focus:text-paper">
        Skip to content
      </a>
      <ScrollProgress />
      <Header clinicName={settings.clinicName} />
      <main id="main" className="page-enter">{children}</main>
      <Footer settings={settings} />
      <ScrollEffects />
      <ScrollToTop />
      <WhatsAppChat />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(clinicJsonLd(settings)) }} />
      <Link
        href="/book-appointment"
        className="btn btn-primary fixed inset-x-4 bottom-4 z-40 shadow-xl sm:hidden"
        suppressHydrationWarning
      >
        Book a consultation
      </Link>
    </>
  );
}
