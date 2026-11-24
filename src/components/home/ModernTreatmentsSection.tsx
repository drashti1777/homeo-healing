"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import type { TreatmentDoc } from "@/lib/data";

const CATEGORY_TABS = [
  { id: "all", label: "All Treatments" },
  { id: "popular", label: "Most Consulted" },
  { id: "chronic", label: "Chronic & Immune" },
  { id: "family", label: "Women & Pediatric" },
];

export function ModernTreatmentsSection({ treatments }: { treatments: TreatmentDoc[] }) {
  const [activeTab, setActiveTab] = useState("all");

  // Group or filter treatments based on tab
  const filtered = treatments.filter((t) => {
    if (activeTab === "all") return true;
    if (activeTab === "popular") {
      return ["skin-disease", "respiratory-disease", "womens-health", "gi-system", "pediatric", "endocrine"].includes(t.slug);
    }
    if (activeTab === "chronic") {
      return ["disorders-of-joints-muscle", "respiratory-disease", "skin-disease", "neurological-problems", "kidney-urinary-tract"].includes(t.slug);
    }
    if (activeTab === "family") {
      return ["womens-health", "pediatric", "during-pregnancy", "geriatric"].includes(t.slug);
    }
    return true;
  });

  return (
    <section className="section bg-sage-50/50 py-16 lg:py-24">
      <div className="wrap">
        {/* Header with Title and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-forest-800/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Specialized Care
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
              Areas We Consult On
            </h2>
            <p className="mt-3 max-w-xl text-base text-ink-soft">
              Offering evidence-informed, gentle homeopathic care across 16 specialized health categories for the entire family.
            </p>
          </div>

          <Link
            href="/treatments"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-emerald-700"
          >
            <span>View All 16 Categories</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2.5 pt-8">
          {CATEGORY_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? "bg-forest-800 text-white shadow-md shadow-forest-800/20"
                    : "bg-white text-forest-900 border border-forest-800/10 hover:border-forest-800/25 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Treatments Grid */}
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.slice(0, 9).map((treatment, idx) => {
              const conditionList = treatment.conditions || [];
              const previewConditions = conditionList.slice(0, 4);

              return (
                <motion.div
                  layout
                  key={treatment._id || treatment.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-forest-800/10 bg-white shadow-sm transition-all duration-300 hover:border-forest-800/20 hover:shadow-xl hover:shadow-forest-900/10"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-sage-100">
                      <Image
                        src={treatment.image || "/gallery/consultation-1.webp"}
                        alt={treatment.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-forest-800 backdrop-blur-sm">
                          {conditionList.length > 0 ? `${conditionList.length} Conditions Treated` : "Comprehensive Care"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-forest-950 group-hover:text-forest-800 transition-colors">
                        {treatment.title}
                      </h3>

                      {treatment.summary && (
                        <p className="mt-2 text-xs sm:text-sm text-ink-soft line-clamp-2 leading-relaxed">
                          {treatment.summary}
                        </p>
                      )}

                      {/* Conditions Tags */}
                      {previewConditions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {previewConditions.map((c) => (
                            <span
                              key={c}
                              className="rounded-lg bg-sage-50 px-2.5 py-1 text-[11px] font-medium text-forest-900"
                            >
                              {c}
                            </span>
                          ))}
                          {conditionList.length > 4 && (
                            <span className="rounded-lg bg-sage-100/60 px-2 py-1 text-[11px] font-medium text-forest-700">
                              +{conditionList.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action (Commented Out)
                  <div className="p-6 pt-0">
                    <Link
                      href={`/treatments`}
                      className="inline-flex w-full items-center justify-between rounded-xl bg-sage-50/70 px-4 py-2.5 text-xs font-semibold text-forest-800 transition-all hover:bg-forest-800 hover:text-white"
                    >
                      <span>Explore Treatment</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                  */}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
