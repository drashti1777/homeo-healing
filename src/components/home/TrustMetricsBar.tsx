"use client";

import { motion } from "motion/react";
import { Activity, Clock, Heart, Leaf, MapPin, Shield, Sparkles, Stethoscope, Users } from "lucide-react";

const STATS = [
  {
    icon: Stethoscope,
    value: "15+",
    unit: "Years",
    title: "Clinical Experience",
    desc: "Dedicated advance homeopathic healing by Dr. Neeta Parmar.",
  },
  {
    icon: Users,
    value: "10,000+",
    unit: "Patients",
    title: "Treated Across Gujarat",
    desc: "Chronic respiratory, skin, female & pediatric conditions cured.",
  },
  {
    icon: Leaf,
    value: "100%",
    unit: "Natural",
    title: "Zero Side-Effects",
    desc: "Gentle remedies derived from natural mineral and herbal sources.",
  },
  {
    icon: MapPin,
    value: "2",
    unit: "Clinics",
    title: "Bhavnagar & Ahmedabad",
    desc: "Convenient clinic visits plus accessible online video consultations.",
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
                  <span className="font-serif text-2xl font-bold text-forest-900">
                    {item.value} <span className="text-xs font-sans font-medium text-emerald-600">{item.unit}</span>
                  </span>
                </div>
                <h3 className="font-serif text-base font-semibold text-forest-950">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-ink-soft leading-relaxed">
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
