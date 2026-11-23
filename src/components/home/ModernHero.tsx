"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, PhoneCall, ShieldCheck, Star } from "lucide-react";

export function ModernHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sage-50/70 via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient decorative shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sage-200/40 via-emerald-100/30 to-forest-800/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-24 -z-10 h-80 w-80 rounded-full bg-sage-300/20 blur-2xl"
      />

      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Headline & Action */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-forest-800/10 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-forest-800 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Providing Best Homeopathy Consultancy Services in India</span>
            </div>

            {/* Main Headline from original index.php */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-medium leading-[1.15] tracking-tight text-forest-950">
              Providing one of the best{" "}
              <span className="bg-gradient-to-r from-forest-800 via-forest-700 to-emerald-600 bg-clip-text text-transparent">
                Homoeopathic Treatment
              </span>{" "}
              at our Place
            </h1>

            {/* Subtitle from original index.php */}
            <p className="max-w-xl text-base sm:text-lg text-ink-soft leading-relaxed font-normal">
              Homeopathy is a system of natural medicine based upon the ancient principle of <em>“like cures like.”</em> Vast clinical experience in homeopathic treatments by <strong>Dr. Neeta Parmar</strong>.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/book-appointment"
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-forest-800 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-forest-800/25 transition-all duration-300 hover:bg-forest-900 hover:shadow-xl hover:shadow-forest-800/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Booked an appointment</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 rounded-full border border-forest-800/20 bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-forest-800 shadow-sm transition-all duration-200 hover:border-forest-800 hover:bg-sage-50/60 active:scale-[0.99]"
              >
                <span>Know More</span>
              </Link>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3 sm:gap-4 border-t border-forest-800/10">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-forest-900">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Vast Clinical Experience</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-forest-900">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Permanent Cure</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-forest-900 col-span-2 sm:col-span-1">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Safe for All Age Groups</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual with Floating Glass Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Frame */}
            <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-forest-800 to-forest-600 p-2 shadow-2xl shadow-forest-900/15">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[2.2rem] bg-sage-100">
                <Image
                  src="/gallery/hero-indian-doctor.webp"
                  alt="Dr. Neeta's Homeo Health Care - Vast Clinical Experience in Homeopathic Treatments"
                  fill
                  priority
                  sizes="(min-width: 1024px) 36rem, 90vw"
                  className="object-cover object-top"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent"
                />
              </div>
            </div>

            {/* Floating Glassmorphism Badge 1: Top-Left */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -top-4 -left-3 sm:-left-6 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-xl shadow-forest-900/10 backdrop-blur-md hidden sm:flex items-center gap-3"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Star className="size-5 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-forest-950 text-sm">Serving the best</span>
                </div>
                <p className="text-[11px] font-medium text-emerald-700">Treatments by Homeopathy</p>
              </div>
            </motion.div>

            {/* Floating Glassmorphism Badge 2: Bottom-Right */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="absolute -bottom-5 -right-2 sm:-right-4 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-xl shadow-forest-900/10 backdrop-blur-md flex items-center gap-3"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-forest-950">Safe &amp; Very Gentle</p>
                <p className="text-[11px] text-ink-soft">100% Side-effect free</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
