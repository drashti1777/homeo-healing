import Link from "next/link";
import { ClinicGallery, type GallerySection } from "@/components/ClinicGallery";
import { ClinicVideo } from "@/components/ClinicVideo";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { PageHero } from "@/components/ui";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({ path: "/gallery", title: "Clinic Gallery", description: "Photographs and a video tour of Dr. Neeta's Homeo Health Care: team, consultation room, dispensing area and reception." });

/**
 * Source: the clinic's live gallery page (drneetahomeohealing.com/gallery.php), same sections and photos in the same order.
 * Team and Success Story photos are shown as the owner asked; the audit (docs/content-verification-required.md, section 6)
 * still lists them as needing ownership / consent confirmation.
 */
const SECTIONS: GallerySection[] = [
  {
    id: "team",
    title: "Dr. Neeta's Homeo Health Team",
    images: [1, 2, 3].map((n) => ({ src: `/gallery/team-${n}.webp`, alt: `Dr. Neeta's Homeo Health Team, photo ${n}`, width: 1800, height: 1200 })),
  },
  {
    id: "consultation",
    title: "Consultation Room",
    images: [1, 2, 3, 4].map((n) => ({ src: `/gallery/consultation-${n}.webp`, alt: `Consultation room, photo ${n}`, width: 450, height: 300 })),
  },
  {
    id: "dispensing",
    title: "Dispensing Area",
    images: [1, 2, 3, 4].map((n) => ({ src: `/gallery/dispensing-${n}.webp`, alt: `Dispensing area, photo ${n}`, width: 1800, height: 1350 })),
  },
  {
    id: "reception",
    title: "Reception Area",
    images: [{ src: "/gallery/reception-1.webp", alt: "Reception area of Dr. Neeta's Homeo Health Care", width: 1800, height: 1600 }],
  },
  {
    id: "success",
    title: "Success Story",
    images: [{ src: "/gallery/success-story.webp", alt: "Success story photo", width: 1280, height: 900 }],
  },
];

export default function GalleryPage() {
  const images = SECTIONS.flatMap((s) => s.images);

  return (
    <>
      <PageHero eyebrow="Gallery" title="Our clinic tour" intro="A video tour and photographs of our clinic: the team, consultation room, dispensing area and reception." crumbs={[{ label: "Gallery" }]} />

      {/* Our Clinic Tour (video) */}
      <section className="section !pb-0" aria-labelledby="g-tour">
        <div className="wrap">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4" data-reveal>Video</p>
            <h2 id="g-tour" data-split className="text-[clamp(1.9rem,4vw,3rem)] font-normal">Our Clinic Tour</h2>
          </div>
          <div className="mt-8 w-full" data-clip>
            <ClinicVideo src="/gallery/clinic-tour.mp4" poster="/gallery/clinic-tour-poster.webp" title="Watch the clinic tour" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <ClinicGallery sections={SECTIONS} />

          {/* Video Testimonials (the clinic's YouTube video from the live gallery page) */}
          <div className="mt-24 md:mt-32" role="group" aria-labelledby="g-video-testimonials">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4" data-reveal>{String(SECTIONS.length + 1).padStart(2, "0")}</p>
              <h2 id="g-video-testimonials" data-split className="text-[clamp(1.9rem,4vw,3rem)] font-normal">Video Testimonials</h2>
            </div>
            <div className="mt-8 max-w-3xl" data-clip>
              <YouTubeEmbed id="MmN6xSjrdtk" title="Video Testimonials: Dr. Neeta's Homeo Healing" />
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([
            { "@context": "https://schema.org", "@type": "ImageGallery", name: "Clinic gallery", url: `${SITE_URL}/gallery`, image: images.map((i) => ({ "@type": "ImageObject", contentUrl: `${SITE_URL}${i.src}`, description: i.alt })) },
            breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }]),
          ]),
        }}
      />
    </>
  );
}
