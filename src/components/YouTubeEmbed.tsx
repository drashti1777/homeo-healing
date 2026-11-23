"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";

/**
 * Click-to-load YouTube player. The YouTube iframe (and its cookies/scripts) is only requested after the visitor
 * presses play. Uses the privacy-enhanced youtube-nocookie.com domain.
 */
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-forest-900 shadow-2xl shadow-forest-900/20">
      {started ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setStarted(true)} aria-label={`Play video: ${title}`} className="group absolute inset-0 grid place-items-center">
          {/* YouTube's own thumbnail. A plain <img> keeps next.config.ts untouched (next/image would need the host allow-listed). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105" />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-forest-950/10 to-forest-950/20" />
          <span className="relative grid place-items-center">
            {!reduce && <span aria-hidden="true" className="absolute size-24 animate-ping rounded-full bg-paper/25 [animation-duration:2.4s]" />}
            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative grid size-24 place-items-center rounded-full bg-paper text-forest-800 shadow-xl">
              <Play className="ml-1 size-9 fill-current" aria-hidden="true" />
            </motion.span>
          </span>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium tracking-wide text-paper">{title}</span>
        </button>
      )}
    </div>
  );
}
