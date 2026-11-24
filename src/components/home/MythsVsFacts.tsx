"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Zap,
  Activity,
  Heart,
} from "lucide-react";

export function MythsVsFacts() {
  const conditions = [
    { name: "Diabetes", category: "Metabolic" },
    { name: "Thyroid", category: "Endocrine" },
    { name: "Women Health", category: "Gynecology" },
    { name: "Arthritis", category: "Joints" },
    { name: "Infertility", category: "Specialty" },
    { name: "Sinusitis", category: "ENT" },
    { name: "Hypertension", category: "Cardio" },
    { name: "Hair & Skin", category: "Dermatology" },
    { name: "Allergy", category: "Immunity" },
    { name: "Asthma", category: "Respiratory" },
    { name: "Migraine", category: "Neurology" },
    { name: "Spondylitis", category: "Spine" },
    { name: "Children Diseases", category: "Pediatric" },
  ];

  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-white via-sand-50/50 to-white py-16 lg:py-24">
      {/* Subtle Background Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-sage-100/50 blur-3xl -z-10"
      />

      <div className="wrap">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800 shadow-sm"
          >
            <Sparkles className="size-3.5 text-emerald-600 animate-pulse" />
            <span>Truth &amp; Awareness</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 tracking-tight"
          >
            Myths &amp; Facts About <span className="text-emerald-700 italic">Homeopathy</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-base sm:text-lg font-medium text-forest-800/90 max-w-3xl mx-auto"
          >
            Take advantage of homeopathy for living a healthy life and stop your search for the best Homeopathy Hospital in Bhavnagar.
          </motion.p>
        </div>

        {/* Creative Bento Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Card 1: Myth vs Clinical Reality (7 columns on large screens) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-forest-950 text-white p-7 sm:p-10 shadow-2xl shadow-forest-950/20 border border-forest-800/40"
          >
            {/* Ambient Background Glow inside card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-forest-700/30 blur-3xl"
            />

            <div className="relative z-10">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-emerald-300 border border-white/10">
                  <Clock className="size-3.5 text-emerald-400" />
                  Common Myth Debunked
                </span>
                <span className="rounded-full bg-rose-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
                  Myth: Slowly Acting
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white leading-snug">
                Fast Acting in Acutes &amp; Complete Permanent Eradication in Chronic Diseases
              </h3>

              {/* Visual Split Comparison: Acute vs Chronic */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {/* Acute Box */}
                <div className="rounded-2xl bg-white/5 p-5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                      <Zap className="size-4" />
                    </div>
                    <span>Acute Illnesses</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white/95">
                    Diarrhea, Minor Infection &amp; Fever
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">
                    In many acute diseases like diarrhea, seasonal infections, and high fever, <strong className="text-emerald-300 font-semibold">it acts faster than other treatments</strong> without groggy or toxic side-effects.
                  </p>
                </div>

                {/* Chronic Box */}
                <div className="rounded-2xl bg-white/5 p-5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                      <ShieldCheck className="size-4" />
                    </div>
                    <span>Chronic Conditions</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white/95">
                    Diabetes, Blood Pressure &amp; More
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">
                    Medicines take time to heal, but <strong className="text-emerald-300 font-semibold">eradicate the disease completely</strong> so you are blessed with a medicine-free life instead of lifelong pills.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Clinical Highlight */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-start gap-3.5 bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-400 mt-0.5" />
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
                Homeopathy treatment <span className="underline decoration-emerald-400 font-semibold text-white">never leads to unnatural changes</span>. Patients feel genuinely healthy, restored, and physically fit through this treatment.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Bhavnagar Hospital & Conditions Cloud (5 columns on large screens) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-white p-7 sm:p-10 shadow-xl shadow-forest-900/10 border border-forest-800/10 hover:border-emerald-500/30 transition-all duration-300"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center gap-2 text-forest-800 font-bold text-xs uppercase tracking-wider mb-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                  <Stethoscope className="size-4" />
                </div>
                <span>One Stop Solution in Bhavnagar</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-forest-950 leading-snug">
                Recognized Clinical Care by Dr. Neeta Parmar
              </h3>

              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                There are a wide array of Homeopathy hospitals in Bhavnagar, but Dr. Neeta&apos;s Homeopathy Clinic run by Dr. Neeta has its own distinct identity. She brings on the table her decades of experience in homeopathy and cures various diseases through her expertise.
              </p>

              {/* Conditions Cloud */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-900">
                    Conditions Treated In This Clinic:
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    13+ Specialties
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {conditions.map((c) => (
                    <span
                      key={c.name}
                      className="group inline-flex items-center gap-1.5 rounded-xl bg-sand-50/80 px-3 py-1.5 text-xs font-medium text-forest-900 border border-forest-800/10 transition-all duration-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-md hover:scale-105 cursor-default"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500 group-hover:bg-white" />
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-sage-50/60 p-4 border border-forest-800/10">
                <p className="text-xs sm:text-sm text-forest-950 leading-relaxed font-medium">
                  Treatment involves complete health evaluation of the patients, catering nothing but a healthy life to them. You can call this clinic a true one-stop solution for all health-related problems.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 pt-5 border-t border-forest-800/10 flex items-center justify-between">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-sm font-bold text-forest-800 hover:text-emerald-700 transition-colors"
              >
                <span>Know More About Our Approach</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/book-appointment"
                className="rounded-full bg-forest-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-forest-800 transition-all hover:-translate-y-0.5"
              >
                Book Visit
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
