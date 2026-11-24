"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, PhoneCall, ShieldCheck, Sparkles, Star } from "lucide-react";

const SLIDES = [
  {
    src: "/gallery/hero-indian-doctor.webp",
    badge: "Our Mission Of Compassion. Our Vision Of Excellence.",
    title: "Providing one of the best Homoeopathic Treatment at our Place",
    subtitle: "Homeopathy is a system of natural medicine based upon the ancient principle of “like cures like.” Vast clinical experience in homeopathic treatments by Dr. Neeta Parmar.",
    cta: "Booked an appointment",
    href: "/book-appointment",
    knowMoreHref: "/about",
  },
  {
    src: "/gallery/indian-consultation.webp",
    badge: "Bhavnagar & Ahmedabad Clinics • Since 2011",
    title: "Vast Clinical Experience in Homeopathic Treatments",
    subtitle: "Personalized constitutional care understanding the complete nature, personality, and emotions of each patient to heal the root cause permanently.",
    cta: "Booked an appointment",
    href: "/book-appointment",
    knowMoreHref: "/about",
  },
  {
    src: "/gallery/indian-family-health.webp",
    badge: "100% Gentle & Safe • From Pediatric to Geriatric",
    title: "Serving the best treatments By Homeopathy",
    subtitle: "Stimulating the body's natural defense force with non-toxic, sweet micro-dilutions that have zero chemical side effects.",
    cta: "Booked an appointment",
    href: "/book-appointment",
    knowMoreHref: "/treatments",
  },
];

const INTERVAL = 6000;

const rise = (reduce: boolean | null, delay = 0) => ({
  hidden: { opacity: 0, y: reduce ? 0 : 20 },
  show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, delay, ease: [0.16, 1, 0.3, 1] as const } },
});

export function FullScreenHeroBanner() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<"book" | "know" | null>(null);

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, go]);

  const slide = SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Homeopathy Highlights Banner"
      className="relative w-full min-h-[100dvh] overflow-hidden bg-forest-900 flex flex-col justify-center"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: "easeInOut" }}
        >
          {/* Background Image with Ken Burns Zoom */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: reduce ? 1 : 1.08 }}
            transition={{ duration: (INTERVAL + 1500) / 1000, ease: "linear" }}
          >
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[center_30%]"
            />
          </motion.div>

          {/* Deep Cinematic Gradient Overlay with lighter opacity for brighter visual */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-forest-950/85 via-forest-950/55 to-forest-950/20"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-transparent to-forest-950/40"
          />

          {/* Slide Text Content */}
          <div className="wrap relative flex min-h-[100dvh] flex-col justify-center pt-24 sm:pt-32 pb-24 sm:pb-20">
            <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5 text-white">
              {/* Badge */}
              <motion.div
                variants={rise(reduce, 0.1)}
                initial="hidden"
                animate="show"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-md max-w-full"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="truncate">{slide.badge}</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={rise(reduce, 0.25)}
                initial="hidden"
                animate="show"
                className="font-serif text-2xl xs:text-3xl sm:text-5xl lg:text-[3.5rem] font-medium leading-[1.18] sm:leading-[1.14] text-white tracking-tight"
              >
                {slide.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={rise(reduce, 0.4)}
                initial="hidden"
                animate="show"
                className="max-w-xl text-sm sm:text-lg text-white/85 leading-relaxed line-clamp-3 sm:line-clamp-none"
              >
                {slide.subtitle}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={rise(reduce, 0.55)}
                initial="hidden"
                animate="show"
                className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-3"
              >
                <Link
                  href={slide.href}
                  onMouseEnter={() => setHoveredBtn("book")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className={`peer group inline-flex items-center gap-2 rounded-full px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-base font-bold transition-all duration-200 cursor-pointer ${
                    hoveredBtn === "book" || hoveredBtn === "know"
                      ? "border border-white/35 bg-white/10 text-white shadow-none backdrop-blur-sm -translate-y-0.5"
                      : "border border-transparent bg-emerald-500 text-forest-950 shadow-xl shadow-emerald-500/25 hover:bg-white/10 hover:text-white hover:border-white/35 hover:shadow-none hover:backdrop-blur-sm hover:-translate-y-0.5 active:bg-white/20 active:text-white active:border-white/50 active:scale-95 active:translate-y-0"
                  }`}
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href={slide.knowMoreHref}
                  onMouseEnter={() => setHoveredBtn("know")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3.5 sm:px-7 sm:py-4 text-xs sm:text-base font-semibold backdrop-blur-sm transition-all duration-200 cursor-pointer ${
                    hoveredBtn === "book" || hoveredBtn === "know"
                      ? "border border-emerald-500 bg-emerald-500 text-forest-950 shadow-xl shadow-emerald-500/25 -translate-y-0.5"
                      : "border border-white/30 bg-white/10 text-white peer-hover:border-emerald-500 peer-hover:bg-emerald-500 peer-hover:text-forest-950 peer-hover:shadow-xl peer-hover:shadow-emerald-500/25 peer-hover:-translate-y-0.5 peer-active:bg-emerald-600 peer-active:border-emerald-600 hover:border-emerald-500 hover:bg-emerald-500 hover:text-forest-950 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:bg-emerald-600 active:text-forest-950 active:border-emerald-600 active:scale-95 active:translate-y-0"
                  }`}
                >
                  <span>Know More</span>
                </Link>

                <a
                  href="tel:+918160602060"
                  className="inline-flex sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-emerald-300 py-1"
                >
                  <PhoneCall className="size-3.5 sm:size-4 text-emerald-400" />
                  <span>+91 81606 02060</span>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators (Bottom Dots / Progress Bars) */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center items-center gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 ${i === index ? "w-10 sm:w-12 bg-white/30" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
          >
            {i === index && (
              <motion.span
                key={index}
                className="absolute inset-0 origin-left rounded-full bg-emerald-400"
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduce ? 0 : INTERVAL / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
