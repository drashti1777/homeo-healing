"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, HeartHandshake, Leaf, ShieldAlert, Sparkles, Zap } from "lucide-react";

const REASONS = [
  {
    num: "01",
    title: "Root-Cause Eradication",
    desc: "Instead of temporarily suppressing outward symptoms with heavy chemical sedatives, homoeopathy addresses the underlying constitutional triggers.",
  },
  {
    num: "02",
    title: "Zero Adverse Side Effects",
    desc: "Non-toxic micro-dilutions ensure gentle healing that is completely safe for infants, young children, pregnant women, and elderly patients.",
  },
  {
    num: "03",
    title: "Permanent Immunity Enhancement",
    desc: "By stimulating the body's natural defense force, treatments reduce recurring allergies, seasonal infections, and chronic relapses.",
  },
  {
    num: "04",
    title: "Holistic Mind-Body Assessment",
    desc: "Care plans evaluate emotional stress, dietary habits, sleep cycles, and daily lifestyle factors for truly personalized healing.",
  },
];

export function WhyHomeopathySection() {
  return (
    <section className="section bg-beige-100/70 py-16 lg:py-24 overflow-hidden">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Image of Indian Family Health */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-forest-800 to-forest-600 p-2 shadow-xl shadow-forest-900/10">
              <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden rounded-[2.2rem] bg-sage-100">
                <Image
                  src="/gallery/indian-family-health.webp"
                  alt="Happy healthy Indian multi-generational family enjoying natural vitality"
                  fill
                  sizes="(min-width: 1024px) 26rem, 90vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent"
                />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Trusted by Generations
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                    Gentle Care for Every Stage of Life
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Reasons List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Natural Medicine
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
                Why Thousands Choose Homoeopathy Over Temporary Relief
              </h2>
            </div>

            <div className="space-y-4 pt-2">
              {REASONS.map((r, i) => (
                <div
                  key={r.num}
                  className="flex gap-4 rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm transition-all hover:border-forest-800/20 hover:shadow-md"
                >
                  <span className="font-serif text-xl font-bold text-emerald-600 shrink-0">
                    {r.num}
                  </span>
                  <div>
                    <h4 className="font-serif text-base font-bold text-forest-950">
                      {r.title}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-ink-soft leading-relaxed">
                      {r.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-forest-800/20 transition-all hover:bg-forest-900 hover:-translate-y-0.5"
              >
                <span>Request Appointment Today</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
