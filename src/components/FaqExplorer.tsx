"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Link2, Plus, Search, X } from "lucide-react";

export type FaqItem = { slug: string; question: string; answer: string; category: string; relatedSlugs: string[] };

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N} ]/gu, " ");

/** Wraps search terms in <mark>. Text-only, never HTML. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="rounded bg-sage-200 px-0.5 text-forest-900">{part}</mark> : part))}</>;
}

export function FaqExplorer({ items, categories }: { items: FaqItem[]; categories: { key: string; label: string }[] }) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const deferred = useDeferredValue(query);
  const bySlug = useMemo(() => new Map(items.map((f) => [f.slug, f])), [items]);

  // Open the question in the URL hash (/faq#is-homeopathy-scientifically-proven) and follow hash changes.
  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (!bySlug.has(h)) return;
      setCategory("all");
      setQuery("");
      setOpen(h);
      requestAnimationFrame(() => document.getElementById(`faq-${h}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [bySlug, reduce]);

  const terms = useMemo(() => norm(deferred).split(/\s+/).filter((w) => w.length > 1), [deferred]);
  const results = useMemo(
    () =>
      items.filter((f) => (category === "all" || f.category === category) && (!terms.length || terms.every((w) => norm(`${f.question} ${f.answer}`).includes(w)))),
    [items, category, terms],
  );
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.key, items.filter((f) => f.category === c.key).length])), [items, categories]);

  const tabsRef = useRef<HTMLDivElement>(null);
  const categoryBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isDragging = useRef(false);
  const dragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const el = categoryBtnRefs.current[category];
    const container = tabsRef.current;
    if (!el || !container) return;
    if (container.scrollWidth > container.clientWidth) {
      const targetLeft = el.offsetLeft - (container.clientWidth - el.clientWidth) / 2;
      container.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [category]);

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

  const toggle = (slug: string) => {
    const next = open === slug ? null : slug;
    setOpen(next);
    history.replaceState(null, "", next ? `#${next}` : window.location.pathname + window.location.search);
  };
  const openRelated = (slug: string) => {
    setCategory("all");
    setQuery("");
    setOpen(slug);
    history.replaceState(null, "", `#${slug}`);
    requestAnimationFrame(() => document.getElementById(`faq-${slug}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }));
  };
  const copyLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/faq#${slug}`);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div>
      <div className="glass sticky top-20 z-20 -mx-2 rounded-[1.75rem] p-2 shadow-lg shadow-forest-900/5 sm:mx-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-forest-600" aria-hidden="true" />
          <label htmlFor="faq-search" className="sr-only">Search frequently asked questions</label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, e.g. steroids, evidence"
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
          aria-label="Filter questions by topic"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ WebkitOverflowScrolling: "touch" }}
          className="mt-2 flex min-w-0 w-full max-w-full gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x cursor-grab active:cursor-grabbing"
        >
          {[{ key: "all", label: "All", n: items.length }, ...categories.filter((c) => counts[c.key]).map((c) => ({ ...c, n: counts[c.key] }))].map((c) => {
            const active = category === c.key;
            return (
              <button
                key={c.key}
                ref={(el) => { categoryBtnRefs.current[c.key] = el; }}
                type="button"
                aria-pressed={active}
                onClick={() => { if (!dragged.current) setCategory(c.key); }}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-paper" : "text-forest-800 hover:bg-sage-100"}`}
              >
                {active && <motion.span layoutId="faq-pill" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-forest-800" />}
                <span className="relative">{c.label} <span className={active ? "text-sage-200" : "text-ink-soft"}>{c.n}</span></span>
              </button>
            );
          })}
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-8 text-sm text-ink-soft">
        {results.length === items.length ? `${items.length} questions` : `${results.length} of ${items.length} questions`}
        {deferred.trim() && <> matching &ldquo;{deferred.trim()}&rdquo;</>}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-sage-300 bg-sage-50 px-6 py-14 text-center">
          <h2 className="text-2xl font-normal">No matching question</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Try another word, or ask the clinic directly.</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); }} className="btn btn-ghost mt-6">Show all questions</button>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-sage-200 border-y border-sage-200">
          <AnimatePresence initial={false}>
            {results.map((f) => {
              const isOpen = open === f.slug;
              const related = f.relatedSlugs.map((s) => bySlug.get(s)).filter((r): r is FaqItem => !!r);
              const panelId = `faq-panel-${f.slug}`;
              const btnId = `faq-${f.slug}`;
              return (
                <motion.li key={f.slug} layout={!reduce} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="scroll-mt-48">
                  <h2 className="!font-sans">
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(f.slug)}
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="font-serif text-[clamp(1.15rem,2.4vw,1.5rem)] font-normal leading-snug text-forest-800 transition-colors group-hover:text-forest-600">
                        <Highlight text={f.question} terms={terms} />
                      </span>
                      <span className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-forest-800/20 text-forest-800 transition-[transform,background-color,color] duration-500 ease-out-expo ${isOpen ? "rotate-45 bg-forest-800 text-paper" : "group-hover:bg-sage-100"}`}>
                        <Plus className="size-4" aria-hidden="true" />
                      </span>
                    </button>
                  </h2>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pr-2 sm:pr-14">
                          <div className="space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg">
                            {f.answer.split(/\n{2,}/).map((p) => <p key={p}><Highlight text={p} terms={terms} /></p>)}
                          </div>
                          {related.length > 0 && (
                            <div className="mt-6">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-500">Related questions</p>
                              <ul className="mt-3 flex flex-wrap gap-2">
                                {related.map((r) => (
                                  <li key={r.slug}>
                                    <button type="button" onClick={() => openRelated(r.slug)} className="group/rel inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3.5 py-2 text-left text-sm text-forest-800 transition-colors hover:bg-sage-200">
                                      {r.question}
                                      <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover/rel:translate-x-0.5" aria-hidden="true" />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <button type="button" onClick={() => copyLink(f.slug)} className="mt-6 inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-forest-700">
                            <Link2 className="size-3.5" aria-hidden="true" /> Copy link to this question
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
