"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Heart, Leaf, ShieldCheck, Sparkles } from "lucide-react";

export function WhyHomeopathySection() {
  return (
    <section className="section bg-sage-50/60 py-16 lg:py-24 overflow-hidden border-t border-forest-800/10">
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
                    Holistic Medicine
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                    Permanent Cure for the Whole Person
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Original content from index.php */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Gentle &amp; Proven
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
                Why to go with HOMEOPATHY
              </h2>
              <h4 className="mt-2 text-base sm:text-lg font-medium text-forest-800">
                Homeopathic medicines are safe and acting very gently!
              </h4>
            </div>

            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              It is proven that it has no side effect as well no interaction with any other pathy like modern medicine. Homeopathy is a science in which we are giving medicine which affects the whole person not a single disease/problem. In many disease only modern medicine gives just temporary relief on the other hand homeopathy medicine are best work in reversible diseases and gives permanent cure...
            </p>

            {/* Highlighted Quote Box from index.php */}
            <div className="rounded-2xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
              <p className="text-sm sm:text-base font-semibold text-forest-950 leading-relaxed">
                “Homeopathic medicines are widely acceptable because it is suitable for all age group from pediatric to geriatric and it&apos;s sweet taste which gives attraction &amp; acceptance towards this medicines.”
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/treatments"
                className="group inline-flex items-center gap-2.5 rounded-full bg-forest-800 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md shadow-forest-800/20 transition-all hover:bg-forest-900 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>View Treatments</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
