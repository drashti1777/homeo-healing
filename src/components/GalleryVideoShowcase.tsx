"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "motion/react";
import { Video } from "lucide-react";
import { ClinicVideo } from "@/components/ClinicVideo";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function GalleryVideoShowcase() {
  const reduce = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduce
      ? { initial: false, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, y: -30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.75, delay, ease: EASE_OUT },
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
        opacity: [0.35, 0.65, 0.35],
        transition: {
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-white via-sand-50/50 to-white py-16 lg:py-24" aria-labelledby="g-videos">
      <motion.div
        aria-hidden="true"
        animate={glowAnimation}
        className="pointer-events-none absolute -left-40 top-20 size-[28rem] rounded-full bg-emerald-100/40 blur-3xl -z-10"
      />
      <motion.div
        aria-hidden="true"
        animate={glowAnimation}
        className="pointer-events-none absolute -right-40 bottom-20 size-[28rem] rounded-full bg-sage-100/50 blur-3xl -z-10"
      />

      <div className="wrap">
        <motion.div {...fadeUp(0)} className="mx-auto max-w-3xl text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
            <Video className="size-3.5 text-emerald-600 animate-pulse" />
            Video Showcase
          </span>
          <h2 id="g-videos" className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
            Watch Our Clinic Tour &amp; Patient Stories
          </h2>
          <p className="mt-3 text-base text-ink-soft">
            Experience a walkthrough of our facilities and watch real patients speak about their homeopathic healing journey.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Video 1: Clinic Walkthrough */}
          <motion.div
            {...cardAnim(0.25)}
            whileHover={reduce ? undefined : { y: -6, scale: 1.01, transition: { duration: 0.25 } }}
            className="flex flex-col justify-between rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-xl shadow-forest-900/5 border border-forest-800/10 transition-colors duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/10"
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest-800">
                Virtual Walkthrough
              </span>
              <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-forest-950">
                Dr. Neeta&apos;s Clinic Tour
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-ink-soft">
                Step inside our Bhavnagar clinic to see our patient reception, consult room, and clean dispensary.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-2xl shadow-inner bg-sage-900/5">
              <ClinicVideo
                src="/gallery/clinic-tour.mp4"
                poster="/gallery/clinic-tour-poster.webp"
                title="Watch the clinic tour"
              />
            </div>
          </motion.div>

          {/* Video 2: Patient Testimonial */}
          <motion.div
            {...cardAnim(0.55)}
            whileHover={reduce ? undefined : { y: -6, scale: 1.01, transition: { duration: 0.25 } }}
            className="flex flex-col justify-between rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-xl shadow-forest-900/5 border border-forest-800/10 transition-colors duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/10"
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20">
                Patient Story
              </span>
              <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-forest-950">
                Video Testimonials &amp; Recovery
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-ink-soft">
                Hear firsthand experiences of permanent relief and holistic recovery from treated patients.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-2xl shadow-inner bg-sage-900/5">
              <YouTubeEmbed
                id="MmN6xSjrdtk"
                title="Video Testimonials: Dr. Neeta's Homeo Healing"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
