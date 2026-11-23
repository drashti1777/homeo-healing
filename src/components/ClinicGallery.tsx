"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export type GallerySectionImage = { src: string; alt: string; width: number; height: number };
export type GallerySection = { id: string; title: string; blurb?: string; images: GallerySectionImage[] };

/**
 * Gallery as titled sections (Team, Consultation Room, ...). Every photo opens in one shared lightbox,
 * so left/right arrows walk through the whole gallery in page order.
 */
export function ClinicGallery({ sections }: { sections: GallerySection[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  // One flat list, so the lightbox can step across sections.
  const flat = useMemo(() => sections.flatMap((s) => s.images.map((img) => ({ ...img, section: s.title }))), [sections]);
  const offsets = useMemo(() => {
    let n = 0;
    return sections.map((s) => { const start = n; n += s.images.length; return start; });
  }, [sections]);
  const current = index === null ? null : flat[index];

  const close = useCallback(() => { setIndex(null); requestAnimationFrame(() => opener.current?.focus()); }, []);
  const step = useCallback((d: 1 | -1) => setIndex((i) => (i === null ? i : (i + d + flat.length) % flat.length)), [flat.length]);

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [index, close, step]);

  return (
    <>
      <div className="space-y-24 md:space-y-32">
        {sections.map((s, si) => {
          const single = s.images.length === 1;
          return (
            <section key={s.id} aria-labelledby={`g-${s.id}`}>
              <div className="max-w-2xl mb-8">
                <p className="eyebrow mb-4" data-reveal>{String(si + 1).padStart(2, "0")}</p>
                <h2 id={`g-${s.id}`} data-split className="text-[clamp(1.9rem,4vw,3rem)] font-normal">{s.title}</h2>
                {s.blurb && <p className="mt-5 text-ink-soft" data-reveal>{s.blurb}</p>}
              </div>

              {/* Compact, even grid: 4 photos in a row on desktop, 2 on tablet/phone, so nothing is stretched past its real size. */}
              <ul className={`mt-12 grid gap-4 ${single ? "mx-auto max-w-md grid-cols-1" : s.images.length === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
                {s.images.map((img, i) => (
                  <li key={img.src} data-clip data-delay={(i % 4) * 0.12}>
                    <button
                      type="button"
                      onClick={(e) => { opener.current = e.currentTarget; setIndex(offsets[si] + i); }}
                      aria-label={`Open image: ${img.alt}`}
                      className="group relative block w-full overflow-hidden rounded-[1.75rem] bg-sage-100 shadow-lg shadow-forest-900/5 transition-[transform,box-shadow] duration-700 ease-out-expo hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-forest-900/15"
                    >
                      <span className="block aspect-[4/3]">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={img.width}
                          height={img.height}
                          loading="lazy"
                          sizes={single ? "(min-width:640px) 28rem, 90vw" : "(min-width:1024px) 25vw, 50vw"}
                          className="size-full object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.07]"
                        />
                      </span>
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span aria-hidden="true" className="glass pointer-events-none absolute right-4 top-4 grid size-10 translate-y-2 place-items-center rounded-full text-forest-800 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <Maximize2 className="size-4" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {current && index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${index + 1} of ${flat.length}: ${current.alt}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="fixed inset-0 z-[80] flex flex-col bg-forest-950/95 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && close()}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <div className="flex items-center justify-between px-4 py-4 text-paper sm:px-8">
              <p className="text-sm text-sage-200" aria-live="polite">{index + 1} / {flat.length} · {current.section}</p>
              <button ref={closeBtn} type="button" onClick={close} aria-label="Close" className="grid size-11 place-items-center rounded-full bg-paper/10 hover:bg-paper/20"><X className="size-5" /></button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={current.src}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex max-h-full flex-col items-center"
                >
                  <Image src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="100vw" className="max-h-[78vh] w-auto rounded-xl object-contain" priority />
                  <figcaption className="mt-4 max-w-2xl text-center text-sm text-sage-100">{current.alt}</figcaption>
                </motion.figure>
              </AnimatePresence>
              {flat.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20 sm:left-6"><ChevronLeft className="size-6" /></button>
                  <button type="button" onClick={() => step(1)} aria-label="Next image" className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20 sm:right-6"><ChevronRight className="size-6" /></button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
