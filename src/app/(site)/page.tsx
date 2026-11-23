import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Heart, Leaf, Mail, MapPin, Phone, Sprout, Users } from "lucide-react";
import { BannerSlider } from "@/components/BannerSlider";
import { FaqList } from "@/components/Faq";
import { HeroVisual } from "@/components/HeroVisual";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { CtaLink, Disclaimer, MediaImage, SectionHeading } from "@/components/ui";
import { ABOUT_HOMEOPATHY, CLINIC, CLINIC_INTRO, GALLERY, MYTHS, TAGLINE, TESTIMONIALS, TESTIMONIALS_INTRO, WHY_CHOOSE, WHY_HOMEOPATHY, mapsLink } from "@/content/clinic";
import { branchesFrom, defaultSettings, getDoctor, getFaqs, getGalleryImages, getSettings, getTestimonials, getTreatments } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    path: "/",
    title: "Homeo-Healing | Dr. Neeta Parmar, Homoeopathic Consultant in Bhavnagar & Ahmedabad",
    description: "Homeopathic consultations with Dr. Neeta Parmar at Dr. Neeta's Homeo Health Care, Bhavnagar and Ahmedabad. Request an appointment online.",
  });
}

const WHY_ICONS = [Users, Heart, Sprout, MapPin];
const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

