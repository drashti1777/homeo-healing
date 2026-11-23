"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircle2, ChevronLeft, ChevronRight, Quote, ShieldCheck, Sparkles, Star } from "lucide-react";

type Review = { name: string; location?: string; quote: string };

const INTERVAL = 9000;
const LONG = 320;

const initials = (name: string) =>
  name.replace(/\(.*?\)/g, "").replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

// Helper to highlight condition or focus area for each verified patient
function getReviewCondition(name: string, quote: string): string {
  if (name.includes("Chandrika") || quote.includes("Asthma")) return "Bronchial Asthma & Milk Allergy";
  if (name.includes("Kiya") || quote.includes("immunity")) return "Pediatric Immunity Care";
  if (name.includes("Rakesh") || quote.includes("neck pain")) return "Chronic Neck Pain Relief";
  if (name.includes("Ullas") || quote.includes("nasal") || quote.includes("allergic")) return "Allergic Rhinitis & Cold/Cough";
  if (quote.includes("સાંધા")) return "15-Year Joint Pain Care";
  return "Constitutional Homeopathy";
}

export function TestimonialSlider({
  reviews,
  theme = "dark",
}: {
  reviews: Review[];
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const go = useCallback((dir: number) => {
    setExpanded(false);
    setIndex((i) => (i + dir + reviews.length) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    if (expanded || reviews.length < 2 || isPaused) return;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, expanded, go, reviews.length, isPaused]);

  const r = reviews[index];
  const isLong = r.quote.length > LONG;
  const condition = getReviewCondition(r.name, r.quote);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative mx-auto max-w-4xl ${
        isLight
          ? "rounded-3xl border border-forest-800/10 bg-white/95 p-6 sm:p-10 md:p-12 shadow-2xl shadow-forest-900/10 backdrop-blur-sm"
          : "rounded-3xl bg-forest-950/60 p-6 sm:p-10 border border-white/10"
      }`}
      aria-roledescription="carousel"
      aria-label="Patient testimonials"
    >
      {/* 1. Creative Top Bar: Interactive Patient Switcher Pills */}
      {reviews.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 border-b border-forest-800/10 pb-6">
          {reviews.map((item, idx) => {
            const active = idx === index;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setIndex(idx);
                }}
                className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  active
                    ? isLight
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                      : "bg-emerald-500 text-forest-950 font-bold shadow-md shadow-emerald-500/30 scale-105"
                    : isLight
                    ? "bg-sage-100/70 text-forest-800 hover:bg-sage-200/80 hover:scale-102"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <span className="size-2 rounded-full bg-current opacity-80" />
                <span className="truncate max-w-[140px] sm:max-w-none">{item.name.replace(/\(.*?\)/g, "").trim()}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Rating & Verified Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {/* 5 Golden Stars */}
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
            ))}
          </div>
          <span className="text-xs font-bold text-forest-900/70 ml-1">5.0 Out of 5</span>
        </div>

        {/* Condition Treated Tag + Verified Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>{condition}</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-medium text-forest-800">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Verified Patient
          </span>
        </div>
      </div>

      {/* 3. Quote Area with Large Decorative Quote Mark */}
      <div className="relative min-h-[12rem]" aria-live="polite">
        <div className="pointer-events-none absolute -top-4 -left-2 sm:-left-4 opacity-15">
          <Quote className={`size-16 sm:size-20 ${isLight ? "text-emerald-700" : "text-emerald-400"}`} />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: reduce ? 0 : 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -18, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${reviews.length}`}
          >
            <blockquote
              className={`font-serif text-[clamp(1.05rem,1.7vw,1.3rem)] leading-relaxed ${
                isLight ? "text-forest-950 font-normal" : "text-paper"
              } ${isLong && !expanded ? "line-clamp-4" : ""}`}
            >
              &ldquo;{r.quote}&rdquo;
            </blockquote>

            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold hover:underline ${
                  isLight ? "text-emerald-700 hover:text-emerald-800" : "text-emerald-300"
                }`}
              >
                {expanded ? "Read less ↑" : "Read full patient story →"}
              </button>
            )}

            {/* Patient Credentials & Avatar */}
            <figcaption className="mt-8 flex items-center justify-between border-t border-forest-800/10 pt-6">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={`grid size-12 place-items-center rounded-full font-serif font-bold text-base shadow-sm ring-4 ${
                    isLight
                      ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white ring-emerald-100"
                      : "bg-emerald-400 text-forest-950 ring-emerald-400/20"
                  }`}
                >
                  {initials(r.name)}
                </span>
                <div>
                  <span
                    className={`block font-serif text-lg font-bold ${
                      isLight ? "text-forest-950" : "text-paper"
                    }`}
                  >
                    {r.name}
                  </span>
                  <span
                    className={`block text-xs sm:text-sm ${
                      isLight ? "text-ink-soft" : "text-sage-300"
                    }`}
                  >
                    {r.location ? `${r.location} · Verified Consultation` : "Verified Consultation"}
                  </span>
                </div>
              </div>

              {/* Prev / Next controls on desktop */}
              {reviews.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    className={`grid size-10 place-items-center rounded-full transition-all duration-200 active:scale-95 ${
                      isLight
                        ? "border border-forest-900/15 bg-white text-forest-900 shadow-sm hover:bg-emerald-50 hover:border-emerald-300"
                        : "border border-paper/25 text-paper hover:bg-white/10"
                    }`}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    className={`grid size-10 place-items-center rounded-full transition-all duration-200 active:scale-95 ${
                      isLight
                        ? "border border-forest-900/15 bg-white text-forest-900 shadow-sm hover:bg-emerald-50 hover:border-emerald-300"
                        : "border border-paper/25 text-paper hover:bg-white/10"
                    }`}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              )}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* 4. Creative Progress Line Bar */}
      {reviews.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {reviews.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                setExpanded(false);
                setIndex(i);
              }}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? isLight
                    ? "w-10 bg-emerald-600 shadow-sm shadow-emerald-600/30"
                    : "w-10 bg-emerald-400"
                  : isLight
                  ? "w-2.5 bg-forest-900/20 hover:bg-forest-900/40"
                  : "w-2.5 bg-paper/30 hover:bg-paper/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
