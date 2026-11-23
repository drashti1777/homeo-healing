"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

export function MythsVsFacts() {
  const conditions = [
    "Diabetes", "Thyroid", "Women Health", "Arthritis", "Infertility",
    "Sinusitis", "Hypertension", "Hair & Skin", "Allergy", "Asthma",
    "Migraine", "Spondylitis", "Children Diseases"
  ];

  return (
    <section className="section bg-gradient-to-b from-white via-sage-50/40 to-white py-16 lg:py-24">
      <div className="wrap">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Truth &amp; Awareness
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
            Myths and Facts about HOMEOPATHY
          </h2>
          <p className="mt-3 text-base sm:text-lg font-medium text-forest-800">
            Take advantage of homeopathy for living a healthy life and stop your search for the best Homeopathy Hospital in Bhavnagar.
          </p>
        </div>

        {/* Content Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Card 1: Fast & Permanent Relief */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-3xl border border-forest-800/10 bg-white p-7 sm:p-9 shadow-md shadow-forest-900/5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-950/10 transition-all duration-300"
          >
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-4">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Fast Acting &amp; Complete Eradication</span>
            </div>
            <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
              It is believed that Homeopathy treatment is slowly acting, But in many diseases like diarrhea, minor infection and fever it acts faster than other treatments.
            </p>
            <p className="mt-4 text-sm sm:text-base text-ink-soft leading-relaxed">
              In chronic diseases like diabetes, high or low blood pressure etc, Homeopathy medicines may take time to heal, but it can eradicate the disease completely. Unlike other treatments in which patient needs to take lifetime medications, homeopathy will bless you with medicine free life after treatment. Homeopathy treatment never leads to unnatural changes and patient feels healthy and fit through this treatment.
            </p>
          </motion.div>

          {/* Card 2: Dr. Neeta's Clinic Identity */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="rounded-3xl border border-forest-800/10 bg-white p-7 sm:p-9 shadow-md shadow-forest-900/5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-950/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 text-forest-800 font-bold text-xs uppercase tracking-wider mb-4">
                <Stethoscope className="size-4 shrink-0 text-emerald-600" />
                <span>One Stop Solution in Bhavnagar</span>
              </div>
              <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                There are wide array of Homeopathy hospitals in Bhavnagar but Dr. Neeta&apos;s Homeopathy Clinic run by Dr. Neeta has its own identity. She brings on the table her decades of experience in homeopathy and cures various diseases through her expertise.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-forest-800">
                Conditions treated in this homeopathy clinic:
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {conditions.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg bg-sage-50 px-2.5 py-1 text-xs font-medium text-forest-900 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-900 hover:scale-105 cursor-default"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs sm:text-sm text-ink-soft leading-relaxed">
                Treatment involves complete health evaluation of the patients, thus catering nothing but healthy life to them. You can call this homeopathy hospital as one stop solution for all your health related problems.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-forest-800/10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-emerald-700"
              >
                <span>Know More About Our Approach</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
