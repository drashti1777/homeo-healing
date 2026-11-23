"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export type GalleryItem = { id: string; src: string; alt: string; caption: string; category: string; width: number; height: number };

export function GalleryGrid({ items, categories }: { items: GalleryItem[]; categories: { key: string; label: string }[] }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const visible = useMemo(() => (filter === "all" ? items : items.filter((i) => i.category === filter)), [items, filter]);
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.key, items.filter((i) => i.category === c.key).length])), [items, categories]);
  const current = index === null ? null : visible[index];
  const labelOf = (key: string) => categories.find((c) => c.key === key)?.label ?? key;

  const close = useCallback(() => { setIndex(null); requestAnimationFrame(() => opener.current?.focus()); }, []);
  const step = useCallback((d: 1 | -1) => setIndex((i) => (i === null ? i : (i + d + visible.length) % visible.length)), [visible.length]);

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
    <div>
      <div role="group" aria-label="Filter gallery" className="flex flex-wrap gap-2">
        {[{ key: "all", label: "All", n: items.length }, ...categories.filter((c) => counts[c.key]).map((c) => ({ ...c, n: counts[c.key] }))].map((c) => {
          const active = filter === c.key;
          return (
            <button key={c.key} type="button" aria-pressed={active} onClick={() => setFilter(c.key)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-paper" : "text-forest-800 ring-1 ring-sage-200 hover:bg-sage-100"}`}>
              {active && <motion.span layoutId="gallery-pill" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-forest-800" />}
              <span className="relative">{c.label} <span className={active ? "text-sage-200" : "text-ink-soft"}>{c.n}</span></span>
            </button>
          );
        })}
      </div>

      {/* Masonry via CSS columns: images keep their natural aspect ratio. */}
      <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((img, i) => (
            <motion.li key={img.id} layout={!reduce} initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="break-inside-avoid">
              <button
                type="button"
                onClick={(e) => { opener.current = e.currentTarget; setIndex(i); }}
                aria-label={`Open image: ${img.alt}`}
                className="group relative block w-full overflow-hidden rounded-[1.5rem] bg-sage-100"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width || 1200}
                  height={img.height || 900}
                  loading="lazy"
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left text-paper opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 sm:translate-y-2">
                  <span>
                    <span className="block text-[0.7rem] uppercase tracking-[0.14em] text-sage-200">{labelOf(img.category)}</span>
                    {img.caption && <span className="block font-serif text-lg">{img.caption}</span>}
                  </span>
                  <Maximize2 className="size-5 shrink-0" aria-hidden="true" />
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {current && index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${index + 1} of ${visible.length}: ${current.alt}`}
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
              <p className="text-sm text-sage-200" aria-live="polite">{index + 1} / {visible.length} · {labelOf(current.category)}</p>
              <button ref={closeBtn} type="button" onClick={close} aria-label="Close" className="grid size-11 place-items-center rounded-full bg-paper/10 hover:bg-paper/20"><X className="size-5" /></button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={current.id}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex max-h-full flex-col items-center"
                >
                  <Image src={current.src} alt={current.alt} width={current.width || 1600} height={current.height || 1200} sizes="100vw" className="max-h-[78vh] w-auto rounded-xl object-contain" priority />
                  {(current.caption || current.alt) && <figcaption className="mt-4 max-w-2xl text-center text-sm text-sage-100">{current.caption || current.alt}</figcaption>}
                </motion.figure>
              </AnimatePresence>
              {visible.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20 sm:left-6"><ChevronLeft className="size-6" /></button>
                  <button type="button" onClick={() => step(1)} aria-label="Next image" className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/20 sm:right-6"><ChevronRight className="size-6" /></button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
