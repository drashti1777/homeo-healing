"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, ShieldAlert, X } from "lucide-react";
import { TreatmentIcon } from "./TreatmentIcon";

export type ExplorerItem = {
  slug: string; title: string; summary: string; conditions: string[]; group: string;
  icon: string; image: string; imageAlt: string; riskLevel: "standard" | "specialist";
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
  // Cards whose full condition list is expanded ("+N more" button).
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

  // Keep the URL shareable (?q=asthma&group=mind) without adding history entries.
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
      <div className="glass sticky top-20 z-20 -mx-2 rounded-[1.75rem] p-2 shadow-lg shadow-forest-900/5 sm:mx-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-forest-600" aria-hidden="true" />
          <label htmlFor="treatment-search" className="sr-only">Search treatment categories and conditions</label>
          <input
            id="treatment-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a condition, e.g. asthma, thyroid, migraine"
            autoComplete="off"
            className="w-full rounded-[1.4rem] border border-sage-200 bg-white py-4 pl-14 pr-12 text-base text-ink placeholder:text-ink-soft/70 focus:border-forest-600 focus:outline-none focus:ring-4 focus:ring-forest-600/15"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-sage-100">
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div
          ref={tabsRef}
          role="group"
          aria-label="Filter by category group"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ WebkitOverflowScrolling: "touch" }}
          className="mt-2 flex min-w-0 w-full max-w-full gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x cursor-grab active:cursor-grabbing"
        >
          {[{ key: "all", label: "All", n: items.length }, ...groups.filter((g) => counts[g.key]).map((g) => ({ ...g, n: counts[g.key] }))].map((g) => {
            const active = group === g.key;
            return (
              <button
                key={g.key}
                ref={(el) => { groupBtnRefs.current[g.key] = el; }}
                type="button"
                aria-pressed={active}
                onClick={() => { if (!dragged.current) setGroup(g.key); }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-paper" : "text-forest-800 hover:bg-sage-100"}`}
              >
                {active && <motion.span layoutId="group-pill" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-forest-800" />}
                <span className="relative">{g.label} <span className={active ? "text-sage-200" : "text-ink-soft"}>{g.n}</span></span>
              </button>
            );
          })}
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-8 text-sm text-ink-soft">
        {results.length === items.length ? `${items.length} categories` : `${results.length} of ${items.length} categories`}
        {deferred.trim() && <> matching &ldquo;{deferred.trim()}&rdquo;</>}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-sage-300 bg-sage-50 px-6 py-14 text-center">
          <h3 className="text-2xl font-normal">No matching category</h3>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Try a different word, or contact the clinic to ask whether your concern is something Dr. Neeta can discuss with you.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="btn btn-ghost">Show all categories</button>
            <Link href="/contact" className="btn btn-primary">Ask the clinic</Link>
          </div>
        </div>
      ) : (
        <motion.ul layout={!reduce} className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {results.map(({ t, matched }) => (
              <motion.li
                key={t.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-sage-200 bg-paper">
                  <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
                    {t.image ? (
                      <Image src={t.image} alt={t.imageAlt || ""} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" className="object-cover" />
                    ) : (
                      <span className="grid size-full place-items-center text-forest-600"><TreatmentIcon name={t.icon} className="size-14" /></span>
                    )}
                    <span className="glass absolute left-4 top-4 grid size-11 place-items-center rounded-full text-forest-800">
                      <TreatmentIcon name={t.icon} className="size-5" />
                    </span>
                    {t.riskLevel === "specialist" && (
                      <span className="glass absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-semibold text-forest-800">
                        <ShieldAlert className="size-3.5" aria-hidden="true" /> Specialist care needed
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl font-normal">{t.title}</h3>
                    {t.conditions.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Conditions listed under ${t.title}`}>
                        {(matched.length ? matched : open[t.slug] ? t.conditions : t.conditions.slice(0, 5)).map((c) => (
                          <li key={c} className={`rounded-full px-2.5 py-1 text-xs ${matched.includes(c) ? "bg-forest-800 text-paper" : "bg-sage-100 text-forest-800"}`}>{c}</li>
                        ))}
                        {t.conditions.length > 5 && !matched.length && (
                          <li>
                            <button
                              type="button"
                              aria-expanded={!!open[t.slug]}
                              onClick={() => setOpen((o) => ({ ...o, [t.slug]: !o[t.slug] }))}
                              className="rounded-full border border-forest-800/25 px-2.5 py-1 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-800 hover:text-paper"
                            >
                              {open[t.slug] ? "Show less" : `+${t.conditions.length - 5} more`}
                            </button>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
