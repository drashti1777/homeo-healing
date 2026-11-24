"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Award, BookOpen, CalendarCheck, CheckCircle2, GraduationCap, HeartPulse, MapPin, Sparkles, Star, Stethoscope, Users } from "lucide-react";

export function DoctorSpotlight() {
  const [hoveredBtn, setHoveredBtn] = useState<"book" | "bio" | null>(null);
  const credentials = [
    {
      year: "2016",
      badge: "Post-Graduate Mastery",
      title: "M.D. in Repertory",
      institute: "Ahmedabad Homoeopathic Medical College (HNGU)",
      desc: "Advanced post-graduate clinical specialization in constitutional case analysis and repertory.",
      icon: Award,
    },
    {
      year: "2016",
      badge: "Advanced Fellowship",
      title: "Master Course in Advance Homoeopathy",
      institute: "The Other Song, Mumbai & MUHS Nashik",
      desc: "Trained under world-renowned homeopathy masters in advanced constitutional clinical methods.",
      icon: Stethoscope,
    },
    {
      year: "2017 – Present",
      badge: "Academic Leadership",
      title: "HOD & Associate Professor",
      institute: "Hom. Pharmacy, Shree Swaminarayan College, Kalol",
      desc: "Heading the Department of Pharmacy, mentoring doctors, and guiding evidence-informed practice.",
      icon: GraduationCap,
    },
    {
      year: "2011",
      badge: "Medical Degree",
      title: "B.H.M.S. Degree",
      institute: "Swami Vivekananda Homoeopathic Medical College, Bhavnagar",
      desc: "Solid foundational medical training in homeopathic therapeutics and clinical sciences.",
      icon: BookOpen,
    },
  ];

  return (
    <section className="section bg-sand-50/70 overflow-hidden pt-10 pb-14 lg:pt-14 lg:pb-18">
      <div className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Doctor Visual Side: Layered Luxury Bento Frame (Photo on LEFT, 5 of 12 columns, full width) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full lg:col-span-5"
          >
            {/* Ambient Background Glow */}
            <div
              aria-hidden="true"
              className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl -z-10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-forest-800/10 blur-3xl -z-10"
            />

            {/* Main Portrait Frame with Interactive Depth */}
            <div className="relative w-full">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-sage-50 shadow-2xl shadow-forest-900/15 border border-forest-800/10">
                <Image
                  src="/gallery/doc.webp"
                  alt="Dr. Neeta Parmar - Chief Homoeopathic Consultant"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent"
                />

                {/* Floating Top-Left Experience Badge */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-1.5 text-xs font-bold text-forest-950 backdrop-blur-md shadow-lg shadow-forest-900/15 border border-white/40"
                >
                  <Star className="size-3.5 fill-emerald-500 text-emerald-500" />
                  <span>15+ Years Clinical Care</span>
                </motion.div>

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
          </motion.div>

          {/* Details Side: Bento Matrix Layout (Text & Credentials on RIGHT, 7 of 12 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 w-full lg:col-span-7"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-300">
                <Sparkles className="size-3.5" />
                <span>Meet Your Consultant</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
                Compassionate Care Backed by 15+ Years of Academic &amp; Clinical Mastery
              </h2>
            </div>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              Dr. Neeta Parmar is the Chief Homoeopathic Consultant at <strong>Dr. Neeta&apos;s Homeo Health Care</strong> (Bhavnagar) and Homeo Health Care &amp; Pharmacy (Ahmedabad). Combining classical homeopathy principles with contemporary scientific analysis, she delivers precise constitutional treatment for long-lasting health.
            </p>

            {/* Bento Credentials Grid */}
            <div className="grid gap-3.5 sm:grid-cols-2 pt-2">
              {credentials.map((c) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={c.title}
                    whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
                    className="group relative rounded-2xl p-4.5 transition-all duration-300 bg-white text-forest-950 border border-forest-800/10 shadow-sm hover:bg-forest-900 hover:text-white hover:border-forest-800 hover:shadow-xl hover:shadow-forest-900/20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex size-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-500/20 group-hover:text-emerald-300">
                        <Icon className="size-4.5" />
                      </div>
                      <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 bg-sage-100 text-forest-800 group-hover:bg-emerald-400 group-hover:text-forest-950">
                        {c.year}
                      </span>
                    </div>

                    <h4 className="font-serif text-sm sm:text-base font-bold leading-snug transition-colors duration-300 text-forest-950 group-hover:text-white">
                      {c.title}
                    </h4>
                    <p className="text-xs mt-1 font-medium transition-colors duration-300 text-emerald-700 group-hover:text-emerald-200">
                      {c.institute}
                    </p>
                    <p className="text-xs mt-1.5 leading-relaxed transition-colors duration-300 text-ink-soft group-hover:text-white/80">
                      {c.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3">
              <Link
                href="/book-appointment"
                onMouseEnter={() => setHoveredBtn("book")}
                onMouseLeave={() => setHoveredBtn(null)}
                className={`peer group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer text-center ${
                  hoveredBtn === "book" || hoveredBtn === "bio"
                    ? "border border-forest-800/20 bg-white text-forest-800 shadow-sm -translate-y-0.5"
                    : "border border-transparent bg-emerald-500 text-forest-950 shadow-lg shadow-emerald-500/25 hover:border-forest-800/20 hover:bg-white hover:text-forest-800 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
                }`}
              >
                <CalendarCheck className={`size-4 shrink-0 transition-colors ${hoveredBtn === "book" || hoveredBtn === "bio" ? "text-forest-800" : "text-forest-950 group-hover:text-forest-800"}`} />
                <span>Book Consultation</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 shrink-0" />
              </Link>
              <Link
                href="/about"
                onMouseEnter={() => setHoveredBtn("bio")}
                onMouseLeave={() => setHoveredBtn(null)}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer text-center ${
                  hoveredBtn === "book" || hoveredBtn === "bio"
                    ? "border border-emerald-500 bg-emerald-500 text-forest-950 shadow-lg shadow-emerald-500/25 -translate-y-0.5"
                    : "border border-forest-800/20 bg-white text-forest-800 shadow-sm peer-hover:border-emerald-500 peer-hover:bg-emerald-500 peer-hover:text-forest-950 peer-hover:shadow-lg peer-hover:shadow-emerald-500/25 peer-hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-500 hover:text-forest-950 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:bg-emerald-600 active:text-forest-950 active:scale-95 active:translate-y-0"
                }`}
              >
                <span>Read Full Biography</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
