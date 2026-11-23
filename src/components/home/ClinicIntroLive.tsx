"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, HeartPulse, Sparkles } from "lucide-react";

export function ClinicIntroLive() {
  return (
    <section className="section bg-white py-16 lg:py-24">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Image of Doctor Consultation */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-forest-800 to-forest-600 p-2 shadow-xl shadow-forest-900/10">
              <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden rounded-[2.2rem] bg-sage-100">
                <Image
                  src="/gallery/indian-consultation.webp"
                  alt="Dr. Neeta's Homeo Health Care - Consultation"
                  fill
                  sizes="(min-width: 1024px) 26rem, 90vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent"
                />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                    Holistic Healing
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                    Dr. Neeta&apos;s Homeo Health Care
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Exact Line-to-Line Text from Live Site */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
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
