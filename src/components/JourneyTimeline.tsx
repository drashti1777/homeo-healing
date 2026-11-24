"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Award, Calendar, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, Hospital, Presentation, Sparkles, Stethoscope } from "lucide-react";

const ICONS = { Stethoscope, Award, GraduationCap, Hospital, ClipboardList, Presentation };
export type JourneyItem = { title: string; year: string; text: string; icon: keyof typeof ICONS };

export function JourneyTimeline({ items }: { items: JourneyItem[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const current = items[active];
  const Icon = ICONS[current.icon];
  const isPresent = current.year.toLowerCase().includes("present");

  return (
    <div className="relative mx-auto mt-12 sm:mt-16 max-w-5xl">
      {/* 1. Interactive Horizontal Road / Stepper Bar */}
      <div className="relative mb-10 pb-4">
        {/* Connector Line behind steps */}
        <div
          aria-hidden="true"
          className="absolute top-6 left-6 right-6 h-1 bg-forest-900/10 rounded-full -z-0"
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-forest-800 rounded-full transition-all duration-500"
            style={{ width: `${(active / (items.length - 1)) * 100}%` }}
          />
        </div>

        {/* Stepper nodes */}
        <div className="relative z-10 flex items-center justify-between gap-2 overflow-x-auto py-1 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((j, idx) => {
            const StepIcon = ICONS[j.icon];
            const on = idx === active;
            const past = idx < active;

            return (
              <button
                key={j.title}
                type="button"
                onClick={() => setActive(idx)}
                className="group flex flex-col items-center text-center shrink-0 min-w-[70px] sm:min-w-[90px] focus:outline-none"
              >
                {/* Node Circle */}
                <div
                  className={`grid size-11 sm:size-12 place-items-center rounded-2xl transition-all duration-300 ${on
                    ? "bg-forest-800 text-emerald-300 ring-4 ring-emerald-400/30 shadow-lg shadow-forest-900/25 scale-110"
                    : past
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white text-forest-900 border border-forest-900/15 group-hover:border-emerald-500 shadow-xs"
                    }`}
                >
                  <StepIcon className="size-5" />
                </div>

                {/* Year Label */}
                <span
                  className={`mt-2.5 text-xs font-bold transition-colors ${on ? "text-forest-950 font-extrabold" : "text-ink-soft group-hover:text-forest-900"
                    }`}
                >
                  {j.year}
                </span>

                <span
                  className={`text-[10px] hidden sm:block max-w-[85px] truncate transition-colors ${on ? "text-emerald-700 font-semibold" : "text-ink-soft/70"
                    }`}
                >
                  {j.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Spotlight Active Milestone Showcase Card */}
      <div className="overflow-hidden rounded-3xl bg-white border border-forest-800/10 shadow-xl shadow-forest-950/5">
        <div className="grid lg:grid-cols-12 items-stretch">
          {/* Left Hero Column: Milestone Banner with Ambient Glow (5 cols) */}
          <div className="relative lg:col-span-5 p-7 sm:p-8 bg-gradient-to-br from-forest-900 via-forest-850 to-forest-950 text-white flex flex-col justify-between overflow-hidden">
            {/* Ambient Background Glow */}
            <div
              aria-hidden="true"
              className="absolute -top-16 -right-16 size-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 -left-16 size-48 rounded-full bg-forest-600/30 blur-3xl pointer-events-none"
            />

            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${isPresent
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : "bg-white/10 text-white/90 border border-white/15"
                    }`}
                >
                  <Calendar className="size-3.5" />
                  <span>{current.year}</span>
                </span>

                <span className="text-xs font-bold text-white/60">
                  0{active + 1} / 0{items.length}
                </span>
              </div>

              <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 grid place-items-center text-emerald-300 mb-5 shadow-inner">
                <Icon className="size-7" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400/90 block mb-1">
                Clinical Milestone
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-white">
                {current.title}
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200/90">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-emerald-400" />
                Verified Clinical Credential
              </span>
            </div>
          </div>

          {/* Right Column: In-depth Description & Details (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-between bg-sand-50/40">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-500/20 mb-4">
                <Sparkles className="size-3.5 text-emerald-600" />
                <span>Dr. Neeta Parmar &apos;s Professional Path</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-base sm:text-lg text-forest-950 font-medium leading-relaxed">
                    &ldquo;{current.text}&rdquo;
                  </p>

                  <div className="mt-6 rounded-2xl bg-white p-4 border border-forest-900/10 shadow-xs">
                    <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wide mb-1">
                      Practice Scope &amp; Expertise
                    </h4>
                    <p className="text-xs text-ink-soft leading-normal">
                      Formal postgraduate certifications, institutional appointments, and specialized master homeopathy training across Gujarat and Maharashtra.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Nav Controls */}
            <div className="mt-8 pt-5 border-t border-forest-900/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-soft">
                Milestone {active + 1} of {items.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActive((prev) => (prev > 0 ? prev - 1 : items.length - 1))}
                  className="grid size-9 place-items-center rounded-full border border-forest-800/15 text-forest-800 hover:bg-white transition-colors"
                  aria-label="Previous milestone"
                >
                  <ChevronLeft className="size-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActive((prev) => (prev < items.length - 1 ? prev + 1 : 0))}
                  className="grid size-9 place-items-center rounded-full bg-forest-800 text-white hover:bg-forest-700 transition-colors shadow-sm"
                  aria-label="Next milestone"
                >
                  <ChevronRight className="size-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
