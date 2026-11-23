"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Sparkles, HeartPulse } from "lucide-react";

export function OriginalIntroSection() {
  return (
    <section className="section bg-white py-16 lg:py-20 border-b border-forest-800/10">
      <div className="wrap">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Center Logo */}
            <div className="flex justify-center">
              <div className="relative h-14 w-48">
                <Image
                  src="/logo.webp"
                  alt="Dr. Neeta's Homeo Health Care Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950">
              Dr. Neeta&apos;s Homeo Health Care
            </h2>

            <div className="mx-auto max-w-3xl space-y-4 text-base sm:text-lg text-ink-soft leading-relaxed">
              <p className="font-medium text-forest-900">
                Yes! Homeopathy treatment is highly effective. Want to know why? Because it boosts immune system and body’s healing power.
              </p>
              <p>
                The aspect which makes Homeopathy different from other conventional medications is its way of treatment. A Homeopathy doctor understands the personality and emotions of the patient for knowing the complete nature of his body. The main goal of this treatment is to cure the complete body, instead of emphasizing on any single problem.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                href="/book-appointment"
                className="group inline-flex items-center gap-2.5 rounded-full bg-forest-800 px-8 py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-forest-800/20 transition-all hover:bg-forest-900 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Booked an appointment</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
