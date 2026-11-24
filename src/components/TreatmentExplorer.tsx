"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronRight, Search, ShieldAlert, Sparkles, X } from "lucide-react";
import { TreatmentIcon } from "./TreatmentIcon";

export type ExplorerItem = {
  slug: string;
  title: string;
  summary: string;
  conditions: string[];
  group: string;
  icon: string;
  image: string;
  imageAlt: string;
  riskLevel: "standard" | "specialist";
};

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N} ]/gu, " ");

export function TreatmentExplorer({ items, groups }: { items: ExplorerItem[]; groups: { key: string; label: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [group, setGroup] = useState(params.get("group") ?? "all");
  const deferred = useDeferredValue(query);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const tabsRef = useRef<HTMLDivElement>(null);
  const groupBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isDragging = useRef(false);
  const dragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const el = groupBtnRefs.current[group];
    const container = tabsRef.current;
    if (!el || !container) return;
    if (container.scrollWidth > container.clientWidth) {
      const targetLeft = el.offsetLeft - (container.clientWidth - el.clientWidth) / 2;
      container.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [group]);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = tabsRef.current;
    if (!el) return;
    isDragging.current = true;
    dragged.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = tabsRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 4) {
      dragged.current = true;
    }
    el.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    setTimeout(() => {
      dragged.current = false;
    }, 50);
  };

  useEffect(() => {
    const p = new URLSearchParams();
    if (query.trim()) p.set("q", query.trim());
    if (group !== "all") p.set("group", group);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [query, group, pathname, router]);

  const results = useMemo(() => {
    const terms = norm(deferred).split(/\s+/).filter(Boolean);
    return items
      .filter((t) => group === "all" || t.group === group)
      .map((t) => {
        if (!terms.length) return { t, matched: [] as string[] };
        const hay = norm(`${t.title} ${t.summary} ${t.conditions.join(" ")}`);
        if (!terms.every((w) => hay.includes(w))) return null;
        return { t, matched: t.conditions.filter((c) => terms.some((w) => norm(c).includes(w))) };
      })
      .filter((x): x is { t: ExplorerItem; matched: string[] } => x !== null);
  }, [items, group, deferred]);

  const counts = useMemo(() => Object.fromEntries(groups.map((g) => [g.key, items.filter((i) => i.group === g.key).length])), [items, groups]);
  const reset = () => { setQuery(""); setGroup("all"); };

  return (
    <div>
      {/* Sticky Search & Filter Header */}
      <div className="sticky top-16 sm:top-20 z-20 -mx-1 sm:mx-0 rounded-2xl sm:rounded-[2rem] bg-white/95 p-2.5 sm:p-3 shadow-xl shadow-forest-950/5 border border-forest-800/10 backdrop-blur-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 sm:left-5 top-1/2 size-4.5 sm:size-5 -translate-y-1/2 text-forest-700" aria-hidden="true" />
          <label htmlFor="treatment-search" className="sr-only">Search treatment categories and conditions</label>
          <input
            id="treatment-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any condition, e.g. asthma, migraine..."
            autoComplete="off"
            className="w-full rounded-xl sm:rounded-2xl border border-forest-800/15 bg-white py-2.5 sm:py-3.5 pl-11 sm:pl-14 pr-10 sm:pr-12 text-xs sm:text-base text-ink placeholder:text-ink-soft/70 shadow-xs focus:border-forest-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search query"
              className="absolute right-3.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-sage-100 hover:text-forest-900 transition-colors"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Category Group Tabs */}
        <div
          ref={tabsRef}
          role="group"
          aria-label="Filter by category group"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ WebkitOverflowScrolling: "touch" }}
          className="mt-3 flex min-w-0 w-full max-w-full gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x cursor-grab active:cursor-grabbing"
        >
          {[{ key: "all", label: "All Categories", n: items.length }, ...groups.filter((g) => counts[g.key]).map((g) => ({ ...g, n: counts[g.key] }))].map((g) => {
            const active = group === g.key;
            return (
              <button
                key={g.key}
                ref={(el) => { groupBtnRefs.current[g.key] = el; }}
                type="button"
                aria-pressed={active}
                onClick={() => { if (!dragged.current) setGroup(g.key); }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-forest-800 text-white shadow-md shadow-forest-900/15 scale-105"
                    : "bg-white text-forest-800 border border-forest-800/10 hover:bg-emerald-50 hover:border-emerald-500/30"
                }`}
              >
                <span>{g.label}</span>
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    active ? "bg-white/25 text-white" : "bg-sage-100 text-forest-800"
                  }`}
                >
                  {g.n}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Meta */}
      <div className="mt-8 flex items-center justify-between text-xs sm:text-sm text-ink-soft">
        <p role="status" aria-live="polite">
          Showing <span className="font-bold text-forest-950">{results.length}</span> of {items.length} categories
          {deferred.trim() && <> matching &ldquo;<span className="text-forest-800 font-semibold">{deferred.trim()}</span>&rdquo;</>}
        </p>
        {(query || group !== "all") && (
          <button
            type="button"
            onClick={reset}
            className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-4"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {results.length === 0 ? (
        <div className="mt-8 rounded-[2.5rem] border border-dashed border-forest-800/20 bg-sage-50/50 p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm text-forest-800 mb-4">
            <Search className="size-6 text-emerald-600" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-forest-950">No matching treatment category</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft leading-relaxed">
            We offer holistic constitutional care for a wide spectrum of acute and chronic disorders. Contact Dr. Neeta Parmar to discuss your specific symptoms.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="btn btn-ghost">
              Show All Categories
            </button>
            <Link href="/contact" className="btn btn-primary">
              Ask Dr. Neeta Directly
            </Link>
          </div>
        </div>
      ) : (
        /* Results Cards Grid */
        <motion.ul layout={!reduce} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {results.map(({ t, matched }) => (
              <motion.li
                key={t.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="group flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-forest-800/10 bg-white shadow-md shadow-forest-900/5 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/10">
                  <div>
                    {/* Visual Card Header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
                      {t.image ? (
                        <Image
                          src={t.image}
                          alt={t.imageAlt || t.title}
                          fill
                          sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <span className="grid size-full place-items-center text-forest-600 bg-sage-50">
                          <TreatmentIcon name={t.icon} className="size-14 text-emerald-700" />
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Icon Badge */}
                      <span className="glass absolute left-4 top-4 grid size-10 place-items-center rounded-full text-forest-800 shadow-md">
                        <TreatmentIcon name={t.icon} className="size-4.5" />
                      </span>

                      {/* Specialist Care Badge */}
                      {t.riskLevel === "specialist" && (
                        <span className="glass absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold text-forest-800 shadow-md">
                          <ShieldAlert className="size-3.5 text-amber-600" aria-hidden="true" />
                          <span>Specialist care</span>
                        </span>
                      )}

                      {/* Bottom Image Tag */}
                      <div className="absolute bottom-3 left-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-forest-900 backdrop-blur-md shadow-md">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span>{t.conditions.length > 0 ? `${t.conditions.length} Conditions Treated` : "Holistic Healing"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-bold text-forest-950 transition-colors group-hover:text-emerald-800">
                        <Link href={`/treatments/${t.slug}`} className="hover:underline">
                          {t.title}
                        </Link>
                      </h3>

                      {t.summary && (
                        <p className="mt-2 text-xs sm:text-sm text-ink-soft line-clamp-2 leading-relaxed">
                          {t.summary}
                        </p>
                      )}

                      {/* Conditions Pill Cloud */}
                      {t.conditions.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Conditions treated under ${t.title}`}>
                          {(matched.length ? matched : open[t.slug] ? t.conditions : t.conditions.slice(0, 5)).map((c) => (
                            <li
                              key={c}
                              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                                matched.includes(c)
                                  ? "bg-forest-800 text-white shadow-xs"
                                  : "bg-sage-50 text-forest-900 border border-forest-800/5 group-hover:bg-emerald-50 group-hover:border-emerald-200"
                              }`}
                            >
                              {c}
                            </li>
                          ))}
                          {t.conditions.length > 5 && !matched.length && (
                            <li>
                              <button
                                type="button"
                                aria-expanded={!!open[t.slug]}
                                onClick={() => setOpen((o) => ({ ...o, [t.slug]: !o[t.slug] }))}
                                className="rounded-lg border border-forest-800/20 bg-white px-2.5 py-1 text-xs font-bold text-forest-800 transition-colors hover:bg-forest-800 hover:text-white"
                              >
                                {open[t.slug] ? "Show less" : `+${t.conditions.length - 5} more`}
                              </button>
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Explore Treatment Button (Commented Out as requested)
                  <div className="p-6 pt-0">
                    <Link
                      href={`/treatments/${t.slug}`}
                      className="inline-flex w-full items-center justify-between rounded-xl bg-sage-50/70 px-4 py-2.5 text-xs font-semibold text-forest-800 transition-all hover:bg-forest-800 hover:text-white"
                    >
                      <span>Explore Treatment</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                  */}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
