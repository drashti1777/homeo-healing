import { ClinicGallery, type GallerySection } from "@/components/ClinicGallery";
import { GalleryVideoShowcase } from "@/components/GalleryVideoShowcase";
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

      {/* 1. Interactive Photographs Hub with Category Filters & Entrance Animations */}
      <section className="section py-16 lg:py-24 bg-white" aria-labelledby="g-photos">
        <div className="wrap">
          <ClinicGallery sections={SECTIONS} />
        </div>
      </section>

      {/* 2. Cinematic Video Theater (Clinic Tour + Video Testimonials) with Animations */}
      <GalleryVideoShowcase />

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
