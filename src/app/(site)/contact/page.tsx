import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero, SectionHeading } from "@/components/ui";
import { CLINIC, mapsLink } from "@/content/clinic";
import { branchesFrom, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({
    path: "/contact",
    title: "Contact Us | Homeopathy Clinics in Bhavnagar & Ahmedabad",
    description: "Contact Dr. Neeta's Homeo Health Care in Bhavnagar and Ahmedabad. Phone +91 81606 02060, email, addresses and directions, or send an enquiry online.",
  });

const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

/** Source: the clinic's live Contact page (contact.php): title, intro line, map, form, contact info and the "Consult Us Now" bar. */
export default async function ContactPage() {
  const s = await getSettings();
  const branches = branchesFrom(s);
  // The live page shows one map (the Bhavnagar clinic).
  const map = branches.find((b) => b.mapEmbedUrl);

  return (
    <>
      <PageHero eyebrow="Contact" title="Contact us" intro="Contact Us Our Hospital" crumbs={[{ label: "Contact" }]} />

      {/* Title, intro line and map */}
      <section className="section !pb-12">
        <div className="wrap">
          <div className="max-w-3xl">
            <SectionHeading eyebrow="Contact" title="Contact Us Our Hospital" />
            <p className="mt-6 text-lg text-ink-soft" data-reveal>
              Dr Neeta Homeopathy Clinic is a one and half decade old renowned clinic that offers the best quality, non-toxic and highly effective treatment in Bhavnagar.
            </p>
          </div>
          {map && (
            <div className="relative mt-12 h-[18rem] w-full overflow-hidden rounded-[2rem] bg-sage-100 shadow-xl shadow-forest-900/5 md:h-[28rem]" data-clip>
              <iframe
                src={map.mapEmbedUrl}
                title={`Map: ${map.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </section>

      {/* Form + contact info */}
      <section className="section !pt-0" id="enquiry">
        <div className="wrap grid gap-14 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <SectionHeading eyebrow="Enquiry" title="Leave a message" />
            <div className="mt-10"><ContactForm /></div>
          </div>

          <aside className="lg:pt-28">
            <h2 className="text-2xl font-normal" data-reveal>Contact Info</h2>
            <ul className="mt-8 space-y-6">
              {branches.map((b, i) => (
                <li key={b.key} className="flex gap-4" data-reveal data-delay={i * 0.08}>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700"><MapPin className="size-5" aria-hidden="true" /></span>
                  <a href={b.mapLinkUrl || mapsLink(b.address)} target="_blank" rel="noopener noreferrer" className="pt-1 text-ink-soft transition-colors hover:text-forest-800">{b.address}</a>
                </li>
              ))}
              {s.phone && (
                <li className="flex gap-4" data-reveal data-delay="0.16">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700"><Phone className="size-5" aria-hidden="true" /></span>
                  <a href={telHref(s.phone)} className="pt-2 text-ink-soft transition-colors hover:text-forest-800">{s.phone}</a>
                </li>
              )}
              {s.email && (
                <li className="flex gap-4" data-reveal data-delay="0.24">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-100 text-forest-700"><Mail className="size-5" aria-hidden="true" /></span>
                  <a href={`mailto:${s.email}`} className="break-all pt-2 text-ink-soft transition-colors hover:text-forest-800">{s.email}</a>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </section>

      {/* Consult Us Now */}
      <section className="section relative overflow-hidden bg-forest-900 text-paper">
        <div aria-hidden="true" className="float-slow absolute -right-32 -top-32 size-[28rem] rounded-full bg-forest-700/40 blur-2xl" />
        <div className="wrap relative flex flex-wrap items-center justify-between gap-8">
          <h2 data-split className="!text-paper text-[clamp(2rem,4.4vw,3.25rem)] font-normal">Consult Us Now</h2>
          <div data-reveal>
            <Link href="/book-appointment" className="btn btn-light">Book now <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([
            ...branches.map((b) => ({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              "@id": `${SITE_URL}/contact#${b.key}`,
              name: b.name || CLINIC,
              medicalSpecialty: "Homeopathic",
              address: { "@type": "PostalAddress", streetAddress: b.address, addressLocality: b.key === "ahmedabad" ? "Ahmedabad" : "Bhavnagar", addressRegion: "Gujarat", addressCountry: "IN" },
              ...(b.phone && { telephone: b.phone }),
              ...(s.email && { email: s.email }),
              ...(b.hours.length && { openingHours: b.hours }),
              parentOrganization: { "@id": `${SITE_URL}/#clinic` },
            })),
            breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
          ]),
        }}
      />
    </>
  );
}
