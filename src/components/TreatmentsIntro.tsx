"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "motion/react";
import { Sparkles, Stethoscope } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

interface TreatmentsIntroProps {
  categoriesCount: number;
  conditionsCount: number;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function TreatmentsIntro({ categoriesCount, conditionsCount }: TreatmentsIntroProps) {
  const reduce = useReducedMotion();

  const slideLeft = reduce
    ? { initial: false, whileInView: { opacity: 1 }, viewport: { once: true } }
    : {
        initial: { opacity: 0, x: -30, y: -15 },
        whileInView: { opacity: 1, x: 0, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.8, ease: EASE_OUT },
      };

  const cardAnim = (delay = 0) =>
    reduce
      ? { initial: false, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, y: -25, scale: 0.96 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.8, delay, ease: EASE_OUT },
        };

  const glowAnimation: TargetAndTransition | undefined = reduce
    ? undefined
    : {
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

  return (
    <section className="section pt-8 pb-4 lg:pt-12 lg:pb-6 bg-white overflow-hidden" aria-labelledby="intro-heading">
      <div className="wrap grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* Left Column: Introduction & Core Medical Philosophy */}
        <motion.div {...slideLeft} className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
            <Sparkles className="size-3.5 text-emerald-600 animate-pulse" />
            Evidence-Based Constitutional Healing
          </span>
          <h2 id="intro-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
            Best Homeopathic Treatment Available for Various Disorders
          </h2>
          <p className="text-base sm:text-lg text-forest-900 font-semibold leading-relaxed">
            Homeopathy is a proven holistic medical science based upon the ancient principle of &ldquo;like cures like&rdquo;—stimulating the body&apos;s natural defense mechanism to heal from within.
          </p>
          <p className="text-base text-ink-soft leading-relaxed">
            At <strong>Dr. Neeta&apos;s Homeo Health Care</strong>, treatment is never confined to suppressing surface symptoms. By understanding each patient&apos;s physical constitution, emotional disposition, and unique pathology, Dr. Neeta Parmar prescribes individualized constitutional remedies for permanent and gentle recovery.
          </p>
        </motion.div>

        {/* Right Column: Quick Metrics Cards - Enter One-by-One slowly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: Clinical Categories (First to enter) */}
          <motion.div
            {...cardAnim(0.3)}
            whileHover={reduce ? undefined : { y: -8, scale: 1.02, transition: { duration: 0.25 } }}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-sand-50/60 to-white p-6 sm:p-7 shadow-lg shadow-forest-950/5 border border-forest-800/10 transition-colors duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/10 cursor-default"
          >
            <motion.div
              aria-hidden="true"
              animate={glowAnimation}
              className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-100/60 blur-2xl"
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-forest-800 text-emerald-300 shadow-md shadow-forest-900/15 ring-2 ring-emerald-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Stethoscope className="size-5 sm:size-6" />
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-2xs">
                Verified
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <AnimatedCounter
                end={categoriesCount}
                duration={2.0}
                className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 tracking-tight"
              />
            </div>

            <h3 className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-forest-900 group-hover:text-emerald-900 transition-colors">
              Clinical Categories
            </h3>
            <p className="mt-1 text-xs text-ink-soft leading-normal">
              Comprehensive specialized departments &amp; organ systems.
            </p>
          </motion.div>

          {/* Card 2: Conditions Treated (Enters second after Card 1) */}
          <motion.div
            {...cardAnim(0.6)}
            whileHover={reduce ? undefined : { y: -8, scale: 1.02, transition: { duration: 0.25 } }}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-sand-50/60 to-white p-6 sm:p-7 shadow-lg shadow-forest-950/5 border border-forest-800/10 transition-colors duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/10 cursor-default"
          >
            <motion.div
              aria-hidden="true"
              animate={glowAnimation}
              className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-100/60 blur-2xl"
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Sparkles className="size-5 sm:size-6" />
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-2xs">
                Acute &amp; Chronic
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <AnimatedCounter
                end={conditionsCount}
                suffix="+"
                duration={2.4}
                className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 tracking-tight"
              />
            </div>

            <h3 className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-forest-900 group-hover:text-emerald-900 transition-colors">
              Conditions Treated
            </h3>
            <p className="mt-1 text-xs text-ink-soft leading-normal">
              Evidence-based personalized constitutional healing.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
