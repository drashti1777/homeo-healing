import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Info, Siren } from "lucide-react";
import { DISCLAIMER_SHORT, EMERGENCY_NOTE } from "@/content/site";

export function SectionHeading({
  eyebrow, title, intro, align = "left", as: Tag = "h2",
}: { eyebrow?: string; title: string; intro?: string; align?: "left" | "center"; as?: "h1" | "h2" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-5" data-reveal>{eyebrow}</p>}
      <Tag data-split className="text-[clamp(2rem,4.6vw,3.25rem)] font-normal">{title}</Tag>
      {intro && <p className="mt-5 text-lg text-ink-soft" data-reveal data-delay="0.1">{intro}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow, title, intro, crumbs,
}: { eyebrow?: string; title: string; intro?: string; crumbs?: { label: string; href?: string }[] }) {
  return (
    <section className="relative overflow-hidden bg-beige-100 pb-12 pt-28 sm:pb-16 sm:pt-36 md:pb-24 md:pt-44">
      {/* Top banner background */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <Image
          src="/gallery/drneet-all.webp"
          alt=""
          fill
          priority
          className="object-cover object-right md:object-center opacity-85 sm:opacity-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-beige-100/95 via-beige-100/80 to-beige-100/35 md:from-beige-100/80 md:via-transparent" />
      </div>
      <div aria-hidden="true" className="float-slow absolute -right-24 top-24 size-[26rem] rounded-[58%_42%_63%_37%/45%_55%_45%_55%] bg-sage-200/30" />
      <div className="wrap relative z-10">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-8 text-xs sm:text-sm text-ink-soft">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="link-line">Home</Link></li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                  {c.href ? <Link href={c.href} className="link-line">{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-3 sm:mb-5">{eyebrow}</p>}
        <h1 data-split className="max-w-3xl text-[clamp(1.9rem,5vw,4.25rem)] font-normal leading-tight">{title}</h1>
        {intro && <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-ink-soft leading-relaxed" data-reveal data-delay="0.15">{intro}</p>}
      </div>
    </section>
  );
}

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <aside className={`flex gap-3 rounded-2xl border border-beige-300 bg-beige-100 p-5 text-sm text-ink-soft ${className}`} aria-label="Medical disclaimer">
      <Info className="mt-0.5 size-5 shrink-0 text-forest-600" aria-hidden="true" />
      <p>
        {DISCLAIMER_SHORT}{" "}
        <Link href="/medical-disclaimer" className="font-medium text-forest-700 underline underline-offset-4">Read the full disclaimer</Link>.
      </p>
    </aside>
  );
}

export function EmergencyNotice({ className = "" }: { className?: string }) {
  return (
    <aside role="note" className={`flex gap-3 rounded-2xl border border-[#d9a99f] bg-[#fbeeea] p-5 text-sm text-[#6b2a1e] ${className}`}>
      <Siren className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p><strong className="font-semibold">In an emergency:</strong> {EMERGENCY_NOTE}</p>
    </aside>
  );
}

export function CtaLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm font-semibold text-forest-700">
      <span className="link-line">{children}</span>
      <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-3xl border border-dashed border-sage-300 bg-sage-50 px-6 py-14 text-center">
      <h2 className="text-2xl font-normal">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">{text}</p>
      {action && <Link href={action.href} className="btn btn-ghost mt-6">{action.label}</Link>}
    </div>
  );
}

export function MediaImage({
  src, alt, className = "", sizes = "(min-width: 1024px) 40vw, 100vw", priority = false, parallax = false,
}: { src: string; alt: string; className?: string; sizes?: string; priority?: boolean; parallax?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-sage-100 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        data-parallax={parallax ? "0.06" : undefined}
        className={`object-cover ${parallax ? "scale-[1.18]" : ""}`}
      />
    </div>
  );
}

/** Decorative organic shape for placeholders where no photo has been uploaded yet. */
export function BotanicalPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative grid place-items-center overflow-hidden bg-sage-100 ${className}`}>
      <svg viewBox="0 0 200 200" className="w-1/2 text-sage-400" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M100 185V70" />
        <path d="M100 150c-34 0-50-22-52-52 30 0 50 18 52 52Z" />
        <path d="M100 120c34 0 50-22 52-52-30 0-50 18-52 52Z" />
        <path d="M100 85c-22-8-30-28-26-52 20 6 30 26 26 52Z" />
      </svg>
    </div>
  );
}
