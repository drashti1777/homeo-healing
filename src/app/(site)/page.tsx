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

      {/* 7. Patient's Testimonials (Modern Light & Crisp Styling) */}
      {reviews.length > 0 && (
        <section className="relative bg-white py-10 lg:py-14" aria-labelledby="testimonials-heading">
          <div className="wrap relative">
            <div className="mx-auto max-w-xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-300/60 shadow-sm">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Patient Feedback
              </span>
              <h2 id="testimonials-heading" className="mt-2.5 font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-forest-950">
                Patient&apos;s Testimonials
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-ink-soft">
                {TESTIMONIALS_INTRO}
              </p>
            </div>
            <div className="mt-8">
              <TestimonialSlider reviews={reviews} theme="light" />
            </div>
          </div>
        </section>
      )}

      {/* 8. High-Impact Consultation Banner */}
      <ConsultationCta />
    </>
  );
}
