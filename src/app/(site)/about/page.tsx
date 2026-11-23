import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Phone } from "lucide-react";
import { BestShowcase, type BestTab } from "@/components/BestShowcase";
import { entriesFor } from "@/components/DoctorSections";
import { JourneyTimeline, type JourneyItem } from "@/components/JourneyTimeline";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { CtaLink, Disclaimer, PageHero, SectionHeading } from "@/components/ui";
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

const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

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
      { heading: "Mission", lines: [
        "As she understood in homoeopathy, every being is an individual, a unique creation and whole in itself.",
        "She wishes to practise in an unbiased manner, always listening attentively to the patient and reaching the similimum by unfolding the altered pattern in each case in a scientific and systematic way.",
      ] },
      { heading: "Vision", lines: [
        "To give relief of disease or problem and bring the patient to a healthy state by the best possible efforts, through homoeopathic remedies.",
        "To spread the awareness of the homoeopathic system of medicine at the maximum level.",
      ] },
    ],
  },
];

export default async function AboutPage() {
  const [doctor, settings, testimonials] = await Promise.all([getDoctor(), getSettings(), getTestimonials()]);
  const achievements = doctor?.entries.filter((e) => e.highlight) ?? [];
  // Approved testimonials from Admin take priority; otherwise the ones from the clinic's live site are shown.
  const reviews = testimonials.length > 0 ? testimonials.slice(0, 4) : TESTIMONIALS;
  const clinicPhotos = GALLERY.flatMap((g) => g.images.map((img) => ({ ...img, group: g.title })));
  const featuredPhotos = [clinicPhotos[0], clinicPhotos[6], clinicPhotos[8], clinicPhotos[1]].filter(Boolean);

  return (
    <>
      <PageHero eyebrow="About us" title={`About ${BRAND}`} intro={TAGLINE} crumbs={[{ label: "About" }]} />

      {/* Welcome About Her / Her Achievements (photo and text from the clinic's live About page) */}
      <section className="section overflow-hidden" aria-labelledby="welcome-heading">
        <div className="wrap grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="relative">
              <span aria-hidden="true" className="pointer-events-none absolute -top-6 left-0 select-none font-serif text-[clamp(3.5rem,8vw,6rem)] font-semibold leading-none text-forest-800/[0.07]">About Her</span>
              <h2 id="welcome-heading" data-split className="relative text-[clamp(2.6rem,6vw,4.5rem)] font-light">Welcome</h2>
              <p className="eyebrow relative mt-3" data-reveal>Her achievements</p>
            </div>
            <h3 className="mt-12 text-[clamp(1.4rem,2.4vw,1.9rem)] font-normal leading-snug" data-reveal>
              She has graduated from Swami Vivekananda Homoeopathic Medical College, Bhavnagar in 2011.
            </h3>
            <p className="mt-5 text-lg text-ink-soft" data-reveal>
              She has completed her post graduation at Ahmedabad Homeopathic Medical College, which is affiliated with Hemchandracharya North Gujarat University, Patan, in the special subject of Repertory, June 2016.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:mr-10 pb-6 pr-6 md:pb-8 md:pr-8">
            <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6 md:translate-x-8 md:translate-y-8 rounded-[2rem] bg-forest-800" />
            <div className="relative aspect-[748/736] overflow-hidden rounded-[2rem] bg-sage-100" data-clip>
              <Image src={doctor?.photo || "/gallery/doc.webp"} alt={doctor?.photoAlt || doctor?.name || "Dr. Neeta Parmar"} fill priority sizes="(min-width:1024px) 28rem, 90vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* About Homeo-Healing */}
      {/* <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow={CLINIC} title="Homoeopathic care in Bhavnagar and Ahmedabad" />
            {CLINIC_INTRO.map((p) => <p key={p} className="mt-5 text-lg text-ink-soft" data-reveal>{p}</p>)}
            <p className="mt-5 text-lg text-ink-soft" data-reveal>
              Consultations are offered at {CLINIC}, Bhavnagar, and at Homeo Health Care &amp; Pharmacy, Ahmedabad.
            </p>
          </div>
          <div className="relative grid grid-cols-5 gap-4 lg:col-span-6">
            <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[2rem] rounded-tl-[7rem]">
              <Image src={clinicPhotos[0].src} alt={clinicPhotos[0].alt} fill priority sizes="(min-width:1024px) 30vw, 60vw" data-parallax="0.06" className="scale-[1.18] object-cover" />
            </div>
            <div className="relative col-span-2 mt-20 aspect-[3/4] overflow-hidden rounded-[2rem] rounded-br-[5rem]">
              <Image src={clinicPhotos[7].src} alt={clinicPhotos[7].alt} fill sizes="(min-width:1024px) 20vw, 40vw" data-parallax="0.1" className="scale-[1.2] object-cover" />
            </div>
          </div>
        </div>
      </section> */}

      {doctor ? (
        <>
          {/* Her journey: same 6 entries, order and wording as the clinic's live About page timeline.
              The two education entries (2011, 2016) are in the "Welcome About Her" section above, as on the live page. */}
          <section className="section relative overflow-hidden bg-gradient-to-b from-paper via-sage-50 to-paper" aria-labelledby="journey-heading">
            <div aria-hidden="true" className="float-slow absolute -right-40 top-20 size-[28rem] rounded-full bg-sage-200/40 blur-3xl" />
            <div aria-hidden="true" className="float absolute -left-40 bottom-20 size-[24rem] rounded-full bg-beige-100 blur-3xl" />
            <div className="wrap relative">
              <div className="mx-auto max-w-2xl text-center">
                <p className="eyebrow mb-5 justify-center" data-reveal>Her achievements</p>
                <h2 id="journey-heading" data-split className="text-[clamp(2rem,4.6vw,3.25rem)] font-normal">Experience &amp; qualifications</h2>
                <p className="mt-5 text-ink-soft" data-reveal>Clinical practice, advanced training and teaching, as listed by the clinic.</p>
              </div>
              <JourneyTimeline items={JOURNEY} />
            </div>
          </section>

          {/* Achievements: entries the clinic has marked as highlights
          {achievements.length > 0 && (
            <section className="section bg-forest-900 text-paper">
              <div className="wrap">
                <p className="eyebrow mb-5 !text-sage-300" data-reveal>Achievements</p>
                <h2 data-split className="max-w-3xl !text-paper text-[clamp(2rem,4.6vw,3.25rem)] font-normal">Milestones in her practice</h2>
                <ul className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((a, i) => (
                    <li key={`${a.year}-${a.title}`} className="bg-forest-900 p-8 transition-colors duration-500 hover:bg-forest-800" data-reveal data-delay={(i % 3) * 0.08}>
                      <Award className="size-6 text-sage-400" aria-hidden="true" />
                      {a.year && <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-sage-400">{a.year}</p>}
                      <h3 className="mt-2 text-xl font-normal !text-paper">{a.title}</h3>
                      {a.institution && <p className="mt-2 text-sm text-sage-200">{a.institution}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )} */}

          {/* What Makes Us Best (from the clinic's live About page): tabs + image per tab. The live page has no
              description for "Medicine Services", so only the title is shown for it. */}
          <section className="section relative overflow-hidden bg-sage-50" aria-labelledby="best-heading">
            <div aria-hidden="true" className="float-slow absolute -left-40 -top-24 size-[30rem] rounded-full bg-sage-200/50 blur-3xl" />
            <div className="wrap relative">
              <div className="mx-auto max-w-2xl text-center">
                <p className="eyebrow mb-5 justify-center" data-reveal>Why our clinic</p>
                <h2 id="best-heading" data-split className="text-[clamp(2rem,4.6vw,3.25rem)] font-normal">What Makes Us Best</h2>
              </div>
              <BestShowcase tabs={WHAT_MAKES_US_BEST} />
            </div>
          </section>

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
        </>
      ) : (
        <section className="section bg-beige-100">
          <div className="wrap-narrow text-center">
            <h2 className="text-3xl font-normal">Doctor profile coming soon</h2>
            <p className="mt-4 text-ink-soft">The doctor&apos;s verified profile will be published here. You are welcome to contact the clinic with any questions.</p>
            <Link href="/contact" className="btn btn-ghost mt-8">Contact the clinic</Link>
          </div>
        </section>
      )}

      {/* Patient's Testimonials (also on the clinic's live About page) */}
      {reviews.length > 0 && (
        <section className="relative overflow-hidden bg-forest-900 py-12 text-paper md:py-16" aria-labelledby="about-testimonials-heading">
          <div aria-hidden="true" className="float-slow absolute -left-32 -top-32 size-[26rem] rounded-full bg-forest-700/40 blur-2xl" />
          <div className="wrap relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow mb-3 justify-center !text-sage-300" data-reveal>Patient experiences</p>
              <h2 id="about-testimonials-heading" data-split className="!text-paper text-[clamp(1.75rem,3.6vw,2.5rem)] font-normal">Patient&apos;s Testimonials</h2>
              <p className="mt-3 text-sm text-sage-200" data-reveal>{TESTIMONIALS_INTRO}</p>
            </div>
            <div className="mt-8"><TestimonialSlider reviews={reviews} /></div>
          </div>
        </section>
      )}

      {/* Clinic photographs */}
      <section className="section">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Clinic photographs" title="Inside the clinic" />
            <CtaLink href="/gallery">Full gallery</CtaLink>
          </div>
          <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredPhotos.map((img, i) => (
              <li key={img.src} className={`group relative overflow-hidden rounded-[1.75rem] bg-sage-100 ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`} data-reveal data-delay={i * 0.08}>
                <Image src={img.src} alt={img.alt} fill sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"} className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105" />
                <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium text-forest-800">{img.group}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Appointment CTA
      <section className="section relative overflow-hidden bg-forest-900 text-paper">
        <div aria-hidden="true" className="float-slow absolute -left-32 -bottom-32 size-[28rem] rounded-full bg-forest-700/40 blur-2xl" />
        <div className="wrap relative max-w-3xl text-center">
          <h2 data-split className="!text-paper text-[clamp(2.2rem,5vw,4rem)] font-normal">Book a consultation with Dr. Neeta</h2>
          <p className="mx-auto mt-6 max-w-xl text-sage-200" data-reveal>
            Send an appointment request and the clinic will contact you to confirm a time. A request is not a confirmed booking.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4" data-reveal>
            <Link href="/book-appointment" className="btn btn-light">Request an appointment <ArrowRight className="size-4" aria-hidden="true" /></Link>
            {settings.phone && <a href={telHref(settings.phone)} className="btn btn-outline-light"><Phone className="size-4" aria-hidden="true" /> {settings.phone}</a>}
          </div>
        </div>
      </section>

      <div className="wrap py-10"><Disclaimer /></div> */}
    </>
  );
}
