"use client";

import { motion } from "motion/react";
import { Activity, Clock, Heart, Leaf, MapPin, Shield, Sparkles, Stethoscope, Users } from "lucide-react";

const STATS = [
  {
    icon: Stethoscope,
    badge: "Clinical Care",
    title: "Vast Clinical Experience",
    desc: "Decades of expert practice in advanced homeopathic constitutional healing by Dr. Neeta Parmar.",
  },
  {
    icon: Heart,
    badge: "Holistic",
    title: "Whole-Body Treatment",
    desc: "Understanding the complete personality and emotions to cure the whole body instead of single symptoms.",
  },
  {
    icon: Leaf,
    badge: "Natural",
    title: "Safe & Acting Very Gently",
    desc: "Proven to have no side effects, safe from pediatric to geriatric age groups with sweet natural pills.",
  },
  {
    icon: MapPin,
    badge: "Gujarat",
    title: "Bhavnagar & Ahmedabad",
    desc: "Consultations in Bhavnagar (R.T.O Road) and Ahmedabad (Motera, 4D Square), plus online care.",
  },
];

export function TrustMetricsBar() {
  return (
    <section className="relative -mt-6 sm:-mt-8 z-10 mb-12">
      <div className="wrap">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-3xl border border-forest-800/10 bg-white p-6 shadow-md shadow-forest-900/5 transition-all duration-300 hover:border-forest-800/20 hover:shadow-xl hover:shadow-forest-900/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-sage-50 text-forest-800 transition-colors duration-300 group-hover:bg-forest-800 group-hover:text-white">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-sage-100/70 px-3 py-1 text-xs font-semibold text-forest-800">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
