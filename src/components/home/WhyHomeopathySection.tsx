"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Heart, Leaf, ShieldCheck, Sparkles } from "lucide-react";

export function WhyHomeopathySection() {
  return (
    <section className="section bg-sand-50/70 py-16 lg:py-24 overflow-hidden">
      <div className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left Column: Image of Indian Family Health (Equal 50% Width, Clean Borderless Frame with Smooth Hover Animation) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative group w-full"
          >
            <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] w-full overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-sage-100 shadow-2xl shadow-forest-900/10 border border-forest-900/5">
              <Image
                src="/gallery/indian-family-health.webp"
                alt="Happy healthy Indian multi-generational family enjoying natural vitality"
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
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-5 right-5 z-10 inline-flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-1.5 text-xs font-bold text-forest-950 backdrop-blur-md shadow-lg shadow-forest-900/15"
              >
                <Leaf className="size-3.5 text-emerald-600" />
                <span>100% Gentle &amp; Safe</span>
              </motion.div>

              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-md"
                >
                  <span className="size-1.5 rounded-full bg-white animate-ping" />
                  <span>Holistic Medicine</span>
                </motion.span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                  Permanent Cure for the Whole Person
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Original content from index.php (Equal 50% Width) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6 w-full"
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

            {/* Highlighted Quote Box from index.php with subtle floating animation */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border-l-4 border-emerald-500 bg-white p-5 shadow-md shadow-forest-900/5 transition-shadow hover:shadow-lg"
            >
              <p className="text-sm sm:text-base font-semibold text-forest-950 leading-relaxed">
                “Homeopathic medicines are widely acceptable because it is suitable for all age group from pediatric to geriatric and it&apos;s sweet taste which gives attraction &amp; acceptance towards this medicines.”
              </p>
            </motion.div>

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
