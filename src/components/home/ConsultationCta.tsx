"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CalendarCheck, Clock, Mail, MapPin, PhoneCall } from "lucide-react";

export function ConsultationCta() {
  return (
    <section className="section py-16 lg:py-24 bg-white text-forest-950 relative overflow-hidden">
      {/* Decorative ambient background with delicate mint & brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-sand-100/80 blur-3xl"
      />

      <div className="wrap relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-center space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Dr. Neeta&apos;s Homeo Health Care
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
            Consult Us Now
          </h2>

          <p className="text-base sm:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed">
            Our Mission Of Compassion. Our Vision Of Excellence. Book an appointment or contact Dr. Neeta Parmar directly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2.5 rounded-full bg-forest-800 px-8 py-4 text-sm sm:text-base font-semibold text-white shadow-xl shadow-forest-900/20 transition-all duration-300 hover:bg-forest-900 hover:shadow-forest-900/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <CalendarCheck className="size-4 text-emerald-400" />
              <span>Book an appointment</span>
              <ArrowRight className="size-4" />
            </Link>

            <a
              href="tel:+918160602060"
              className="inline-flex items-center gap-2.5 rounded-full border border-forest-800/20 bg-white px-7 py-4 text-sm sm:text-base font-semibold text-forest-800 shadow-sm transition-all duration-300 hover:bg-forest-50 hover:border-forest-800/40 active:scale-[0.99]"
            >
              <PhoneCall className="size-4 text-emerald-600" />
              <span>+91 81606 02060</span>
            </a>
          </div>

          {/* Quick Clinic Branches Info Cards */}
          <div className="grid gap-4 sm:grid-cols-2 pt-8 text-left">
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-3xl border border-forest-800/10 bg-sage-50/70 p-5.5 transition-all hover:border-emerald-500/40 hover:bg-sage-50 hover:shadow-xl hover:shadow-forest-900/5"
            >
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <div className="flex size-6 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-xs">
                  <MapPin className="size-3.5" />
                </div>
                <span>Bhavnagar Clinic</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-ink-soft leading-relaxed">
                2nd Floor, Ratna Plaza complex, R.T.O, Vithalwadi Road, Above R.K travels, Opposite Madhav Complex, Shastrinagar, Bhavnagar, Gujarat
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-3xl border border-forest-800/10 bg-sage-50/70 p-5.5 transition-all hover:border-emerald-500/40 hover:bg-sage-50 hover:shadow-xl hover:shadow-forest-900/5"
            >
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <div className="flex size-6 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-xs">
                  <MapPin className="size-3.5" />
                </div>
                <span>Ahmedabad Clinic</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-ink-soft leading-relaxed">
                32_FF, 1st Floor, 4D Square, Opp IIT Eng. College, Nr.Visat Petrol Pump to Gandhinagar Highway, Motera, Ahmedabad, Gujarat
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
