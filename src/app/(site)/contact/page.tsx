import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { PageHero } from "@/components/ui";
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

export default async function ContactPage() {
  const s = await getSettings();
  const branches = branchesFrom(s);
  const map = branches.find((b) => b.mapEmbedUrl) || branches[0];

  return (
    <>
      {/* 1. Header Hero Banner */}
      <PageHero
        eyebrow="Contact"
        title="Contact Us"
        intro="Dr Neeta Homeopathy Clinic is a one and half decade old renowned clinic that offers the best quality, non-toxic and highly effective treatment in Bhavnagar."
        crumbs={[{ label: "Contact" }]}
      />

      {/* 2. Modern Integrated Contact Hub */}
      <section className="section py-14 lg:py-20 bg-gradient-to-b from-white via-sand-50/50 to-white" id="enquiry">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            
            {/* Left Column: Form & Online Query (7 of 12) */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-white p-7 sm:p-10 shadow-xl shadow-forest-950/5 border border-forest-800/10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 mb-3">
                  <Sparkles className="size-3.5 text-emerald-600" />
                  Leave a Reply
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
                  Send Your Health Query
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                  Have a question about homeopathic medicines or wish to consult Dr. Neeta Parmar? Fill out your message below.
                </p>

                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>

              {/* Bottom Assurance Note */}
              <div className="mt-8 pt-5 border-t border-forest-900/10 flex items-center gap-2.5 text-xs text-ink-soft">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>All health queries are kept strictly confidential by our clinical team.</span>
              </div>
            </div>

            {/* Right Column: Direct Info Cards & Embedded Live Map (5 of 12) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              
              {/* Integrated Live Interactive Google Map Frame (Enlarged to balance exact level) */}
              {map?.mapEmbedUrl && (
                <div className="relative flex-1 min-h-[300px] sm:min-h-[340px] rounded-3xl overflow-hidden shadow-lg border border-forest-800/10 bg-sage-100">
                  <iframe
                    src={map.mapEmbedUrl}
                    title={`Map: ${map.name || "Dr. Neeta's Homeo Health Care"}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 size-full border-0"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Direct Touchpoints (Phone & Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-2xl bg-white p-4 shadow-md shadow-forest-950/5 border border-forest-800/10">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-forest-800 text-emerald-300 mb-2 shadow-xs">
                    <Phone className="size-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Phone Consultation</span>
                  <a href={telHref(s.phone || "+918160602060")} className="mt-0.5 block text-xs sm:text-sm font-bold text-forest-950 hover:text-emerald-700 transition-colors">
                    {s.phone || "+91 81606 02060"}
                  </a>
                  <span className="text-[10px] text-ink-soft block mt-0.5">Mon – Sat (10am - 8pm)</span>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-md shadow-forest-950/5 border border-forest-800/10">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white mb-2 shadow-xs">
                    <Mail className="size-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Email Support</span>
                  <a href={`mailto:${s.email || "drneetaparmar@yahoo.com"}`} className="mt-0.5 block text-xs sm:text-sm font-bold text-forest-950 hover:text-emerald-700 transition-colors truncate">
                    {s.email || "drneetaparmar@yahoo.com"}
                  </a>
                  <span className="text-[10px] text-ink-soft block mt-0.5">Prompt response</span>
                </div>
              </div>

              {/* Clinic Addresses Card (Below) */}
              <div className="rounded-3xl bg-forest-950 p-5 text-white shadow-xl shadow-forest-950/15 border border-forest-800/40">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <h3 className="font-serif text-base font-bold text-white">Our Clinics</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                    2 Centers
                  </span>
                </div>

                <div className="space-y-3">
                  {branches.map((b) => (
                    <div key={b.key} className="text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <strong className="text-emerald-300 font-semibold text-xs">
                          {b.key === "ahmedabad" ? "Ahmedabad Branch" : "Bhavnagar Main Clinic"}
                        </strong>
                        <a
                          href={b.mapLinkUrl || mapsLink(b.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
                        >
                          Directions →
                        </a>
                      </div>
                      <p className="text-white/80 leading-relaxed text-[11px] sm:text-xs">{b.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Consult Us Now CTA Banner */}
      <ConsultationCta />

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
              address: {
                "@type": "PostalAddress",
                streetAddress: b.address,
                addressLocality: b.key === "ahmedabad" ? "Ahmedabad" : "Bhavnagar",
                addressRegion: "Gujarat",
                addressCountry: "IN",
              },
              ...(b.phone && { telephone: b.phone }),
              ...(s.email && { email: s.email }),
              ...(b.hours.length && { openingHours: b.hours }),
              parentOrganization: { "@id": `${SITE_URL}/#clinic` },
            })),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ]),
        }}
      />
    </>
  );
}
