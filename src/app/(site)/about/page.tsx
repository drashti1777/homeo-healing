import { type BestTab } from "@/components/BestShowcase";
import { entriesFor } from "@/components/DoctorSections";
import { type JourneyItem } from "@/components/JourneyTimeline";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { PageHero } from "@/components/ui";
import { AboutAnimatedContent } from "@/components/AboutAnimatedContent";
import { BRAND, GALLERY, TAGLINE, TESTIMONIALS } from "@/content/clinic";
import { getDoctor, getSettings, getTestimonials } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({
    path: "/about",
    title: "About Us | Dr. Neeta Parmar, Homoeopathic Consultant",
    description: "About Homeo-Healing and Dr. Neeta Parmar: education, post-graduation in Repertory, advanced homoeopathy training, clinical and teaching experience in Bhavnagar and Ahmedabad.",
  });

/** Source: live About page timeline, original wording with spelling fixes, in the same order. */
const JOURNEY: JourneyItem[] = [
  { icon: "Stethoscope", title: "Chief Homeo Consultant", year: "Present", text: "She is a chief homoeopathic consultant at 1) Dr Neeta's Homoeo Health Care at Bhavnagar 2) Homeo Health Care & Pharmacy at Ahmedabad." },
  { icon: "Award", title: "Advance Homeopathy", year: "2016", text: "She has been awarded the degree of Certificate Course in Advance Homoeopathy by Maharashtra University of Health Sciences, Nashik, Maharashtra." },
  { icon: "GraduationCap", title: "Masters of Homeopathy", year: "2016 July", text: "Along with that she has gone through training with Masters of Homoeopathy at The Other Song – International Academy of Advanced Homoeopathy, Mumbai for six months duration, and received the Certificate of Master Course in Advance Homoeopathy." },
  { icon: "Hospital", title: "Visiting Homeo Consultant", year: "2017", text: "She had worked as a visiting homoeopathic consultant at Jivraj Mehta Hospital, Ahmedabad." },
  { icon: "ClipboardList", title: "PCHM", year: "2014", text: "She has acquired administrative excellence after pursuing her PCHM (Post Graduate Certificate Course in Hospital Management) and healthcare management from New Delhi." },
  { icon: "Presentation", title: "Teaching Faculty", year: "Present", text: "Recently she is rendering her service as a teaching faculty (HOD & Associate Professor) in the department of Homoeopathic Pharmacy at Shree Swaminarayan Homoeopathy Medical College, Kalol (Gujarat) since July 2017." },
];

/**
 * Source: live About page, "What Makes Us Best" tabs, with the same image per tab (assets/img/service-item-img*.webp).
 * Mission & Vision: live wording with grammar fixes.
 */
const WHAT_MAKES_US_BEST: BestTab[] = [
  { icon: "Pill", title: "Medicine Services", image: "/gallery/best-medicine-services.webp", imageAlt: "Homeopathy medicine bottles and pills on a wooden table" },
  { icon: "Stethoscope", title: "Practice Experience", image: "/gallery/best-practice-experience.webp", imageAlt: "Doctors at work in the clinic" },
  { icon: "Award", title: "Achievements", image: "/gallery/best-achievements.webp", imageAlt: "Dr. Neeta Parmar at her consultation desk" },
  {
    icon: "Target", title: "Vision & Mission", image: "/gallery/best-vision-mission.webp", imageAlt: "Medicines being prepared in the clinic dispensary",
    blocks: [
      {
        heading: "Mission", lines: [
          "As she understood in homoeopathy, every being is an individual, a unique creation and whole in itself.",
          "She wishes to practise in an unbiased manner, always listening attentively to the patient and reaching the similimum by unfolding the altered pattern in each case in a scientific and systematic way.",
        ]
      },
      {
        heading: "Vision", lines: [
          "To give relief of disease or problem and bring the patient to a healthy state by the best possible efforts, through homoeopathic remedies.",
          "To spread the awareness of the homoeopathic system of medicine at the maximum level.",
        ]
      },
    ],
  },
];

export default async function AboutPage() {
  const [doctor, settings, testimonials] = await Promise.all([getDoctor(), getSettings(), getTestimonials()]);
  const reviews = testimonials.length > 0 ? testimonials.slice(0, 5) : TESTIMONIALS;
  const clinicPhotos = GALLERY.flatMap((g) => g.images.map((img) => ({ ...img, group: g.title })));
  const featuredPhotos = [clinicPhotos[0], clinicPhotos[6], clinicPhotos[8], clinicPhotos[1]].filter(Boolean);

  return (
    <>
      <PageHero eyebrow="About Us" title={`About ${BRAND}`} intro={TAGLINE} crumbs={[{ label: "About" }]} />

      <AboutAnimatedContent
        doctor={doctor}
        reviews={reviews}
        featuredPhotos={featuredPhotos}
        journey={JOURNEY}
        whatMakesUsBest={WHAT_MAKES_US_BEST}
      />

      <ConsultationCta />

      {doctor && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString([
              {
                "@context": "https://schema.org",
                "@type": "Physician",
                name: doctor.name,
                url: `${SITE_URL}/about`,
                medicalSpecialty: "Homeopathic",
                ...(doctor.photo && { image: doctor.photo.startsWith("http") ? doctor.photo : `${SITE_URL}${doctor.photo}` }),
                alumniOf: entriesFor(doctor, "education").map((e) => e.institution).filter(Boolean),
                worksFor: { "@id": `${SITE_URL}/#clinic` },
              },
              breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
            ]),
          }}
        />
      )}
    </>
  );
}
