"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Award, HeartPulse, Pill, Stethoscope, Target } from "lucide-react";

const ICONS = { Pill, Stethoscope, Award, Target, HeartPulse };

export type BestTab = {
  icon: keyof typeof ICONS;
  title: string;
  image: string;
  imageAlt: string;
  text?: string;
  /** Optional titled blocks (used for Vision & Mission). */
  blocks?: { heading: string; lines: string[] }[];
};

const INTERVAL = 7000;

/**
 * "What Makes Us Best": vertical tabs on the left (auto-advance with a progress bar),
 * large image on the right that crossfades, zooms in and tilts slightly with the pointer.
 */
export function BestShowcase({ tabs }: { tabs: BestTab[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tablistRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const go = useCallback((i: number) => setActive((i + tabs.length) % tabs.length), [tabs.length]);

  useEffect(() => {
    if (paused || reduce) return;
    const id = setTimeout(() => go(active + 1), INTERVAL);
    return () => clearTimeout(id);
  }, [active, paused, reduce, go]);

  // Keep active tab centered in horizontal scroll on mobile
  useEffect(() => {
    const el = tabRefs.current[active];
    const container = tablistRef.current;
    if (!el || !container) return;
    if (container.scrollWidth > container.clientWidth) {
      const targetLeft = el.offsetLeft - (container.clientWidth - el.clientWidth) / 2;
      container.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [active]);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = tablistRef.current;
    if (!el) return;
    isDragging.current = true;
    dragged.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = tablistRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 4) {
      dragged.current = true;
    }
    el.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    setTimeout(() => {
      dragged.current = false;
    }, 50);
  };

  // Pointer tilt for the image card.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 20 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + tabs.length) % tabs.length;
    go(n);
    tabRefs.current[n]?.focus();
  };

  const tab = tabs[active];

  return (
    <div
      className="mt-14 grid min-w-0 w-full max-w-full gap-8 lg:grid-cols-[minmax(15rem,0.75fr)_2fr] lg:gap-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Tabs */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="What makes us best"
        aria-orientation="vertical"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ WebkitOverflowScrolling: "touch" }}
        className="relative flex min-w-0 w-full max-w-full gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x cursor-grab active:cursor-grabbing lg:cursor-default lg:flex-col lg:overflow-visible lg:border-l lg:border-forest-800/15 lg:pb-0 lg:pl-0"
      >
        {tabs.map((t, i) => {
          const Icon = ICONS[t.icon];
          const on = i === active;
          return (
            <button
              key={t.title}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              id={`best-tab-${i}`}
              aria-selected={on}
              aria-controls="best-panel"
              tabIndex={on ? 0 : -1}
              onPointerEnter={(e) => { if (!dragged.current && !isDragging.current && e.pointerType === "mouse") go(i); }}
              onClick={() => { if (!dragged.current) go(i); }}
              onKeyDown={(e) => onKey(e, i)}
              className={`group relative flex shrink-0 items-center gap-4 overflow-hidden rounded-2xl px-4 py-3.5 text-left transition-colors duration-500 lg:-ml-px lg:rounded-l-none lg:rounded-r-2xl lg:pl-6 ${on ? "text-paper" : "text-forest-800 hover:bg-sage-100/70"}`}
            >
              {on && (
                <motion.span
                  layoutId="best-pill"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-2xl bg-forest-800 lg:rounded-l-none"
                />
              )}
              {/* Active marker on the vertical line */}
              {on && <motion.span layoutId="best-marker" aria-hidden="true" className="absolute inset-y-2 left-0 hidden w-[3px] rounded-full bg-sage-400 lg:block" />}
              <span className={`relative grid size-10 shrink-0 place-items-center rounded-full transition-[background-color,transform] duration-500 group-hover:rotate-6 ${on ? "bg-paper/15 text-sage-200" : "bg-sage-100 text-forest-700"}`}>
                <Icon className="size-[1.1rem]" aria-hidden="true" />
              </span>
              <span className="relative whitespace-nowrap font-medium">{t.title}</span>
              {/* Auto-advance progress */}
              {on && !reduce && (
                <motion.span
                  key={`p-${active}-${paused}`}
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-1.5 h-0.5 origin-left rounded-full bg-sage-300/70"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused ? 0 : 1 }}
                  transition={{ duration: paused ? 0.2 : INTERVAL / 1000, ease: "linear" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div id="best-panel" role="tabpanel" aria-labelledby={`best-tab-${active}`} className="min-w-0">
        <div className="[perspective:1400px]" onPointerMove={onMove} onPointerLeave={onLeave}>
          <motion.div
            style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}
            className="relative aspect-[16/10] sm:aspect-[869/384] overflow-hidden rounded-[2rem] bg-sage-100 shadow-2xl shadow-forest-900/15 [transform-style:preserve-3d]"
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={tab.image}
                className="absolute inset-0"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.12, clipPath: "inset(0% 0% 0% 100%)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.2 : 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <Image src={tab.image} alt={tab.imageAlt} fill sizes="(min-width:1024px) 60vw, 100vw" priority={active === 0} className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/55 via-forest-900/0 to-transparent" />
            {/* Floating title chip over the image */}
            <AnimatePresence mode="wait">
              <motion.span
                key={tab.title}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : 0.35 }}
                className="glass absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-forest-800 [transform:translateZ(40px)]"
              >
                <span className="size-1.5 rounded-full bg-sage-500" aria-hidden="true" />
                {String(active + 1).padStart(2, "0")} / {String(tabs.length).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab.title}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            {tab.blocks?.length ? (
              <div className="grid gap-8 md:grid-cols-2">
                {tab.blocks.map((b) => (
                  <div key={b.heading} className="rounded-[1.5rem] border border-sage-200 bg-paper p-6">
                    <h3 className="text-2xl font-normal">{b.heading}</h3>
                    {b.lines.map((l) => <p key={l} className="mt-3 text-ink-soft">{l}</p>)}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <h3 className="text-[clamp(1.5rem,2.6vw,2rem)] font-normal">{tab.title}</h3>
                {tab.text && <p className="mt-3 max-w-2xl text-lg text-ink-soft">{tab.text}</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
