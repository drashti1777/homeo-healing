"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CalendarCheck, Clock, Mail, MapPin, PhoneCall } from "lucide-react";

export function ConsultationCta() {
  return (
    <section className="section py-16 lg:py-24 bg-forest-950 text-white relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-forest-600/30 blur-3xl"
      />

      <div className="wrap relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center space-y-6"
        >
          <span className="inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
            Dr. Neeta&apos;s Homeo Health Care
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
            Consult Us Now
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Our Mission Of Compassion. Our Vision Of Excellence. Book an appointment or contact Dr. Neeta Parmar directly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500 px-8 py-4 text-sm sm:text-base font-semibold text-forest-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:bg-emerald-400 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <CalendarCheck className="size-4 text-forest-950" />
              <span>Book now...</span>
              <ArrowRight className="size-4" />
            </Link>

            <a
              href="tel:+918160602060"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/40 active:scale-[0.99]"
            >
              <PhoneCall className="size-4 text-emerald-400" />
              <span>+91 81606 02060</span>
            </a>
          </div>

          {/* Quick Clinic Branches Info */}
          <div className="grid gap-4 sm:grid-cols-2 pt-8 border-t border-white/10 text-left">
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-emerald-400/40 hover:bg-white/10"
            >
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <MapPin className="size-3.5" />
                <span>Bhavnagar Clinic</span>
              </div>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                2nd Floor, Ratna Plaza complex, R.T.O, Vithalwadi Road, Above R.K travels, Opposite Madhav Complex, Shastrinagar, Bhavnagar, Gujarat
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-emerald-400/40 hover:bg-white/10"
            >
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <MapPin className="size-3.5" />
                <span>Ahmedabad Clinic</span>
              </div>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                32_FF, 1st Floor, 4D Square, Opp IIT Eng. College, Nr.Visat Petrol Pump to Gandhinagar Highway, Motera, Ahmedabad, Gujarat
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
