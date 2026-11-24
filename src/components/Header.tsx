"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/content/site";

export function Header({ clinicName }: { clinicName: string }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const transparentHeader = !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${transparentHeader
          ? "bg-gradient-to-b from-forest-950/85 via-forest-950/45 to-transparent"
          : "bg-white/95 backdrop-blur-md shadow-[0_2px_12px_-4px_rgba(40,36,109,0.06)]"
          }`}
      >
        <div className="wrap flex h-[4.75rem] items-center justify-between gap-6">
          <Link href="/" className="flex items-center shrink-0" aria-label={`${clinicName} home`}>
            <div className="transition-all">
              <Image src="/logo.webp" alt={clinicName} width={483} height={184} priority className="h-8 sm:h-10 md:h-11 w-auto" />
            </div>
          </Link>

          <nav aria-label="Main" className={`hidden items-center gap-7 text-[1.05rem] font-medium transition-colors lg:flex ${transparentHeader ? "text-white" : "text-forest-800"}`}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`link-line py-1 transition-colors ${transparentHeader ? "hover:text-emerald-300 text-white/90" : "hover:text-emerald-700 text-forest-800"}`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/book-appointment" className="btn btn-primary hidden !px-5 !py-3 sm:inline-flex shadow-lg shadow-emerald-500/20">
              Book a consultation
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className={`grid size-11 place-items-center rounded-full border transition-colors lg:hidden ${transparentHeader
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-forest-800/20 text-forest-800 hover:bg-forest-50"
                }`}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 2.5rem) 2.25rem)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-forest-900 text-paper"
          >
            <div className="wrap flex h-[4.5rem] shrink-0 items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center"
                aria-label={`${clinicName} home`}
              >
                <div className="flex items-center justify-center">
                  <Image
                    src="/logo.webp"
                    alt={clinicName}
                    width={483}
                    height={184}
                    className="h-9 sm:h-10 w-auto"
                    priority
                  />
                </div>
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full border border-paper/30"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile" className="wrap flex flex-1 flex-col justify-start pt-6 sm:pt-8 gap-1 overflow-y-auto pb-10">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.25 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="block py-2 font-serif text-[2rem] leading-tight text-paper aria-[current=page]:text-sage-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="/book-appointment" onClick={() => setOpen(false)} className="btn btn-light mt-8 self-start">
                Book a consultation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
