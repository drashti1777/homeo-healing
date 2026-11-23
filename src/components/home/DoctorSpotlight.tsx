"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Award, BookOpen, CheckCircle, GraduationCap, Heart, Stethoscope } from "lucide-react";

export function DoctorSpotlight() {
  const credentials = [
    { year: "2011", title: "BHMS Degree", institute: "Swami Vivekananda Homoeopathic Medical College, Bhavnagar" },
    { year: "2016", title: "M.D. in Repertory", institute: "Ahmedabad Homoeopathic Medical College (HNGU)" },
    { year: "2016", title: "Master Course in Advance Homoeopathy", institute: "The Other Song, Mumbai & MUHS Nashik" },
    { year: "2017 – Present", title: "HOD & Associate Professor", institute: "Hom. Pharmacy, Shree Swaminarayan College, Kalol" },
  ];

  return (
    <section className="section bg-white overflow-hidden py-16 lg:py-24">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Doctor Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Frame */}
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
              {/* Decorative background shape */}
              <div
                aria-hidden="true"
                className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-full h-full rounded-[2.5rem] bg-sage-100 -z-10"
              />
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-sage-50 shadow-xl shadow-forest-900/10">
                <Image
                  src="/gallery/doc.webp"
                  alt="Dr. Neeta Parmar - Chief Homoeopathic Consultant"
                  fill
                  sizes="(min-width: 1024px) 26rem, 90vw"
                  className="object-cover object-top"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent"
                />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                    Chief Consultant
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-white">Dr. Neeta Parmar</h3>
                  <p className="text-xs text-white/90">B.H.M.S., M.D. (Repertory), PGDHHM</p>
                </div>
              </div>
            </div>

            {/* Second Image Badge (Consultation preview) */}
            <div className="hidden sm:block absolute -bottom-6 -right-4 w-44 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white shadow-lg shadow-forest-900/15">
              <Image
                src="/gallery/indian-consultation.webp"
                alt="Dr. Neeta consulting a patient"
                fill
                sizes="11rem"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Details Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Meet Your Consultant
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
                Compassionate Care Backed by 15+ Years of Academic &amp; Clinical Mastery
              </h2>
            </div>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Dr. Neeta Parmar is the Chief Homoeopathic Consultant at <strong>Dr. Neeta&apos;s Homeo Health Care</strong> (Bhavnagar) and Homeo Health Care &amp; Pharmacy (Ahmedabad). Combining classical homeopathy principles with contemporary scientific analysis, she delivers precise constitutional treatment for long-lasting health.
            </p>

            {/* Credentials Grid */}
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              {credentials.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-forest-800/10 bg-sage-50/50 p-4 transition-colors hover:border-forest-800/20 hover:bg-sage-50"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{c.year}</span>
                  </div>
                  <h4 className="mt-1 font-serif text-sm font-semibold text-forest-950">{c.title}</h4>
                  <p className="text-xs text-ink-soft mt-0.5">{c.institute}</p>
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-forest-800/20 transition-all hover:bg-forest-900 hover:-translate-y-0.5"
              >
                <span>Read Full Biography</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-2 rounded-full border border-forest-800/20 bg-white px-6 py-3 text-sm font-semibold text-forest-800 transition-all hover:border-forest-800 hover:bg-sage-50"
              >
                <span>Book Consultation</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
