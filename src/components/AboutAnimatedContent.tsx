"use client";

import Image from "next/image";
import { motion, useReducedMotion, type TargetAndTransition } from "motion/react";
import { Award, BookOpen, CheckCircle2, GraduationCap, Sparkles, Star, Stethoscope } from "lucide-react";
import { BestShowcase, type BestTab } from "@/components/BestShowcase";
import { JourneyTimeline, type JourneyItem } from "@/components/JourneyTimeline";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { AboutDoctorButtons } from "@/components/AboutDoctorButtons";
import { CtaLink } from "@/components/ui";
import { TESTIMONIALS_INTRO } from "@/content/clinic";
import type { DoctorDoc } from "@/lib/data";

export type FeaturedPhoto = {
  src: string;
  alt: string;
  group: string;
};

export type ReviewItem = {
  name: string;
  location?: string;
  quote: string;
};

interface AboutAnimatedContentProps {
  doctor: DoctorDoc | null;
  reviews: ReviewItem[];
  featuredPhotos: FeaturedPhoto[];
  journey: JourneyItem[];
  whatMakesUsBest: BestTab[];
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function AboutAnimatedContent({
  doctor,
  reviews,
  featuredPhotos,
  journey,
  whatMakesUsBest,
}: AboutAnimatedContentProps) {
  const reduce = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduce
      ? { initial: false, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.6, delay, ease: EASE_OUT },
        };

  const slideLeft = (delay = 0) =>
    reduce
      ? { initial: false, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, x: -30 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.7, delay, ease: EASE_OUT },
        };

  const slideRight = (delay = 0) =>
    reduce
      ? { initial: false, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, x: 30 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.7, delay, ease: EASE_OUT },
        };

  const pulseAnimation: TargetAndTransition | undefined = reduce
    ? undefined
    : {
        scale: [1, 1.08, 1],
        opacity: [0.5, 0.75, 0.5],
        transition: {
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

  const floatAnimation: TargetAndTransition | undefined = reduce
    ? undefined
    : {
        y: [0, -6, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

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
      {/* 1. Welcome & Doctor Credentials */}
      <section className="section overflow-hidden py-16 lg:py-24" aria-labelledby="welcome-heading">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Doctor Biography & Highlights */}
          <motion.div {...slideLeft(0)} className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
                <Sparkles className="size-3.5 text-emerald-600 animate-pulse" />
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

            {/* 4 Mini Highlight Cards with Stagger & Hover Animation */}
            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <motion.div
                    key={h.title}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.1, ease: EASE_OUT }}
                    whileHover={reduce ? undefined : { y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                    className="group relative rounded-2xl p-4 transition-all duration-300 bg-white text-forest-950 border border-forest-800/10 shadow-sm hover:bg-forest-900 hover:text-white hover:border-forest-800 hover:shadow-xl hover:shadow-forest-900/20 cursor-pointer"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 mb-2.5">
                      <Icon className="size-4.5" />
                    </div>
                    <h3 className="font-serif text-sm font-bold transition-colors duration-300 text-forest-950 group-hover:text-white leading-snug">{h.title}</h3>
                    <p className="mt-1 text-xs transition-colors duration-300 text-ink-soft group-hover:text-white/80 leading-relaxed">{h.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <motion.div {...fadeUp(0.2)}>
              <AboutDoctorButtons />
            </motion.div>
          </motion.div>

          {/* Right Column: Doctor Portrait Frame with Ambient Depth & Subtle Floating Badge */}
          <motion.div {...slideRight(0.1)} className="relative mx-auto w-full max-w-md sm:max-w-lg">
            {/* Ambient Background Glow with Subtle Breathing Animation */}
            <motion.div
              aria-hidden="true"
              animate={pulseAnimation}
              className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl -z-10 pointer-events-none"
            />
            <motion.div
              aria-hidden="true"
              animate={pulseAnimation}
              className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-forest-800/10 blur-3xl -z-10 pointer-events-none"
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
                className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent pointer-events-none"
              />

              {/* Floating Top-Left Experience Badge */}
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.85, y: -10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                animate={floatAnimation}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-1.5 text-xs font-bold text-forest-950 backdrop-blur-md shadow-lg shadow-forest-900/15 border border-white/40"
              >
                <Star className="size-3.5 fill-emerald-500 text-emerald-500" />
                <span>15+ Years Clinical Care</span>
              </motion.div>

              {/* Bottom Overlay Info */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute bottom-6 left-6 right-6 text-white z-10"
              >
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Experience & Qualifications Timeline */}
      <section className="section relative overflow-hidden bg-sage-50/60 py-16 lg:py-24" aria-labelledby="journey-heading">
        <motion.div
          aria-hidden="true"
          animate={pulseAnimation}
          className="pointer-events-none absolute -right-40 top-20 size-[28rem] rounded-full bg-emerald-100/30 blur-3xl -z-10"
        />
        <motion.div
          aria-hidden="true"
          animate={pulseAnimation}
          className="pointer-events-none absolute -left-40 bottom-20 size-[24rem] rounded-full bg-sage-100/40 blur-3xl -z-10"
        />
        <div className="wrap relative">
          <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
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
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <JourneyTimeline items={journey} />
          </motion.div>
        </div>
      </section>

      {/* 3. What Makes Us Best */}
      <section className="section relative overflow-hidden bg-white py-16 lg:py-24" aria-labelledby="best-heading">
        <motion.div
          aria-hidden="true"
          animate={pulseAnimation}
          className="pointer-events-none absolute -left-40 -top-24 size-[30rem] rounded-full bg-emerald-100/30 blur-3xl -z-10"
        />
        <div className="wrap relative">
          <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
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
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <BestShowcase tabs={whatMakesUsBest} />
          </motion.div>
        </div>
      </section>

      {/* 4. Patient's Testimonials */}
      {reviews.length > 0 && (
        <section className="relative bg-sage-50/60 py-16 lg:py-24" aria-labelledby="about-testimonials-heading">
          <div className="wrap relative">
            <motion.div {...fadeUp(0)} className="mx-auto max-w-2xl text-center">
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
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="mt-12">
              <TestimonialSlider reviews={reviews} theme="light" />
            </motion.div>
          </div>
        </section>
      )}

      {/* 5. Clinic photographs */}
      <section className="section py-16 lg:py-24 bg-white" aria-labelledby="clinic-photos-heading">
        <div className="wrap">
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-end justify-between gap-6 pb-10">
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
          </motion.div>
          <motion.ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredPhotos.map((img, i) => (
              <motion.li
                key={img.src}
                initial={reduce ? false : { opacity: 0, y: 25, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.1, ease: EASE_OUT }}
                whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25 } }}
                className={`group relative overflow-hidden rounded-[2rem] bg-sage-100 shadow-md shadow-forest-900/5 border border-forest-800/10 transition-shadow duration-300 hover:shadow-2xl hover:shadow-forest-900/25 hover:border-emerald-500/40 cursor-pointer ${
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
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </>
  );
}
