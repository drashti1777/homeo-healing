"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

const PARAGRAPH = "Homeopathy is a system of natural medicine based upon the ancient principle of “like cures like.”";

const SLIDES = [
  { src: "/gallery/banner-homepathic01.webp", title: "Providing one of the best Homoeopathic Treatment at our Place", cta: true },
  { src: "/gallery/banner-homepathic02.webp", title: "Vast Clinical Experience in Homeopathic Treatments", cta: true },
  { src: "/gallery/banner-homepathic03.webp", title: "Serving the best treatments By Homeopathy", cta: true },
];

const INTERVAL = 6000;

const rise = (reduce: boolean | null) => ({
  hidden: { opacity: 0, x: reduce ? 0 : -16 },
  show: { opacity: 1, x: 0, transition: { duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const } },
});

export function BannerSlider() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const id = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(id);
  }, [index, go]);

  const slide = SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Homeopathy highlights"
      className="relative min-h-[30rem] h-[82vh] max-h-[44rem] sm:min-h-[34rem] sm:h-[75vh] md:h-[40rem] lg:h-[44rem] overflow-hidden bg-forest-900"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: "easeInOut" }}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${SLIDES.length}`}
        >
          {/* Slow "Ken Burns" zoom while the slide is visible */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: reduce ? 1 : 1.1 }}
            transition={{ duration: (INTERVAL + 1500) / 1000, ease: "linear" }}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[75%_center] md:object-center"
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 md:bg-gradient-to-r md:from-black/75 md:via-black/50 md:to-black/10"
          />
          <div className="wrap relative flex h-full flex-col justify-center pt-20 sm:pt-24 md:pt-[4.5rem] pb-14 sm:pb-8">
            {/* Heading, paragraph and button rise in one after another */}
            <motion.div
              className="max-w-xl md:max-w-2xl text-white"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.15, delayChildren: reduce ? 0 : 0.35 } } }}
            >
              <motion.h2
                variants={rise(reduce)}
                className="text-[clamp(1.4rem,4.2vw,3.75rem)] font-normal leading-[1.2] sm:leading-tight text-white"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                variants={rise(reduce)}
                className="mt-3 sm:mt-5 max-w-lg sm:max-w-xl text-xs sm:text-base md:text-lg text-white/90 leading-relaxed"
              >
                {PARAGRAPH}
              </motion.p>
              {slide.cta && (
                <motion.div variants={rise(reduce)}>
                  <Link href="/about" className="btn btn-primary group mt-6 sm:mt-8 inline-flex text-sm sm:text-base !px-5 !py-3">
                    Know more <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 z-10 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={`relative h-2 overflow-hidden rounded-full transition-all ${i === index ? "w-8 sm:w-10 bg-white/35" : "w-2 bg-white/50 hover:bg-white/80"}`}
          >
            {/* Active dot fills up until the next slide */}
            {i === index && (
              <motion.span
                key={index}
                aria-hidden="true"
                className="absolute inset-0 origin-left rounded-full bg-white"
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
