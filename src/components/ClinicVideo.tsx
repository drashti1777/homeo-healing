"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";

/**
 * Video with a still poster. Hovering (or focusing) the poster plays a muted preview of the first few seconds;
 * pressing play opens the full video with controls. The ~18 MB file is only requested after the visitor
 * hovers or presses play, never on page load.
 */
export function ClinicVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [preview, setPreview] = useState(false);

  // The <video> mounts on first hover (or play) and then stays mounted. `armed` is set before it mounts,
  // so the callback ref below can start playback the moment the element exists.
  const [armed, setArmed] = useState(false);
  const wantPlay = useRef<"preview" | "full" | null>(null);

  const attach = (v: HTMLVideoElement | null) => {
    ref.current = v;
    if (!v) return;
    if (wantPlay.current === "preview") { v.muted = true; v.loop = true; v.play().catch(() => {}); }
    if (wantPlay.current === "full") { v.muted = false; v.loop = false; v.currentTime = 0; v.play().catch(() => {}); }
  };

  const startPreview = () => {
    if (reduce || started) return;
    wantPlay.current = "preview";
    setPreview(true);
    setArmed(true);
    const v = ref.current;
    if (v) { v.muted = true; v.loop = true; v.play().catch(() => {}); }
  };
  const stopPreview = () => {
    if (wantPlay.current === "preview") wantPlay.current = null;
    setPreview(false);
    if (!started) ref.current?.pause();
  };
  const start = () => {
    wantPlay.current = "full";
    setStarted(true);
    setPreview(false);
    setArmed(true);
    const v = ref.current;
    if (v) { v.muted = false; v.loop = false; v.currentTime = 0; v.play().catch(() => {}); }
  };

  return (
    <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-forest-900 shadow-2xl shadow-forest-900/20">
      {/* The same <video> element serves the hover preview and the full playback. */}
      {armed && (
        <video
          ref={attach}
          src={src}
          poster={poster}
          controls={started}
          playsInline
          preload="auto"
          aria-label={title}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {!started && (
        <button
          type="button"
          onClick={start}
          onPointerEnter={(e) => { if (e.pointerType === "mouse") startPreview(); }}
          onPointerLeave={stopPreview}
          onFocus={startPreview}
          onBlur={stopPreview}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 grid place-items-center"
        >
          {/* Poster frame from the video itself; hidden once the preview is playing. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-105 ${preview ? "opacity-0" : "opacity-100"}`} />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-950/65 via-forest-950/10 to-forest-950/20" />
          <span className="relative grid place-items-center">
            {!reduce && !preview && <span aria-hidden="true" className="absolute size-24 animate-ping rounded-full bg-paper/25 [animation-duration:2.4s]" />}
            <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative grid size-24 place-items-center rounded-full bg-paper text-forest-800 shadow-xl">
              <Play className="ml-1 size-9 fill-current" aria-hidden="true" />
            </motion.span>
          </span>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-forest-950/50 px-4 py-1.5 text-sm font-medium tracking-wide text-paper backdrop-blur">
            {preview ? "Click to watch the full video" : "Hover for a quick preview"}
          </span>
        </button>
      )}
    </div>
  );
}
