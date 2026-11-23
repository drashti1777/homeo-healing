import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Phone, ShieldAlert } from "lucide-react";
import { FaqList } from "@/components/Faq";
import { TreatmentExplorer, type ExplorerItem } from "@/components/TreatmentExplorer";
import { CtaLink, Disclaimer, EmergencyNotice, EmptyState, PageHero, SectionHeading } from "@/components/ui";
import { CLINIC } from "@/content/clinic";
import { getFaqs, getSettings, getTreatments } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";
import { TREATMENT_GROUPS, TREATMENT_GROUP_LABELS } from "@/lib/validators";

export const generateMetadata = () =>
  buildMetadata({
    path: "/treatments",
    title: "Treatment Categories | Homeopathy in Bhavnagar & Ahmedabad",
    description: "All 16 treatment categories listed by Dr. Neeta's Homeo Health Care, with the conditions in each. Educational information, not a substitute for medical care.",
  });

const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

export default async function TreatmentsPage() {
  const [all, faqs, settings] = await Promise.all([getTreatments(), getFaqs(), getSettings()]);
  // Clinic categories first (order), generic consultation pages last.
  const items: ExplorerItem[] = all.map((t) => ({
    slug: t.slug, title: t.title, summary: t.summary, conditions: t.conditions ?? [], group: t.group ?? "body-systems",
    icon: t.icon ?? "leaf", image: t.image, imageAlt: t.imageAlt, riskLevel: t.riskLevel ?? "standard",
  }));
  const categories = items.filter((i) => i.group !== "general");
  const conditionCount = categories.reduce((n, c) => n + c.conditions.length, 0);
  const specialist = categories.filter((c) => c.riskLevel === "specialist");
  const groups = TREATMENT_GROUPS.map((key) => ({ key, label: TREATMENT_GROUP_LABELS[key] }));

  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Treatment categories"
        intro={`The ${categories.length} areas of interest listed by ${CLINIC}, with the conditions patients discuss in each.`}
        crumbs={[{ label: "Treatments" }]}
      />

      {/* Introduction */}
      <section className="section !pb-12">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <SectionHeading eyebrow="Introduction" title="Best homeopathic treatment available for various disorders" />
          <div data-reveal>
            <p className="border-l-2 border-sage-400 pl-6 text-lg text-ink-soft">
              Homeopathy is a medical system based on the belief that the body can heal itself. Those who practise it use tiny amounts of natural substances, like plants and minerals, which they believe stimulate the healing process.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] bg-sage-50 p-6">
                <dd className="font-serif text-5xl text-forest-800" data-count={categories.length}>{categories.length}</dd>
                <dt className="mt-2 text-sm text-ink-soft">Treatment categories</dt>
              </div>
              <div className="rounded-[1.5rem] bg-beige-100 p-6">
                <dd className="font-serif text-5xl text-forest-800" data-count={conditionCount}>{conditionCount}</dd>
                <dt className="mt-2 text-sm text-ink-soft">Conditions listed</dt>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Searchable, filterable grid */}
      <section className="section !pt-0" aria-label="Treatment categories">
        <div className="wrap">
          {categories.length === 0 ? (
            <EmptyState title="Treatments are being added" text="Please contact the clinic with any questions." action={{ href: "/contact", label: "Contact the clinic" }} />
          ) : (
            <Suspense fallback={<p className="text-ink-soft">Loading categories…</p>}>
              <TreatmentExplorer items={categories} groups={groups} />
            </Suspense>
          )}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Treatment categories",
              itemListElement: categories.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, url: `${SITE_URL}/treatments/${c.slug}` })),
            },
            breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Treatments", path: "/treatments" }]),
          ]),
        }}
      />
    </>
  );
}
