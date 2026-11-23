"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Award, ClipboardList, GraduationCap, Hospital, Presentation, Stethoscope } from "lucide-react";

const ICONS = { Stethoscope, Award, GraduationCap, Hospital, ClipboardList, Presentation };
export type JourneyItem = { title: string; year: string; text: string; icon: keyof typeof ICONS };

/** Centre-line timeline: the line fills as you scroll, cards slide in from their side. */
export function JourneyTimeline({ items }: { items: JourneyItem[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative mx-auto mt-16 max-w-5xl">
      {/* Track + progress fill */}
      <span aria-hidden="true" className="absolute bottom-0 left-6 top-0 w-px bg-forest-800/15 md:left-1/2" />
      <motion.span
        aria-hidden="true"
        style={{ scaleY: reduce ? 1 : fill }}
        className="absolute bottom-0 left-6 top-0 w-px origin-top bg-gradient-to-b from-sage-400 via-forest-600 to-forest-800 md:left-1/2"
      />

      {items.map((j, i) => {
        const left = i % 2 === 1;
        const Icon = ICONS[j.icon];
        return (
          <li key={j.title} className={`relative pb-10 pl-16 last:pb-0 md:w-1/2 md:pl-0 ${left ? "md:pr-16" : "md:ml-auto md:pl-16"}`}>
            {/* Icon node on the line */}
            <motion.span
              aria-hidden="true"
              initial={reduce ? false : { scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`absolute left-6 top-6 z-10 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-forest-800 text-sage-200 shadow-lg shadow-forest-900/20 ring-[6px] ring-paper ${left ? "md:left-auto md:right-0 md:translate-x-1/2" : "md:left-0"}`}
            >
              <Icon className="size-5" />
            </motion.span>

            <motion.article
              initial={reduce ? false : { opacity: 0, x: left ? -40 : 40, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-sage-200/80 bg-paper/80 p-7 shadow-[0_1px_0_rgb(40_36_109/0.04)] backdrop-blur transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-sage-300 hover:shadow-2xl hover:shadow-forest-900/10"
            >
              {/* Soft glow that follows hover */}
              <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-sage-200/50 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
              {/* Big faint index number */}
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-4 right-5 select-none font-serif text-7xl leading-none text-forest-800/[0.05]">{String(i + 1).padStart(2, "0")}</span>

              <span className="relative inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-700">
                <span aria-hidden="true" className={`size-1.5 rounded-full ${j.year === "Present" ? "animate-pulse bg-sage-500" : "bg-forest-600"}`} />
                {j.year}
              </span>
              <h3 className="relative mt-4 text-2xl font-normal">{j.title}</h3>
              <p className="relative mt-3 text-ink-soft">{j.text}</p>
            </motion.article>
          </li>
        );
      })}
    </ol>
  );
}
