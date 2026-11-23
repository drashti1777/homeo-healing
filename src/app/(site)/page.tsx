import { FullScreenHeroBanner } from "@/components/home/FullScreenHeroBanner";
import { TrustMetricsBar } from "@/components/home/TrustMetricsBar";
import { ClinicIntroLive } from "@/components/home/ClinicIntroLive";
import { DoctorSpotlight } from "@/components/home/DoctorSpotlight";
import { MythsVsFacts } from "@/components/home/MythsVsFacts";
import { WhyHomeopathySection } from "@/components/home/WhyHomeopathySection";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { TESTIMONIALS, TESTIMONIALS_INTRO } from "@/content/clinic";
import { defaultSettings, getGalleryImages, getSettings, getTestimonials } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    path: "/",
    title: "Dr. Neeta's Homeo Health Care | Chief Consultant in Bhavnagar & Ahmedabad",
    description: "Advanced, holistic homeopathic care by Dr. Neeta Parmar (MD Repertory). Consultations in Bhavnagar & Ahmedabad, and online appointments across India.",
  });
}

export default async function HomePage() {
  const [testimonials] = await Promise.all([
    getTestimonials().catch(() => []),
  ]);

  const reviews = testimonials.length > 0 ? testimonials.slice(0, 5) : TESTIMONIALS;

  return (
    <>
      {/* 1. Full-Screen Cinematic Hero Banner with Animated Slider & Indian Doctor Visuals */}
      <FullScreenHeroBanner />

      {/* 2. Elevated Trust & Metrics Bar */}
      <TrustMetricsBar />

      {/* 3. Clinic Introduction (Exact line-to-line text from live site) */}
      <ClinicIntroLive />

      {/* 4. Meet Dr. Neeta Parmar (Credentials, Indian Clinic Consultation Visual) */}
      <DoctorSpotlight />

      {/* 5. Myths and Facts about HOMEOPATHY (Modern Interactive Cards) */}
      <MythsVsFacts />

      {/* 6. Why Homeopathy (With Indian Multi-Gen Family Health Visual) */}
      <WhyHomeopathySection />

      {/* 7. Patient's Testimonials */}
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

      {/* 8. High-Impact Consultation Banner */}
      <ConsultationCta />
    </>
  );
}
