"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, ArrowRight } from "lucide-react";

export function AboutDoctorButtons() {
  const [hoveredBtn, setHoveredBtn] = useState<"book" | "contact" | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-4 pt-3">
      <Link
        href="/book-appointment"
        onMouseEnter={() => setHoveredBtn("book")}
        onMouseLeave={() => setHoveredBtn(null)}
        className={`group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer ${
          hoveredBtn === "book" || hoveredBtn === "contact"
            ? "border border-forest-800/20 bg-white text-forest-800 shadow-sm -translate-y-0.5"
            : "border border-transparent bg-emerald-500 text-forest-950 shadow-lg shadow-emerald-500/25 active:scale-95"
        }`}
      >
        <CalendarCheck
          className={`size-4 shrink-0 transition-colors ${
            hoveredBtn === "book" || hoveredBtn === "contact" ? "text-forest-800" : "text-forest-950"
          }`}
        />
        <span>Book Consultation</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 shrink-0" />
      </Link>

      <Link
        href="/contact"
        onMouseEnter={() => setHoveredBtn("contact")}
        onMouseLeave={() => setHoveredBtn(null)}
        className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer ${
          hoveredBtn === "book" || hoveredBtn === "contact"
            ? "border border-emerald-500 bg-emerald-500 text-forest-950 shadow-lg shadow-emerald-500/25 -translate-y-0.5"
            : "border border-forest-800/20 bg-white text-forest-800 shadow-sm active:bg-emerald-600 active:text-forest-950 active:scale-95"
        }`}
      >
        <span>Contact Clinic</span>
      </Link>
    </div>
  );
}
