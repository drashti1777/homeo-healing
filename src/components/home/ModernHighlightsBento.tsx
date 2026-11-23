"use client";

import { motion } from "motion/react";
import { Activity, Award, CheckCircle2, HeartPulse, Leaf, ShieldCheck, Sparkles, Zap } from "lucide-react";

export function ModernHighlightsBento() {
  return (
    <section className="section bg-white py-16 lg:py-24">
      <div className="wrap">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block rounded-full bg-emerald-50 text-emerald-800 px-4 py-1 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            Advanced Homeopathy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
            A Smarter, Gentler Approach to Complete Health
          </h2>
          <p className="text-base text-ink-soft">
            Designed around your unique body and constitution, delivering deep healing without unwanted side effects.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-12">
          {/* Card 1: Large Featured Card (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 flex flex-col justify-between rounded-3xl border border-forest-800/10 bg-gradient-to-br from-sage-50/80 via-white to-emerald-50/40 p-8 sm:p-10 shadow-sm transition-all duration-300 hover:border-forest-800/20 hover:shadow-xl hover:shadow-forest-900/5"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-forest-800 text-white shadow-md shadow-forest-800/20">
                <HeartPulse className="size-6" />
              </div>
              <h3 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                Immune-Boosting &amp; Root-Cause Healing
              </h3>
              <p className="mt-4 text-base text-ink-soft leading-relaxed">
                Homeopathy is fundamentally different from conventional medicine. Instead of temporarily suppressing isolated symptoms with heavy chemicals, it evaluates the patient&apos;s complete nature — personality, emotional state, and physiological triggers — to boost the immune system and empower the body to heal permanently.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forest-800/10 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-900">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Whole-Body Care</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-900">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Zero Lifetime Pills</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Safe for Every Age (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5 flex flex-col justify-between rounded-3xl border border-forest-800/10 bg-white p-8 sm:p-10 shadow-sm transition-all duration-300 hover:border-forest-800/20 hover:shadow-xl hover:shadow-forest-900/5"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <Leaf className="size-6" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-bold text-forest-950">
                100% Gentle &amp; Safe for All Ages
              </h3>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                Prepared from natural mineral and herbal micro-dilutions, our remedies have zero toxicity and cause no drowsiness. From newborn colic to geriatric joint pain, it is universally safe and pleasant to take.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-sage-50/70 p-4 border border-sage-200/50">
              <p className="text-xs font-semibold text-forest-800">
                Suitable for: Newborns • Children • Pregnancy • Senior Citizens
              </p>
            </div>
          </motion.div>

          {/* Card 3: Rapid Acute & Chronic Relief (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-5 flex flex-col justify-between rounded-3xl border border-forest-800/10 bg-white p-8 sm:p-10 shadow-sm transition-all duration-300 hover:border-forest-800/20 hover:shadow-xl hover:shadow-forest-900/5"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Zap className="size-6" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-bold text-forest-950">
                Fast in Acute, Permanent in Chronic
              </h3>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                Contrary to common belief, acute illnesses like sudden high fevers, seasonal allergies, and infections respond remarkably fast. For chronic disorders like asthma and arthritis, it works progressively to cure the root issue.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-sage-100/70 px-3 py-1 text-xs font-medium text-forest-800">No Sedation</span>
              <span className="rounded-full bg-sage-100/70 px-3 py-1 text-xs font-medium text-forest-800">Non-Addictive</span>
            </div>
          </motion.div>

          {/* Card 4: Decades of Clinical Experience (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-7 flex flex-col justify-between rounded-3xl border border-forest-800/10 bg-gradient-to-tr from-forest-900 via-forest-800 to-forest-700 p-8 sm:p-10 text-white shadow-xl shadow-forest-950/15"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-400 backdrop-blur-sm">
                <Award className="size-6" />
              </div>
              <h3 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-white">
                Decades of Expert Practice by Dr. Neeta Parmar
              </h3>
              <p className="mt-4 text-base text-white/80 leading-relaxed">
                As Chief Consultant in Bhavnagar and Ahmedabad, and Associate Professor of Homoeopathic Pharmacy, Dr. Neeta conducts thorough health evaluations to deliver customized constitutional remedies with a compassionate humane touch.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <span>MD (Repertory)</span>
              <span>•</span>
              <span>Associate Professor</span>
              <span>•</span>
              <span>15+ Years Clinical Care</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
