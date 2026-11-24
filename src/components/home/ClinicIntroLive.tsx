"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, HeartPulse, Sparkles } from "lucide-react";

export function ClinicIntroLive() {
  return (
    <section className="section bg-white pt-12 pb-6 lg:pt-16 lg:pb-8">
      <div className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left Column: Image of Doctor Consultation (Equal 50% Width, Clean Borderless Frame with Smooth Hover Animation) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative group w-full"
          >
            <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] w-full overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-sage-100 shadow-2xl shadow-forest-900/10 border border-forest-900/5">
              <Image
                src="/gallery/indian-consultation.webp"
                alt="Dr. Neeta's Homeo Health Care - Consultation"
                fill
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent"
              />

              {/* Floating Top-Right Animated Badge */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-5 right-5 z-10 inline-flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-1.5 text-xs font-bold text-forest-950 backdrop-blur-md shadow-lg shadow-forest-900/15"
              >
                <Sparkles className="size-3.5 text-emerald-600" />
                <span>Personalized Care</span>
              </motion.div>

              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-md"
                >
                  <span className="size-1.5 rounded-full bg-white animate-ping" />
                  <span>Holistic Healing</span>
                </motion.span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                  Dr. Neeta&apos;s Homeo Health Care
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Exact Line-to-Line Text from Live Site (Equal 50% Width) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6 w-full"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Dr. Neeta&apos;s Homeo Health Care
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
                Yes! Homeopathy treatment is highly effective.
              </h2>
            </div>

            <div className="space-y-4 text-base sm:text-lg text-ink-soft leading-relaxed">
              <p className="font-semibold text-forest-900">
                Want to know why? Because it boosts immune system and body’s healing power.
              </p>
              <p>
                The aspect which makes Homeopathy different from other conventional medications is its way of treatment. A Homeopathy doctor understands the personality and emotions of the patient for knowing the complete nature of his body.
              </p>
              <p>
                The main goal of this treatment is to cure the complete body, instead of emphasizing on any single problem.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/book-appointment"
                className="group inline-flex items-center gap-2.5 rounded-full bg-forest-800 px-8 py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-forest-800/20 transition-all hover:bg-forest-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Booked an appointment</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
