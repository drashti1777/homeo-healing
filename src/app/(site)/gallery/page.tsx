import Link from "next/link";
import { Sparkles, Video } from "lucide-react";
import { ClinicGallery, type GallerySection } from "@/components/ClinicGallery";
import { ClinicVideo } from "@/components/ClinicVideo";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { PageHero } from "@/components/ui";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({
    path: "/gallery",
    title: "Clinic Gallery & Tour | Dr. Neeta's Homeo Health Care",
    description: "Photographs and a video tour of Dr. Neeta's Homeo Health Care: clinical team, consultation chambers, dispensing area, and patient recovery stories in Bhavnagar & Ahmedabad.",
  });

/**
 * Source: the clinic's live gallery page (drneetahomeohealing.com/gallery.php),
 * organized into interactive filtered categories.
 */
const SECTIONS: GallerySection[] = [
  {
    id: "team",
    title: "Clinic Team",
    images: [1, 2, 3].map((n) => ({
      src: `/gallery/team-${n}.webp`,
      alt: `Dr. Neeta's Homeo Health Team, photo ${n}`,
      width: 1800,
      height: 1200,
    })),
  },
  {
    id: "consultation",
    title: "Consultation Chambers",
    images: [1, 2, 3, 4].map((n) => ({
      src: `/gallery/consultation-${n}.webp`,
      alt: `Consultation chamber, photo ${n}`,
      width: 450,
      height: 300,
    })),
  },
  {
    id: "dispensing",
    title: "Dispensing & Pharmacy",
    images: [1, 2, 3, 4].map((n) => ({
      src: `/gallery/dispensing-${n}.webp`,
      alt: `Dispensing and natural medicine area, photo ${n}`,
      width: 1800,
      height: 1350,
    })),
  },
  {
    id: "reception",
    title: "Reception Area",
    images: [
      {
        src: "/gallery/reception-1.webp",
        alt: "Reception area of Dr. Neeta's Homeo Health Care",
        width: 1800,
        height: 1600,
      },
    ],
  },
  {
    id: "success",
    title: "Success Stories",
    images: [
      {
        src: "/gallery/success-story.webp",
        alt: "Patient recovery & success story moment",
        width: 1280,
        height: 900,
      },
    ],
  },
];

export default function GalleryPage() {
  const images = SECTIONS.flatMap((s) => s.images);

  return (
    <>
      <PageHero
        eyebrow="Clinic Showcase"
        title="Our Clinic Tour & Gallery"
        intro="Explore our healing environment in Bhavnagar and Ahmedabad: consultation chambers, natural medicine dispensing, caring staff, and patient stories."
        crumbs={[{ label: "Gallery" }]}
      />

      {/* 1. Interactive Photographs Hub with Category Filters */}
      <section className="section py-16 lg:py-24 bg-white" aria-labelledby="g-photos">
        <div className="wrap">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
              <Sparkles className="size-3.5 text-emerald-600" />
              Inside Our Clinics
            </span>
            <h2 id="g-photos" className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
              A Modern, Healing Environment
            </h2>
            <p className="mt-3 text-base text-ink-soft">
              Click on any category to view specific clinic areas, or tap any photograph to inspect in high resolution.
            </p>
          </div>

          <ClinicGallery sections={SECTIONS} />
        </div>
      </section>

      {/* 2. Cinematic Video Theater (Clinic Tour + Video Testimonials) */}
      <section className="section relative overflow-hidden bg-gradient-to-b from-white via-sand-50/50 to-white py-16 lg:py-24" aria-labelledby="g-videos">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 size-[28rem] rounded-full bg-emerald-100/30 blur-3xl -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-20 size-[28rem] rounded-full bg-sage-100/40 blur-3xl -z-10" />

        <div className="wrap">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
              <Video className="size-3.5 text-emerald-600" />
              Video Showcase
            </span>
            <h2 id="g-videos" className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
              Watch Our Clinic Tour &amp; Patient Stories
            </h2>
            <p className="mt-3 text-base text-ink-soft">
              Experience a walkthrough of our facilities and watch real patients speak about their homeopathic healing journey.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Video 1: Clinic Walkthrough */}
            <div className="flex flex-col justify-between rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-xl shadow-forest-900/5 border border-forest-800/10 transition-all hover:border-emerald-500/40 hover:shadow-2xl">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest-800">
                  Virtual Walkthrough
                </span>
                <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-forest-950">
                  Dr. Neeta&apos;s Clinic Tour
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-ink-soft">
                  Step inside our Bhavnagar clinic to see our patient reception, consult room, and clean dispensary.
                </p>
              </div>
              <div className="w-full overflow-hidden rounded-2xl">
                <ClinicVideo
                  src="/gallery/clinic-tour.mp4"
                  poster="/gallery/clinic-tour-poster.webp"
                  title="Watch the clinic tour"
                />
              </div>
            </div>

            {/* Video 2: Patient Testimonial */}
            <div className="flex flex-col justify-between rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-xl shadow-forest-900/5 border border-forest-800/10 transition-all hover:border-emerald-500/40 hover:shadow-2xl">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20">
                  Patient Story
                </span>
                <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-forest-950">
                  Video Testimonials &amp; Recovery
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-ink-soft">
                  Hear firsthand experiences of permanent relief and holistic recovery from treated patients.
                </p>
              </div>
              <div className="w-full overflow-hidden rounded-2xl">
                <YouTubeEmbed
                  id="MmN6xSjrdtk"
                  title="Video Testimonials: Dr. Neeta's Homeo Healing"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. High-Impact Consultation Banner */}
      <ConsultationCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([
            {
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              name: "Clinic gallery",
              url: `${SITE_URL}/gallery`,
              image: images.map((i) => ({
                "@type": "ImageObject",
                contentUrl: `${SITE_URL}${i.src}`,
                description: i.alt,
              })),
            },
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Gallery", path: "/gallery" },
            ]),
          ]),
        }}
      />
    </>
  );
}
