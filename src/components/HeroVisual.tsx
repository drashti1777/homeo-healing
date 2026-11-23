"use client";

import dynamic from "next/dynamic";

// Three.js loads only in the browser after first paint, so it never blocks LCP.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[36rem]">
      <div aria-hidden="true" className="absolute inset-[8%] rounded-[58%_42%_63%_37%/45%_55%_45%_55%] bg-sage-200/70" />
      <div aria-hidden="true" className="float absolute left-[2%] top-[14%] size-24 rounded-full bg-beige-300/70" />
      <div aria-hidden="true" className="float-slow absolute bottom-[10%] right-[4%] size-16 rounded-full bg-sage-300/70" />
      {/* Static botanical fallback: visible until WebGL paints, and for reduced-motion or no-WebGL visitors. */}
      <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute inset-[22%] text-forest-700/60" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M100 185V60" />
        <path d="M100 150c-34 0-50-22-52-52 30 0 50 18 52 52Z" />
        <path d="M100 120c34 0 50-22 52-52-30 0-50 18-52 52Z" />
        <path d="M100 85c-22-8-30-28-26-52 20 6 30 26 26 52Z" />
      </svg>
      <HeroScene />
    </div>
  );
}
