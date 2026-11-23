"use client";

import { motion } from "motion/react";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

const COMPARISONS = [
  {
    myth: "Homeopathy acts very slowly and takes months to give relief.",
    fact: "In acute conditions like high fever, acute cough, diarrhea, and infections, homeopathic remedies act rapidly and effectively.",
  },
  {
    myth: "Homeopathic medicines contain hidden steroids.",
    fact: "100% false. Homeopathic remedies are purely prepared from natural plants, minerals, and herbal micro-dilutions with zero steroids.",
  },
  {
    myth: "You must follow extreme dietary bans (no garlic, onion, coffee).",
    fact: "Modern homeopathic practice only requires a clean mouth 15 minutes before and after taking your medicine.",
  },
  {
    myth: "It only works for minor everyday colds, not chronic illnesses.",
    fact: "Constitutional homeopathic treatment addresses deep chronic conditions like psoriasis, arthritis, asthma, PCOS, and thyroid disorders.",
  },
];

export function MythsVsFacts() {
  return (
    <section className="section bg-white py-16 lg:py-24">
      <div className="wrap">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Truth &amp; Science
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
            Myths vs. Facts About Homeopathy
          </h2>
          <p className="mt-3 text-base text-ink-soft">
            Clearing misconceptions so you can make informed, confident choices for your family&apos;s healthcare.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {COMPARISONS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-forest-800/10 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-forest-800/20 hover:shadow-xl hover:shadow-forest-900/5 space-y-4"
            >
              {/* Myth Box */}
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                <div className="flex items-center gap-2 text-rose-700">
                  <XCircle className="size-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Myth</span>
                </div>
                <p className="mt-1 text-sm font-medium text-rose-950 leading-relaxed">
                  {item.myth}
                </p>
              </div>

              {/* Fact Box */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Medical Fact</span>
                </div>
                <p className="mt-1 text-sm text-forest-950 leading-relaxed font-normal">
                  {item.fact}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
