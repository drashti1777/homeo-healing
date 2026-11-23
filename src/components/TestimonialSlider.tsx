"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserCheck,
} from "lucide-react";

type Review = { name: string; location?: string; quote: string };

const INTERVAL = 8500;
const LONG = 280;

const initials = (name: string) =>
  name
    .replace(/\(.*?\)/g, "")
    .replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

// Clinical tag helper
function getReviewMeta(name: string, quote: string) {
  if (name.includes("Chandrika") || quote.includes("Asthma")) {
    return {
      condition: "Bronchial Asthma & Milk Allergy",
      category: "Specialist Care",
      outcome: "Decreased hospitalizations from 2x/month to Asymptomatic; normal diet restored",
      role: "MD - Anaesthesia",
    };
  }
  if (name.includes("Kiya") || quote.includes("immunity")) {
    return {
      condition: "Pediatric Immunity Boosting",
      category: "Pediatric Care",
      outcome: "Effective immunity enhancement with natural zero-side-effect treatment",
      role: "Parent Feedback",
    };
  }
  if (name.includes("Rakesh") || quote.includes("neck pain")) {
    return {
      condition: "Chronic Neck Pain (10 Months)",
      category: "Pain Relief",
      outcome: "Relieved after 10 months of chronic pain; returned to normal lifestyle",
      role: "Verified Patient",
    };
  }
  if (name.includes("Ullas") || quote.includes("nasal") || quote.includes("allergic")) {
    return {
      condition: "Allergic Rhinitis, Cold & Cough",
      category: "Respiratory Allergy",
      outcome: "Severe nasal congestion completely cured through humble & precise consultation",
      role: "MBA Graduate",
    };
  }
  if (quote.includes("સાંધા") || name.includes("Zanzrukiya")) {
    return {
      condition: "15-Year Joint Pain Care (સાંધા નો દુખાવો)",
      category: "Chronic Ortho",
      outcome: "15 વર્ષ ના સાંધા ના દુખાવા માં અદ્ભુત રાહત અને ચોક્કસ નિદાન",
      role: "Doctor / Senior Patient",
    };
  }
  return {
    condition: "Constitutional Homeopathy",
    category: "Holistic Health",
    outcome: "Personalized constitutional healing",
    role: "Verified Patient",
  };
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
  const [progress, setProgress] = useState(0);

  const go = useCallback(
    (dir: number) => {
      setExpanded(false);
      setProgress(0);
      setIndex((i) => (i + dir + reviews.length) % reviews.length);
    },
    [reviews.length]
  );

  // Auto-slide and progress animation
  useEffect(() => {
    if (expanded || reviews.length < 2 || isPaused) return;

    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= INTERVAL) {
        go(1);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [index, expanded, go, reviews.length, isPaused]);

  const activeReview = reviews[index] || reviews[0];
  const isLong = activeReview.quote.length > LONG;
  const activeMeta = getReviewMeta(activeReview.name, activeReview.quote);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative mx-auto w-full"
      aria-roledescription="carousel"
      aria-label="Patient testimonials showcase"
    >
      {/* Ambient Visual Glow behind the container */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-12 -left-12 h-80 w-80 rounded-full blur-3xl -z-10 ${
          isLight ? "bg-emerald-100/60" : "bg-emerald-500/10"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-12 -right-12 h-80 w-80 rounded-full blur-3xl -z-10 ${
          isLight ? "bg-amber-100/40" : "bg-forest-700/30"
        }`}
      />

      {/* Top Mobile/Tablet Quick-Selector Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 lg:hidden">
        {reviews.map((item, idx) => {
          const active = idx === index;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setExpanded(false);
                setProgress(0);
                setIndex(idx);
              }}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                active
                  ? isLight
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/25 scale-105"
                    : "bg-emerald-400 text-forest-950 font-bold shadow-md shadow-emerald-400/25 scale-105"
                  : isLight
                  ? "bg-white text-forest-900 border border-forest-800/10 hover:bg-emerald-50"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              <span className="truncate max-w-[120px]">
                {item.name.replace(/\(.*?\)/g, "").trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Dual-Column Interactive Stage */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Spotlight Patient Story (7 of 12 columns) */}
        <div
          className={`relative lg:col-span-7 flex flex-col justify-between overflow-hidden rounded-[2.5rem] p-6 sm:p-8 md:p-10 transition-all duration-300 ${
            isLight
              ? "bg-white shadow-2xl shadow-forest-950/10 border border-forest-800/10"
              : "bg-forest-950/90 text-white shadow-2xl shadow-black/30 border border-forest-700/40"
          }`}
        >
          {/* Decorative Corner Watermark */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-4 -right-4 size-32 opacity-5 ${
              isLight ? "text-forest-950" : "text-white"
            }`}
          >
            <Quote className="size-full" />
          </div>

          <div>
            {/* Top Bar: Star Rating & Verified Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest-900/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4.5 fill-amber-400 text-amber-400 drop-shadow-sm"
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-bold ${
                    isLight ? "text-forest-900" : "text-emerald-300"
                  }`}
                >
                  5.0 / 5.0
                </span>
                <span
                  className={`hidden sm:inline text-xs ${
                    isLight ? "text-ink-soft" : "text-white/60"
                  }`}
                >
                  · Verified Healing Story
                </span>
              </div>

              {/* Condition Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-500/20">
                <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {activeMeta.condition}
                </span>
              </div>
            </div>

            {/* Clinical Healing Outcome Callout */}
            <div
              className={`mt-6 flex items-start gap-3 rounded-2xl p-4 border transition-colors ${
                isLight
                  ? "bg-emerald-50/70 border-emerald-500/20 text-emerald-950"
                  : "bg-emerald-900/25 border-emerald-500/30 text-emerald-200"
              }`}
            >
              <Sparkles className="size-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="font-semibold block text-[11px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-0.5">
                  Clinical Outcome Highlight:
                </strong>
                <span>{activeMeta.outcome}</span>
              </div>
            </div>

            {/* Animated Testimonial Text */}
            <div className="relative mt-7 min-h-[9rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeReview.name}
                  initial={{ opacity: 0, y: reduce ? 0 : 15, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -15, scale: 0.99 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <blockquote
                    className={`font-serif text-[clamp(1.1rem,1.8vw,1.35rem)] leading-relaxed italic ${
                      isLight ? "text-forest-950 font-medium" : "text-white font-light"
                    } ${isLong && !expanded ? "line-clamp-5 sm:line-clamp-6" : ""}`}
                  >
                    &ldquo;{activeReview.quote}&rdquo;
                  </blockquote>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() => setExpanded((e) => !e)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 hover:underline"
                    >
                      <span>{expanded ? "Show less ↑" : "Read full patient story →"}</span>
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Card Footer: Author Details + Controls */}
          <div className="mt-8 pt-6 border-t border-forest-900/10 flex flex-wrap items-center justify-between gap-4">
            {/* Patient Avatar & Credentials */}
            <div className="flex items-center gap-3.5">
              <div
                className={`flex size-13 items-center justify-center rounded-2xl font-serif text-lg font-bold shadow-md ring-2 ${
                  isLight
                    ? "bg-gradient-to-tr from-forest-900 to-emerald-700 text-white ring-emerald-100"
                    : "bg-emerald-400 text-forest-950 ring-emerald-400/30"
                }`}
              >
                {initials(activeReview.name)}
              </div>
              <div>
                <h3
                  className={`font-serif text-base sm:text-lg font-bold leading-tight ${
                    isLight ? "text-forest-950" : "text-white"
                  }`}
                >
                  {activeReview.name}
                </h3>
                <p
                  className={`text-xs mt-0.5 flex items-center gap-1.5 ${
                    isLight ? "text-ink-soft" : "text-white/70"
                  }`}
                >
                  <UserCheck className="size-3.5 text-emerald-600" />
                  <span>
                    {activeReview.location
                      ? `${activeReview.location} · ${activeMeta.role}`
                      : activeMeta.role}
                  </span>
                </p>
              </div>
            </div>

            {/* Playback & Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Resume auto play" : "Pause auto play"}
                className={`grid size-10 place-items-center rounded-full border transition-all duration-200 active:scale-95 ${
                  isLight
                    ? "border-forest-900/15 bg-sand-50/60 text-forest-800 hover:bg-emerald-50 hover:text-emerald-800"
                    : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                }`}
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>

              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className={`grid size-10 place-items-center rounded-full border transition-all duration-200 active:scale-95 ${
                  isLight
                    ? "border-forest-900/15 bg-sand-50/60 text-forest-800 hover:bg-emerald-50 hover:text-emerald-800"
                    : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className={`grid size-10 place-items-center rounded-full border transition-all duration-200 active:scale-95 ${
                  isLight
                    ? "border-forest-900/15 bg-sand-50/60 text-forest-800 hover:bg-emerald-50 hover:text-emerald-800"
                    : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Patient Stories Deck (5 of 12 columns, Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-2.5 sticky top-24 lg:top-28 self-start">
          <div className="flex items-center justify-between px-2 mb-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-forest-900" : "text-emerald-300"
              }`}
            >
              All Patient Stories ({reviews.length})
            </span>
            <span
              className={`text-[11px] font-semibold ${
                isLight ? "text-ink-soft" : "text-white/60"
              }`}
            >
              Click to view case
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {reviews.map((rev, i) => {
              const active = i === index;
              const meta = getReviewMeta(rev.name, rev.quote);

              return (
                <motion.button
                  key={rev.name}
                  type="button"
                  onClick={() => {
                    setExpanded(false);
                    setProgress(0);
                    setIndex(i);
                  }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  className={`group relative text-left rounded-2xl p-4 transition-all duration-300 overflow-hidden ${
                    active
                      ? isLight
                        ? "bg-white border-2 border-emerald-600 shadow-xl shadow-emerald-950/10 ring-4 ring-emerald-50"
                        : "bg-forest-900/90 border-2 border-emerald-400 shadow-xl shadow-black/40 text-white"
                      : isLight
                      ? "bg-white/70 border border-forest-800/10 hover:bg-white hover:border-emerald-500/40 hover:shadow-md"
                      : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {/* Active Card Progress Bar Indicator */}
                  {active && !isPaused && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-9 items-center justify-center rounded-xl text-xs font-bold ${
                          active
                            ? "bg-emerald-600 text-white"
                            : isLight
                            ? "bg-sage-100 text-forest-900 group-hover:bg-emerald-100"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {initials(rev.name)}
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-bold leading-tight ${
                            active
                              ? isLight
                                ? "text-forest-950"
                                : "text-white"
                              : isLight
                              ? "text-forest-900"
                              : "text-white/90"
                          }`}
                        >
                          {rev.name}
                        </h4>
                        <p
                          className={`text-xs mt-0.5 truncate max-w-[190px] ${
                            active ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-ink-soft dark:text-white/60"
                          }`}
                        >
                          {meta.condition}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {active ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                          Active
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} className="size-2.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
