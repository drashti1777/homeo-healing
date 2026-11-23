"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Review = { name: string; location?: string; quote: string };

const INTERVAL = 8000;
const LONG = 300;

const initials = (name: string) =>
  name.replace(/\(.*?\)/g, "").replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

export function TestimonialSlider({ reviews }: { reviews: Review[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const go = useCallback((dir: number) => {
    setExpanded(false);
    setIndex((i) => (i + dir + reviews.length) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    if (expanded || reviews.length < 2) return;
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, expanded, go, reviews.length]);

  const r = reviews[index];
  const isLong = r.quote.length > LONG;

  return (
    <div className="relative mx-auto max-w-4xl" aria-roledescription="carousel" aria-label="Patient testimonials">
      <Quote aria-hidden="true" className="mx-auto size-8 text-sage-400" />

      <div className="relative mt-4 min-h-[12rem]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -16 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${reviews.length}`}
          >
            <blockquote className={`font-serif text-[clamp(1.05rem,1.7vw,1.25rem)] leading-relaxed text-paper ${isLong && !expanded ? "line-clamp-4" : ""}`}>
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            {isLong && (
              <button type="button" onClick={() => setExpanded((e) => !e)} className="link-line mt-2 text-sm font-semibold text-sage-300">
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
            <figcaption className="mt-5 flex items-center justify-center gap-3">
              <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-sage-300 font-serif text-forest-900">{initials(r.name)}</span>
              <span className="text-left">
                <span className="block font-semibold text-paper">{r.name}</span>
                {r.location && <span className="block text-sm text-sage-300">{r.location}</span>}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {reviews.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-5">
          <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid size-11 place-items-center rounded-full border border-paper/25 text-paper transition hover:bg-paper/10">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <div className="flex gap-2">
            {reviews.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => { setExpanded(false); setIndex(i); }}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-sage-300" : "w-2 bg-paper/30 hover:bg-paper/60"}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid size-11 place-items-center rounded-full border border-paper/25 text-paper transition hover:bg-paper/10">
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
