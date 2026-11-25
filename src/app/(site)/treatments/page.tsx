import { Suspense } from "react";
import { TreatmentExplorer, type ExplorerItem } from "@/components/TreatmentExplorer";
import { TreatmentsIntro } from "@/components/TreatmentsIntro";
import { ConsultationCta } from "@/components/home/ConsultationCta";
import { EmptyState, PageHero } from "@/components/ui";
import { getSettings, getTreatments } from "@/lib/data";
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

      {/* 1. Animated Introduction Section */}
      <TreatmentsIntro categoriesCount={categories.length} conditionsCount={conditionCount} />

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
