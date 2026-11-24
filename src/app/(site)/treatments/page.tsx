import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Phone, ShieldAlert, Sparkles, Stethoscope } from "lucide-react";
import { TreatmentExplorer, type ExplorerItem } from "@/components/TreatmentExplorer";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { EmptyState, PageHero, SectionHeading } from "@/components/ui";
import { CLINIC } from "@/content/clinic";
import { getFaqs, getSettings, getTreatments } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";
import { TREATMENT_GROUPS, TREATMENT_GROUP_LABELS } from "@/lib/validators";

export const generateMetadata = () =>
  buildMetadata({
    path: "/treatments",
    title: "Treatment Categories | Homeopathy in Bhavnagar & Ahmedabad",
    description: "Explore all 16 clinical treatment categories offered by Dr. Neeta's Homeo Health Care in Bhavnagar & Ahmedabad. Constitutional healing for acute and chronic conditions.",
  });

export default async function TreatmentsPage() {
  const [all, settings] = await Promise.all([getTreatments(), getSettings()]);

  const items: ExplorerItem[] = all.map((t) => ({
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    conditions: t.conditions ?? [],
    group: t.group ?? "body-systems",
    icon: t.icon ?? "leaf",
    image: t.image,
    imageAlt: t.imageAlt,
    riskLevel: t.riskLevel ?? "standard",
  }));

  const categories = items.filter((i) => i.group !== "general");
  const conditionCount = categories.reduce((n, c) => n + c.conditions.length, 0);
  const groups = TREATMENT_GROUPS.map((key) => ({ key, label: TREATMENT_GROUP_LABELS[key] }));

  return (
    <>
      <PageHero
        eyebrow="Clinical Specializations"
        title="Homeopathic Treatments"
        intro={`Explore our ${categories.length} treatment categories covering over ${conditionCount} individual health conditions treated by Dr. Neeta Parmar.`}
        crumbs={[{ label: "Treatments" }]}
      />

      {/* 1. Introduction Section */}
      <section className="section pt-8 pb-4 lg:pt-12 lg:pb-6 bg-white" aria-labelledby="intro-heading">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20 shadow-xs">
              <Sparkles className="size-3.5 text-emerald-600" />
              Evidence-Based Constitutional Healing
            </span>
            <h2 id="intro-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-forest-950 leading-tight">
              Best Homeopathic Treatment Available for Various Disorders
            </h2>
            <p className="text-base sm:text-lg text-forest-900 font-semibold leading-relaxed">
              Homeopathy is a proven holistic medical science based upon the ancient principle of &ldquo;like cures like&rdquo;—stimulating the body&apos;s natural defense mechanism to heal from within.
            </p>
            <p className="text-base text-ink-soft leading-relaxed">
              At <strong>Dr. Neeta&apos;s Homeo Health Care</strong>, treatment is never confined to suppressing surface symptoms. By understanding each patient&apos;s physical constitution, emotional disposition, and unique pathology, Dr. Neeta Parmar prescribes individualized constitutional remedies for permanent and gentle recovery.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl sm:rounded-[2.25rem] bg-sage-50/80 p-5 sm:p-8 shadow-md shadow-forest-900/5 border border-forest-800/10 text-center transition-all hover:border-emerald-500/40 hover:shadow-xl">
              <div className="mx-auto flex size-10 sm:size-12 items-center justify-center rounded-2xl bg-white shadow-xs text-emerald-700 mb-2 sm:mb-3">
                <Stethoscope className="size-5 sm:size-6" />
              </div>
              <p className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">{categories.length}</p>
              <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm font-semibold text-forest-800 uppercase tracking-wider">
                Clinical Categories
              </p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-ink-soft">Comprehensive Care</p>
            </div>

            <div className="rounded-2xl sm:rounded-[2.25rem] bg-sage-50/80 p-5 sm:p-8 shadow-md shadow-forest-900/5 border border-forest-800/10 text-center transition-all hover:border-emerald-500/40 hover:shadow-xl">
              <div className="mx-auto flex size-10 sm:size-12 items-center justify-center rounded-2xl bg-white shadow-xs text-emerald-700 mb-2 sm:mb-3">
                <Sparkles className="size-5 sm:size-6" />
              </div>
              <p className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">{conditionCount}+</p>
              <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm font-semibold text-forest-800 uppercase tracking-wider">
                Conditions Treated
              </p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-ink-soft">Acute &amp; Chronic</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Searchable & Filterable Treatments Grid */}
      <section className="section pt-4 pb-16 lg:pt-6 lg:pb-24 bg-gradient-to-b from-white via-sand-50/50 to-white" aria-label="Treatment categories">
        <div className="wrap">
          {categories.length === 0 ? (
            <EmptyState
              title="Treatments are being added"
              text="Please contact the clinic with any questions."
              action={{ href: "/contact", label: "Contact the clinic" }}
            />
          ) : (
            <Suspense fallback={<p className="text-ink-soft">Loading categories…</p>}>
              <TreatmentExplorer items={categories} groups={groups} />
            </Suspense>
          )}
        </div>
      </section>

      {/* 3. High-Impact Consultation Banner */}
      <ConsultationCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Treatment categories",
              itemListElement: categories.map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: c.title,
                url: `${SITE_URL}/treatments/${c.slug}`,
              })),
            },
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Treatments", path: "/treatments" },
            ]),
          ]),
        }}
      />
    </>
  );
}
