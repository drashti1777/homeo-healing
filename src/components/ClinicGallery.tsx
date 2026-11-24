"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Filter, Maximize2, Sparkles, X } from "lucide-react";

export type GallerySectionImage = { src: string; alt: string; width: number; height: number };
export type GallerySection = { id: string; title: string; blurb?: string; images: GallerySectionImage[] };

export function ClinicGallery({ sections }: { sections: GallerySection[] }) {
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [index, setIndex] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  // Flattened items with category / section info
  const allImages = useMemo(
    () =>
      sections.flatMap((s) =>
        s.images.map((img) => ({
          ...img,
          sectionId: s.id,
          sectionTitle: s.title,
        }))
      ),
    [sections]
  );

  // Filtered list based on active tab
  const visibleImages = useMemo(() => {
    if (activeTab === "all") return allImages;
    return allImages.filter((img) => img.sectionId === activeTab);
  }, [allImages, activeTab]);

  const current = index === null ? null : visibleImages[index];

  const close = useCallback(() => {
    setIndex(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  const step = useCallback(
    (d: 1 | -1) => {
      setIndex((i) => (i === null ? i : (i + d + visibleImages.length) % visibleImages.length));
    },
    [visibleImages.length]
  );

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
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  const tabs = [
    { id: "all", label: "All Photos", count: allImages.length },
    ...sections.map((s) => ({ id: s.id, label: s.title, count: s.images.length })),
  ];

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pb-12">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setIndex(null);
              }}
              className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-forest-800 text-white shadow-lg shadow-forest-900/20 scale-105"
                  : "bg-white text-forest-800 border border-forest-800/10 shadow-xs hover:border-emerald-500/40 hover:bg-emerald-50/50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-sage-100 text-forest-800"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modern Responsive Image Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visibleImages.map((img, i) => (
            <motion.div
              key={img.src}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setIndex(i);
                }}
                aria-label={`Open photo: ${img.alt}`}
                className="group relative block w-full overflow-hidden rounded-[2rem] bg-sage-50 border border-forest-800/10 shadow-md shadow-forest-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/10 text-left"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {/* Section Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-forest-900 backdrop-blur-md shadow-md">
                      {img.sectionTitle}
                    </span>
                  </div>

                  {/* Hover Zoom Icon Button */}
                  <div className="absolute bottom-4 right-4 z-10 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="flex size-10 items-center justify-center rounded-full bg-emerald-500 text-forest-950 shadow-lg shadow-emerald-500/30">
                      <Maximize2 className="size-4" />
                    </span>
                  </div>

                  {/* Caption on hover */}
                  <div className="absolute bottom-4 left-4 right-16 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs font-medium text-white/90 line-clamp-1">
                      {img.alt}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {current && index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${index + 1} of ${visibleImages.length}: ${current.alt}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="fixed inset-0 z-[80] flex flex-col bg-forest-950/95 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && close()}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            {/* Top Lightbox Bar */}
            <div className="flex items-center justify-between px-6 py-4 text-white">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-semibold">
                <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                  {index + 1} / {visibleImages.length}
                </span>
                <span>• {current.sectionTitle}</span>
              </div>
              <button
                ref={closeBtn}
                type="button"
                onClick={close}
                aria-label="Close photo viewer"
                className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Photo Stage */}
            <div
              className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16"
              onClick={(e) => e.target === e.currentTarget && close()}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={current.src}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex max-h-full flex-col items-center justify-center"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <Image
                      src={current.src}
                      alt={current.alt}
                      width={current.width}
                      height={current.height}
                      sizes="100vw"
                      className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl"
                      priority
                    />
                  </div>
                  <figcaption className="mt-4 max-w-xl text-center text-xs sm:text-sm text-white/80">
                    {current.alt}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>

              {visibleImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/30 sm:left-6"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/30 sm:right-6"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