export default async function HomePage() {
  const [doctor, allTreatments, faqs, testimonials, settings, galleryDb] = await Promise.all([
    getDoctor().catch(() => null),
    getTreatments().catch(() => []),
    getFaqs().catch(() => []),
    getTestimonials().catch(() => []),
    getSettings().catch(() => defaultSettings),
    getGalleryImages().catch(() => []),
  ]);

  // Clinic's own 16 treatment categories (order < 100); featured ones first.
  const categories = allTreatments.filter((t) => t.order < 100);
  const featured = [...categories.filter((t) => t.isFeatured), ...categories.filter((t) => !t.isFeatured)].slice(0, 6);
  // Gallery preview uses published images from Admin → Gallery; falls back to the migrated photos.
  const galleryPreview = galleryDb.length >= 3 ? galleryDb.slice(0, 3).map((g) => ({ src: g.src, alt: g.alt })) : [GALLERY[0].images[0], GALLERY[2].images[0], GALLERY[2].images[2]];

  // Doctor content is managed in Admin → Doctor profile; homepage falls back to the audited text if empty.
  const order = { education: 0, certification: 1, experience: 2, teaching: 3 } as const;
  const timeline = doctor?.entries.length ? [...doctor.entries].sort((a, b) => order[a.category] - order[b.category]) : [];
  // Approved testimonials from Admin take priority; otherwise the ones from the clinic's live homepage are shown.
  const reviews = testimonials.length > 0 ? testimonials.slice(0, 4) : TESTIMONIALS;

  const locations = branchesFrom(settings).map((b) => ({
    key: b.key, city: b.key === "ahmedabad" ? "Ahmedabad" : "Bhavnagar", name: b.name || CLINIC, address: b.address,
    hours: b.hours, directions: b.mapLinkUrl || mapsLink(b.address),
  }));

  return (
    <>
      {/* Banner slider */}
      <BannerSlider />

      {/* 2. Doctor introduction */}
      <section className="section overflow-hidden">
        <div className="wrap grid items-center gap-10 lg:gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div
              aria-hidden="true"
              className="absolute top-4 left-4 right-0 bottom-0 sm:top-6 sm:left-6 md:top-8 md:left-8 rounded-[2rem] sm:rounded-[2.5rem] bg-forest-800"
            />
            <div
              className="relative mr-4 mb-4 sm:mr-6 sm:mb-6 md:mr-8 md:mb-8 aspect-[748/736] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-sage-100"
              data-clip
            >
              <Image
                src={doctor?.photo || "/gallery/doc.webp"}
                alt={doctor?.photoAlt || doctor?.name || "Dr. Neeta Parmar"}
                fill
                priority
                sizes="(min-width:1024px) 28rem, 90vw"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Meet the doctor" title="Dr. Neeta Parmar" />
            <p className="mt-6 text-lg text-ink-soft" data-reveal>
              Chief Homoeopathic Consultant at {CLINIC}, Bhavnagar, and at Homeo Health Care &amp; Pharmacy, Ahmedabad. She holds a post-graduation in Repertory and teaches as HOD &amp; Associate Professor of Homoeopathic Pharmacy at Shree Swaminarayan Homoeopathy Medical College, Kalol.
            </p>
            <div className="mt-8 flex flex-wrap gap-6" data-reveal>
              <CtaLink href="/about">Full profile</CtaLink>
              <CtaLink href="/book-appointment">Consult Dr. Neeta</CtaLink>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clinic introduction (asymmetric) */}
      <section className="section bg-sage-50">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our clinic" title={CLINIC} />
            {CLINIC_INTRO.map((p) => <p key={p} className="mt-5 text-ink-soft" data-reveal>{p}</p>)}
            <div className="mt-8" data-reveal><CtaLink href="/about">About the clinic</CtaLink></div>
          </div>
          <div className="relative grid grid-cols-5 gap-4 lg:col-span-7">
            <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[2rem] rounded-bl-[7rem]" data-clip>
              <Image src={GALLERY[0].images[0].src} alt={GALLERY[0].images[0].alt} fill sizes="(min-width:1024px) 35vw, 60vw" data-parallax="0.06" className="scale-[1.18] object-cover" />
            </div>
            <div className="relative col-span-2 mt-16 aspect-[3/4] overflow-hidden rounded-[2rem] rounded-tr-[5rem]" data-clip data-delay="0.2">
              <Image src={GALLERY[2].images[1].src} alt={GALLERY[2].images[1].alt} fill sizes="(min-width:1024px) 22vw, 40vw" data-parallax="0.1" className="scale-[1.2] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Myths and Facts about Homeopathy (from the clinic's live homepage) */}
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Myths & facts" title={MYTHS.title} intro={MYTHS.subtitle} />
            <div className="mt-8" data-reveal><CtaLink href="/about">Know more</CtaLink></div>
          </div>
          <div className="space-y-6">
            {MYTHS.paragraphs.map((p) => <p key={p} className="text-lg text-ink-soft" data-reveal>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Why to go with Homeopathy (from the clinic's live homepage) */}
      <section className="section bg-beige-100">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Why homeopathy" title={WHY_HOMEOPATHY.title} intro={WHY_HOMEOPATHY.subtitle} />
            <div className="mt-8" data-reveal><CtaLink href="/treatments">View treatments</CtaLink></div>
          </div>
          <ol className="space-y-6">
            {WHY_HOMEOPATHY.paragraphs.map((p, i) => (
              <li key={p} className="flex gap-5 border-t border-forest-800/15 pt-6 first:border-t-0 first:pt-0" data-reveal data-delay={i * 0.08}>
                <span className="font-serif text-xl text-sage-500">0{i + 1}</span>
                <p className="text-lg text-ink-soft">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Featured treatment categories */}
      {featured.length > 0 && (
        <section className="section bg-sage-50">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Treatment categories" title="Areas we consult on" intro={`${categories.length} treatment categories, from respiratory and skin conditions to women's health.`} />
              <CtaLink href="/treatments">All {categories.length} categories</CtaLink>
            </div>
            <ul className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-sage-200 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((t, i) => (
                <li key={t._id} className="group bg-paper" data-reveal data-delay={(i % 3) * 0.08}>
                  <div className="flex h-full flex-col p-8">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-sage-100 transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110">
                      {t.image && <Image src={t.image} alt="" fill sizes="64px" className="object-cover" />}
                    </span>
                    <h3 className="mt-6 text-2xl font-normal">{t.title}</h3>
                    <p className="mt-2 text-sm text-ink-soft">{t.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 7. Why choose
      <section className="section">
        <div className="wrap">
          <SectionHeading eyebrow="Why choose our clinic" title="Care built around you" align="center" />
          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map((w, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <li key={w.title} className="group" data-reveal data-delay={i * 0.08}>
                  <span className="grid size-14 place-items-center rounded-full bg-sage-100 text-forest-700 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6"><Icon className="size-6" aria-hidden="true" /></span>
                  <h3 className="mt-5 text-xl font-normal">{w.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{w.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section> */}

      {/* 8 + 9. Doctor profile preview and practice information
      {timeline.length > 0 && <section className="section bg-beige-100">
        <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Education & practice" title="Training and experience" />
            <div className="mt-8 flex flex-wrap gap-4" data-reveal>
              <Link href="/about" className="btn btn-primary">About Dr. Neeta</Link>
            </div>
          </div>
          <ol className="relative border-l border-forest-800/15 pl-8">
            {timeline.map((e, i) => (
              <li key={`${e.year}-${e.title}`} className="relative pb-10 last:pb-0" data-reveal data-delay={(i % 3) * 0.06}>
                <span aria-hidden="true" className="absolute -left-[2.37rem] top-1.5 size-3 rounded-full border-2 border-paper bg-forest-600" />
                {e.year && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-500">{e.year}</p>}
                <h3 className="mt-1 text-xl font-normal">{e.title}</h3>
                {e.institution && <p className="mt-1 text-sm text-ink-soft">{e.institution}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>} */}

      {/* 10. Approved testimonials only (published + verified + consent) */}
      {reviews.length > 0 && (
        <section className="relative overflow-hidden bg-forest-900 py-12 text-paper md:py-16" aria-labelledby="testimonials-heading">
          <div aria-hidden="true" className="float-slow absolute -left-32 -top-32 size-[26rem] rounded-full bg-forest-700/40 blur-2xl" />
          <div className="wrap relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow mb-3 justify-center !text-sage-300" data-reveal>Patient experiences</p>
              <h2 id="testimonials-heading" data-split className="!text-paper text-[clamp(1.75rem,3.6vw,2.5rem)] font-normal">Patient&apos;s Testimonials</h2>
              <p className="mt-3 text-sm text-sage-200" data-reveal>{TESTIMONIALS_INTRO}</p>
            </div>
            <div className="mt-8"><TestimonialSlider reviews={reviews} /></div>
          </div>
        </section>
      )}

      {/* 11. Gallery preview */}
      <section className="section bg-sage-50">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Clinic gallery" title="Inside the clinic" />
            <CtaLink href="/gallery">View gallery</CtaLink>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-[1.4fr_1fr] md:grid-rows-2">
            {galleryPreview.map((img, i) => (
              <Link key={img.src} href="/gallery" aria-label={`${img.alt} (open gallery)`} className={`group relative overflow-hidden rounded-[2rem] bg-sage-100 ${i === 0 ? "aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-[16/10]"}`} data-clip data-delay={i * 0.15}>
                <Image src={img.src} alt={img.alt} fill sizes={i === 0 ? "(min-width:768px) 58vw, 100vw" : "(min-width:768px) 40vw, 100vw"} className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Two clinic locations */}
      {locations.length > 0 && (
        <section className="section bg-beige-100" aria-labelledby="locations-heading">
          <div className="wrap">
            <p className="eyebrow mb-5" data-reveal>Our clinics</p>
            <h2 id="locations-heading" data-split className="text-[clamp(2rem,4.6vw,3.25rem)] font-normal">Visit us in Gujarat</h2>
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {locations.map((loc, i) => (
                <article key={loc.address} className="flex flex-col rounded-[2rem] bg-paper p-8 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-xl hover:shadow-forest-900/10 md:p-10" data-reveal data-delay={i * 0.1}>
                  <p className="font-serif text-4xl text-forest-800">{loc.city}</p>
                  <p className="mt-2 text-sm font-semibold text-sage-500">{loc.name}</p>
                  <p className="mt-6 flex gap-3 text-ink-soft"><MapPin className="mt-1 size-5 shrink-0 text-forest-600" aria-hidden="true" />{loc.address}</p>
                  {settings.phone && <p className="mt-3 flex gap-3 text-ink-soft"><Phone className="mt-1 size-5 shrink-0 text-forest-600" aria-hidden="true" /><a href={telHref(settings.phone)} className="link-line">{settings.phone}</a></p>}
                  {loc.hours.length > 0 && <p className="mt-3 flex gap-3 text-ink-soft"><Clock className="mt-1 size-5 shrink-0 text-forest-600" aria-hidden="true" />{loc.hours.join(" · ")}</p>}
                  <a href={loc.directions} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex items-center gap-2 self-start text-sm font-semibold text-forest-700">
                    <span className="link-line">Get directions</span><ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 15. Contact */}
      <section className="section">
        <div className="wrap grid gap-10 md:grid-cols-3">
          <div className="md:col-span-1">
            <SectionHeading eyebrow="Contact" title="Get in touch" />
            <div className="mt-8" data-reveal><Link href="/contact" className="btn btn-ghost">Send a message</Link></div>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 md:col-span-2">
            {settings.phone && (
              <li data-reveal><a href={telHref(settings.phone)} className="group block rounded-[1.5rem] border border-sage-200 p-7 transition-colors hover:border-forest-600">
                <Phone className="size-5 text-forest-600" aria-hidden="true" /><p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-soft">Phone</p><p className="mt-1 font-serif text-2xl text-forest-800">{settings.phone}</p>
              </a></li>
            )}
            {settings.email && (
              <li data-reveal data-delay="0.08"><a href={`mailto:${settings.email}`} className="group block rounded-[1.5rem] border border-sage-200 p-7 transition-colors hover:border-forest-600">
                <Mail className="size-5 text-forest-600" aria-hidden="true" /><p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-soft">Email</p><p className="mt-1 break-all font-serif text-xl text-forest-800">{settings.email}</p>
              </a></li>
            )}
          </ul>
        </div>
        {/* <div className="wrap mt-16"><Disclaimer /></div> */}
      </section>
    </>
  );
}
