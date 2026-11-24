import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, CalendarCheck, CheckCircle2, ChevronRight, GraduationCap, HeartHandshake, MapPin, Phone, Sparkles, Star, Stethoscope, UserCheck } from "lucide-react";
import { BestShowcase, type BestTab } from "@/components/BestShowcase";
import { entriesFor } from "@/components/DoctorSections";
import { JourneyTimeline, type JourneyItem } from "@/components/JourneyTimeline";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { AboutDoctorButtons } from "@/components/AboutDoctorButtons";
import { CtaLink, PageHero, SectionHeading } from "@/components/ui";
import { BRAND, CLINIC, CLINIC_INTRO, GALLERY, TAGLINE, TESTIMONIALS, TESTIMONIALS_INTRO } from "@/content/clinic";
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

  const highlights = [
    {
      icon: GraduationCap,
      title: "M.D. in Repertory (2016)",
      desc: "Ahmedabad Homoeopathic Medical College (HNGU). Advanced case analysis & constitutional similimum.",
    },
    {
      icon: Stethoscope,
      title: "15+ Years Clinical Care",
      desc: "Founded Dr. Neeta's Homeo Health Care in Bhavnagar & Homeo Health Care in Ahmedabad.",
    },
    {
      icon: BookOpen,
      title: "HOD & Associate Professor",
      desc: "Teaching faculty in Homoeopathic Pharmacy at Shree Swaminarayan Medical College since 2017.",
    },
    {
      icon: Award,
      title: "Advanced Masters Training",
      desc: "The Other Song Academy (Mumbai) & MUHS Nashik certificate course in advanced homoeopathy.",
    },
  ];

  return (
    <>
      <PageHero eyebrow="About Us" title={`About ${BRAND}`} intro={TAGLINE} crumbs={[{ label: "About" }]} />

      {/* 1. Welcome & Doctor Credentials */}
      <section className="section overflow-hidden py-16 lg:py-24" aria-labelledby="welcome-heading">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Doctor Biography & Highlights */}
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
                <Sparkles className="size-3.5 text-emerald-600" />
                Chief Homoeopathic Consultant
              </span>
              <h2 id="welcome-heading" className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
                Compassionate Care Backed by 15+ Years of Clinical &amp; Academic Mastery
              </h2>
            </div>

            <p className="text-base sm:text-lg text-forest-900 font-semibold leading-relaxed">
              Dr. Neeta Parmar delivers classical constitutional homeopathy integrated with modern diagnostic analysis for whole-person healing.
            </p>

            <p className="text-base text-ink-soft leading-relaxed">
              She graduated from <strong>Swami Vivekananda Homoeopathic Medical College, Bhavnagar in 2011</strong>, and completed her post-graduation (M.D. in Repertory) at <strong>Ahmedabad Homoeopathic Medical College</strong>, affiliated with Hemchandracharya North Gujarat University, Patan, in June 2016.
            </p>

            {/* 4 Mini Highlight Cards */}
            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <div
                    key={h.title}
                    className="group relative rounded-2xl p-4 transition-all duration-300 bg-white text-forest-950 border border-forest-800/10 shadow-sm hover:bg-forest-900 hover:text-white hover:border-forest-800 hover:shadow-xl hover:shadow-forest-900/20 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 mb-2.5">
                      <Icon className="size-4.5" />
                    </div>
                    <h3 className="font-serif text-sm font-bold transition-colors duration-300 text-forest-950 group-hover:text-white leading-snug">{h.title}</h3>
                    <p className="mt-1 text-xs transition-colors duration-300 text-ink-soft group-hover:text-white/80 leading-relaxed">{h.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <AboutDoctorButtons />
          </div>

          {/* Right Column: Doctor Portrait Frame */}
          <div className="relative mx-auto w-full max-w-md sm:max-w-lg">
            {/* Ambient Background Glow */}
            <div
              aria-hidden="true"
              className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl -z-10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-forest-800/10 blur-3xl -z-10"
            />

            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-sage-50 shadow-2xl shadow-forest-900/15 border border-forest-800/10">
              <Image
                src={doctor?.photo || "/gallery/doc.webp"}
                alt={doctor?.photoAlt || doctor?.name || "Dr. Neeta Parmar - Chief Homoeopathic Consultant"}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent"
              />

              {/* Floating Top-Left Experience Badge */}
              <div className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-1.5 text-xs font-bold text-forest-950 backdrop-blur-md shadow-lg shadow-forest-900/15 border border-white/40">
                <Star className="size-3.5 fill-emerald-500 text-emerald-500" />
                <span>15+ Years Clinical Care</span>
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm">
                  <CheckCircle2 className="size-3" />
                  Chief Homoeopathic Consultant
                </span>
                <h3 className="mt-2.5 font-serif text-3xl font-bold text-white tracking-tight">
                  Dr. Neeta Parmar
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-emerald-200 font-medium">
                  B.H.M.S. · M.D. (Repertory) · P.G.D.H.H.M.
                </p>
                <p className="mt-1 text-xs text-white/80">
                  Bhavnagar (R.T.O Road) &amp; Ahmedabad (Motera)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Experience & Qualifications Timeline */}
      <section className="section relative overflow-hidden bg-sage-50/60 py-16 lg:py-24" aria-labelledby="journey-heading">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 size-[28rem] rounded-full bg-emerald-100/30 blur-3xl -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-20 size-[24rem] rounded-full bg-sage-100/40 blur-3xl -z-10" />
        <div className="wrap relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
              <GraduationCap className="size-3.5 text-emerald-600" />
              Clinical Milestones
            </span>
            <h2 id="journey-heading" className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
              Experience &amp; Qualifications
            </h2>
            <p className="mt-3 text-base text-ink-soft">
              Clinical practice, advanced postgraduate training, and academic faculty roles across Gujarat.
            </p>
          </div>
          <JourneyTimeline items={JOURNEY} />
        </div>
      </section>

      {/* 3. What Makes Us Best */}
      <section className="section relative overflow-hidden bg-white py-16 lg:py-24" aria-labelledby="best-heading">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 size-[30rem] rounded-full bg-emerald-100/30 blur-3xl -z-10" />
        <div className="wrap relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
              <Award className="size-3.5 text-emerald-600" />
              Clinical Excellence
            </span>
            <h2 id="best-heading" className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
              What Makes Our Practice Distinct
            </h2>
            <p className="mt-3 text-base text-ink-soft">
              Core clinical standards, multi-generational patient trust, and personalized constitutional evaluation.
            </p>
          </div>
          <BestShowcase tabs={WHAT_MAKES_US_BEST} />
        </div>
      </section>

      {/* 4. Patient's Testimonials (Modern Light & Crisp Styling) */}
      {reviews.length > 0 && (
        <section className="relative bg-sage-50/60 py-16 lg:py-24" aria-labelledby="about-testimonials-heading">
          <div className="wrap relative">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-300/60 shadow-xs">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Patient Stories
              </span>
              <h2 id="about-testimonials-heading" className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
                Patient&apos;s Testimonials
              </h2>
              <p className="mt-3 text-sm sm:text-base text-ink-soft">
                {TESTIMONIALS_INTRO}
              </p>
            </div>
            <div className="mt-12">
              <TestimonialSlider reviews={reviews} theme="light" />
            </div>
          </div>
        </section>
      )}

      {/* 5. Clinic photographs */}
      <section className="section py-16 lg:py-24 bg-white" aria-labelledby="clinic-photos-heading">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6 pb-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
                <Sparkles className="size-3.5 text-emerald-600" />
                Clinic Spaces
              </span>
              <h2 id="clinic-photos-heading" className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
                Inside Our Clinics
              </h2>
            </div>
            <CtaLink href="/gallery">Full gallery</CtaLink>
          </div>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredPhotos.map((img, i) => (
              <li
                key={img.src}
                className={`group relative overflow-hidden rounded-[2rem] bg-sage-100 shadow-md shadow-forest-900/5 border border-forest-800/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-forest-900/25 hover:border-emerald-500/40 cursor-pointer ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                />
                <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium text-forest-800 shadow-sm transition-all duration-300 group-hover:bg-forest-950/80 group-hover:text-emerald-300 group-hover:border-emerald-400/30">
                  {img.group}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. High-Impact Consultation Banner */}
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
