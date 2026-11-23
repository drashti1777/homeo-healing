"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One place for all GSAP scroll animation. Pages only add data attributes:
 *   data-reveal [data-delay]   fade/slide in
 *   data-split                 word-by-word headline reveal (plain-text headings only)
 *   data-clip [data-delay]     image wipes in from the bottom
 *   data-parallax="0.1"        image drift inside an overflow-hidden parent
 *   data-count data-suffix     counter (verified numbers only)
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const restore: Array<() => void> = [];

    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        if (el.children.length > 0) {
          el.style.visibility = "visible";
          return;
        }
        const text = el.textContent ?? "";
        const original = el.innerHTML;
        el.setAttribute("aria-label", text);
        el.replaceChildren();
        const words: HTMLElement[] = [];
        text.split(/\s+/).filter(Boolean).forEach((w, i, all) => {
          const mask = document.createElement("span");
          mask.className = "split-mask";
          mask.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span");
          inner.className = "split-word";
          inner.textContent = w;
          mask.append(inner);
          el.append(mask);
          if (i < all.length - 1) el.append(" ");
          words.push(inner);
        });
        el.style.visibility = "visible";
        const isMobile = window.innerWidth < 768;
        const splitShift = isMobile ? -14 : -30;
        gsap.fromTo(
          words,
          { x: splitShift, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            clearProps: "transform",
          },
        );
        restore.push(() => {
          el.innerHTML = original;
          el.removeAttribute("aria-label");
        });
      });

      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
        const isMobile = window.innerWidth < 768;
        const shift = isMobile ? 20 : 50;
        const rect = el.getBoundingClientRect();
        const screenMid = window.innerWidth / 2;
        const elMid = rect.left + rect.width / 2;

        let fromX = -shift;
        if (elMid > screenMid + 40) {
          fromX = shift;
        } else if (elMid < screenMid - 40) {
          fromX = -shift;
        } else {
          fromX = i % 2 === 0 ? -shift : shift;
        }

        gsap.fromTo(
          el,
          { opacity: 0, x: fromX },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            clearProps: "transform",
          },
        );
      });

      document.querySelectorAll<HTMLElement>("[data-clip]").forEach((el, i) => {
        const fromLeft = i % 2 === 0;
        const initialClip = fromLeft ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
        gsap.fromTo(
          el,
          { clipPath: initialClip },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power4.inOut",
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onComplete: () => {
              el.style.clipPath = "none";
            },
          },
        );
      });

      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax ?? 0.1) * 100;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const suffix = el.dataset.suffix ?? "";
        if (!Number.isFinite(end)) return;
        const state = { v: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(state, {
          v: end, duration: 1.8, ease: "power2.out",
          onUpdate: () => { el.textContent = `${Math.round(state.v).toLocaleString("en")}${suffix}`; },
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    });

    // Late layout shifts (fonts, images) change trigger positions.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
      restore.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
