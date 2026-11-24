"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Award, Compass, HeartPulse, Pill, Sparkles, Stethoscope, Target } from "lucide-react";

const ICONS = { Pill, Stethoscope, Award, Target, HeartPulse };

export type BestTab = {
  icon: keyof typeof ICONS;
  title: string;
  image: string;
  imageAlt: string;
  text?: string;
  blocks?: { heading: string; lines: string[] }[];
};

const INTERVAL = 5000;

export function BestShowcase({ tabs }: { tabs: BestTab[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = useCallback((i: number) => {
    setProgress(0);
    setActive((i + tabs.length) % tabs.length);
  }, [tabs.length]);

  // Reliable interval that smoothly advances tabs
  useEffect(() => {
    if (reduce) return;

    const tickInterval = 50; // every 50ms
    const step = (tickInterval / INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          go(active + 1);
          return 0;
        }
        return prev + step;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [active, reduce, go]);

  const tab = tabs[active];

  return (
    <div className="mt-12 w-full">
      {/* Interactive Floating Pill Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
        {tabs.map((t, i) => {
          const Icon = ICONS[t.icon];
          const on = i === active;
          return (
            <button
              key={t.title}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`best-tab-${i}`}
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => go(i)}
              className={`group relative flex items-center gap-2.5 rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${on
                ? "bg-forest-800 text-white shadow-lg shadow-forest-900/20 scale-105"
                : "bg-white text-forest-900 border border-forest-800/10 hover:border-emerald-500/30 hover:bg-emerald-50/50 shadow-xs"
                }`}
            >
              <span
                className={`grid size-6 sm:size-7 place-items-center rounded-full transition-colors ${on ? "bg-white/20 text-emerald-300" : "bg-emerald-50 text-emerald-700"
                  }`}
              >
                <Icon className="size-3.5 sm:size-4" />
              </span>
              <span>{t.title}</span>

              {/* Step indicator badge */}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${on ? "bg-white/15 text-emerald-200" : "bg-forest-900/5 text-forest-900/60"
                  }`}
              >
                0{i + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Creative Showcase Frame */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-forest-800/10 shadow-xl shadow-forest-950/5">
        {/* Visual Container: Shows image clearly */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/10] overflow-hidden bg-forest-900/60">
          <AnimatePresence initial={false}>
            <motion.div
              key={tab.image}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: "easeInOut" }}
            >
              <Image
                src={tab.image}
                alt={tab.imageAlt}
                fill
                sizes="100vw"
                priority={active === 0}
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Desktop Overlay Gradient (soft & light so image is bright & clear) */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/20 to-transparent pointer-events-none"
          />

          {/* Top Floating Badge */}
          <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-10 flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/95 px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-forest-950 backdrop-blur-md shadow-md border border-white/40">
            <Sparkles className="size-3 sm:size-3.5 text-emerald-600" />
            <span>Practice Feature</span>
          </div>

          {/* Top Right Counter */}
          <div className="absolute top-3 sm:top-5 right-3 sm:right-5 z-10 flex items-center gap-1.5 rounded-full bg-forest-950/80 px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-white border border-white/20 backdrop-blur-md">
            <span className="text-emerald-300">0{active + 1}</span>
            <span className="text-white/40">/</span>
            <span>0{tabs.length}</span>
          </div>

          {/* Desktop Bottom Overlay Content (Hidden on Mobile) */}
          <div className="hidden sm:block absolute bottom-6 left-6 right-6 z-10 text-white max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.title}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30 backdrop-blur-xs mb-2">
                  <Compass className="size-3.5" />
                  <span>Dr. Neeta&apos;s Homoeo Health Care</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-md">
                  {tab.title}
                </h3>

                {tab.blocks && tab.blocks.length > 0 ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {tab.blocks.map((b) => (
                      <div
                        key={b.heading}
                        className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-lg"
                      >
                        <h4 className="font-serif text-lg font-bold text-emerald-300 flex items-center gap-1.5 mb-1.5">
                          <span className="size-1.5 rounded-full bg-emerald-400" />
                          {b.heading}
                        </h4>
                        <div className="space-y-1.5 text-sm text-white/90 leading-relaxed font-light">
                          {b.lines.map((l) => (
                            <p key={l}>{l}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  tab.text && (
                    <p className="mt-3 text-base text-white/90 leading-relaxed max-w-2xl font-light">
                      {tab.text}
                    </p>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Dedicated Content Section (Placed below image so photo is never covered or hidden) */}
        <div className="block sm:hidden p-4 bg-sand-50/50 border-t border-forest-900/10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-500/20 mb-2">
            <Compass className="size-3 text-emerald-600" />
            <span>Dr. Neeta&apos;s Homoeo Health Care</span>
          </div>

          <h3 className="font-serif text-xl font-bold text-forest-950">
            {tab.title}
          </h3>

          {tab.blocks && tab.blocks.length > 0 ? (
            <div className="mt-3 space-y-2.5">
              {tab.blocks.map((b) => (
                <div
                  key={b.heading}
                  className="rounded-xl bg-white p-3 border border-forest-900/10 shadow-xs"
                >
                  <h4 className="font-serif text-sm font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {b.heading}
                  </h4>
                  <div className="space-y-1 text-xs text-ink-soft leading-relaxed">
                    {b.lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            tab.text && (
              <p className="mt-2 text-xs text-ink-soft leading-relaxed">
                {tab.text}
              </p>
            )
          )}
        </div>

        {/* Bottom Interactive Progress Indicators */}
        <div className="px-6 py-4 bg-sand-50/60 border-t border-forest-900/10 flex items-center justify-end">
          <div className="flex items-center gap-2">
            {tabs.map((t, idx) => (
              <button
                key={t.title}
                type="button"
                onClick={() => go(idx)}
                aria-label={`Show ${t.title}`}
                className={`h-2 rounded-full transition-all duration-300 ${idx === active
                  ? "w-8 bg-forest-800"
                  : "w-2 bg-forest-800/20 hover:bg-forest-800/40"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
