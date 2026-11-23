import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Heart, Leaf, Mail, MapPin, Phone, Sparkles, Users } from "lucide-react";
import { ModernHero } from "@/components/home/ModernHero";
import { TrustMetricsBar } from "@/components/home/TrustMetricsBar";
import { OriginalIntroSection } from "@/components/home/OriginalIntroSection";
import { DoctorSpotlight } from "@/components/home/DoctorSpotlight";
import { ModernTreatmentsSection } from "@/components/home/ModernTreatmentsSection";
import { MythsVsFacts } from "@/components/home/MythsVsFacts";
import { WhyHomeopathySection } from "@/components/home/WhyHomeopathySection";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { SectionHeading } from "@/components/ui";
import { CLINIC, TESTIMONIALS, TESTIMONIALS_INTRO, mapsLink } from "@/content/clinic";
import { branchesFrom, defaultSettings, getGalleryImages, getSettings, getTestimonials, getTreatments } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    path: "/",
    title: "Dr. Neeta's Homeo Health Care | Chief Consultant in Bhavnagar & Ahmedabad",
    description: "Providing one of the best Homoeopathic Treatment at our Place. Vast clinical experience in homeopathic treatments by Dr. Neeta Parmar.",
  });
}

const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

export default async function HomePage() {
  const [allTreatments, testimonials, settings, galleryDb] = await Promise.all([
    getTreatments().catch(() => []),
    getTestimonials().catch(() => []),
    getSettings().catch(() => defaultSettings),
    getGalleryImages().catch(() => []),
  ]);

  // Clinic's 16 treatment categories
  const categories = allTreatments.filter((t) => t.order < 100);
  const reviews = testimonials.length > 0 ? testimonials.slice(0, 5) : TESTIMONIALS;

  const locations = branchesFrom(settings).map((b) => ({
    key: b.key,
    city: b.key === "ahmedabad" ? "Ahmedabad" : "Bhavnagar",
    name: b.name || CLINIC,
    address: b.address,
    hours: b.hours,
    directions: b.mapLinkUrl || mapsLink(b.address),
  }));

  return (
    <>
      {/* 1. Hero Section (Providing one of the best Homoeopathic Treatment at our Place) */}
      <ModernHero />

      {/* 2. Trust Metrics Bar */}
      <TrustMetricsBar />

      {/* 3. Original Intro: Yes! Homeopathy treatment is highly effective */}
      <OriginalIntroSection />

      {/* 4. Meet Dr. Neeta Parmar (Decades of clinical experience) */}
      <DoctorSpotlight />

      {/* 5. Treatment Categories (16 Categories) */}
      <ModernTreatmentsSection treatments={categories} />

      {/* 6. Myths and Facts about HOMEOPATHY (Exact text from index.php) */}
      <MythsVsFacts />

      {/* 7. Why to go with HOMEOPATHY (Exact text from index.php) */}
      <WhyHomeopathySection />

      {/* 8. Patient's Testimonials (Our Treatment always speaks louder than us) */}
      {reviews.length > 0 && (
        <section className="relative overflow-hidden bg-forest-900 py-16 text-paper" aria-labelledby="testimonials-heading">
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 size-[26rem] rounded-full bg-forest-700/40 blur-2xl" />
          <div className="wrap relative">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
                Patient Feedback
              </span>
              <h2 id="testimonials-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-medium text-white">
                Patient&apos;s Testimonials
              </h2>
              <p className="mt-3 text-sm sm:text-base text-sage-200">
                {TESTIMONIALS_INTRO}
              </p>
            </div>
            <div className="mt-10">
              <TestimonialSlider reviews={reviews} />
            </div>
          </div>
        </section>
      )}

      {/* 9. Clinic Locations (Bhavnagar & Ahmedabad) */}
      {locations.length > 0 && (
        <section className="section bg-sage-50/50 py-16 lg:py-24" aria-labelledby="locations-heading">
          <div className="wrap">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Our Clinics
              </span>
              <h2 id="locations-heading" className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
                Visit Us in Gujarat
              </h2>
              <p className="mt-3 text-base text-ink-soft">
                Fully equipped consultation and dispensing clinics in Bhavnagar and Ahmedabad.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {locations.map((loc) => (
                <article
                  key={loc.address}
                  className="flex flex-col justify-between rounded-3xl border border-forest-800/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-forest-800/20 hover:shadow-xl hover:shadow-forest-900/10 md:p-10"
                >
                  <div>
                    <span className="inline-block rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 text-xs font-semibold">
                      {loc.name}
                    </span>
                    <h3 className="mt-3 font-serif text-3xl font-bold text-forest-950">
                      {loc.city} Clinic
                    </h3>
                    <p className="mt-5 flex items-start gap-3 text-ink-soft text-sm sm:text-base">
                      <MapPin className="mt-1 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                      <span>{loc.address}</span>
                    </p>
                    {settings.phone && (
                      <p className="mt-3 flex items-center gap-3 text-ink-soft text-sm sm:text-base">
                        <Phone className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                        <a href={telHref(settings.phone)} className="hover:text-forest-800 font-medium">
                          {settings.phone}
                        </a>
                      </p>
                    )}
                    {loc.hours.length > 0 && (
                      <p className="mt-3 flex items-center gap-3 text-ink-soft text-sm">
                        <Clock className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span>{loc.hours.join(" · ")}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-forest-800/10 flex items-center justify-between">
                    <a
                      href={loc.directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:text-emerald-700"
                    >
                      <span>Get Directions</span>
                      <ArrowUpRight className="size-4" />
                    </a>
                    <Link
                      href="/book-appointment"
                      className="rounded-full bg-sage-100 px-4 py-2 text-xs font-semibold text-forest-800 hover:bg-forest-800 hover:text-white transition-colors"
                    >
                      Book Visit
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Consult Us Now Banner */}
      <ConsultationCta />
    </>
  );
}
