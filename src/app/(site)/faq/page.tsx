import Link from "next/link";
import { ArrowRight, FlaskConical, Phone } from "lucide-react";
import { FaqExplorer, type FaqItem } from "@/components/FaqExplorer";
import { EmptyState, PageHero } from "@/components/ui";
import { getFaqs, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";
import { FAQ_CATEGORIES, FAQ_CATEGORY_LABELS } from "@/lib/validators";

export const generateMetadata = () =>
  buildMetadata({
    path: "/faq",
    title: "FAQ About Homeopathy | Homeo-Healing",
    description: "Answers about homoeopathy, homeopathic medicines, safety alongside other medicines, the limits of scientific evidence, and consultations with Dr. Neeta Parmar.",
  });

const telHref = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
  const items: FaqItem[] = faqs.map((f) => ({ slug: f.slug, question: f.question, answer: f.answer, category: f.category, relatedSlugs: f.relatedSlugs ?? [] }));
  const categories = FAQ_CATEGORIES.map((key) => ({ key, label: FAQ_CATEGORY_LABELS[key] }));

  return (
    <>
      <PageHero eyebrow="FAQ" title="FAQ about homeopathy" intro="Plain answers to the questions patients ask most, including what the scientific evidence does and does not show." crumbs={[{ label: "FAQ" }]} />

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="min-w-0">
            {items.length === 0 ? (
              <EmptyState title="Questions are being added" text="Please contact the clinic and we will be glad to help." action={{ href: "/contact", label: "Contact us" }} />
            ) : (
              <FaqExplorer items={items} categories={categories} />
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-[2rem] bg-forest-900 p-7 text-paper" data-reveal>
              <h2 className="text-xl font-normal !text-paper">Still have a question?</h2>
              <p className="mt-3 text-sm text-sage-200">Ask the clinic, or send an appointment request to discuss it with Dr. Neeta.</p>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/contact" className="btn btn-light !py-3">Ask the clinic</Link>
                <Link href="/book-appointment" className="btn btn-outline-light !py-3">Request an appointment</Link>
                {settings.phone && <a href={telHref(settings.phone)} className="inline-flex items-center justify-center gap-2 text-sm text-sage-100"><Phone className="size-4" aria-hidden="true" /> {settings.phone}</a>}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString([
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                url: `${SITE_URL}/faq`,
                mainEntity: items.map((f) => ({ "@type": "Question", "@id": `${SITE_URL}/faq#${f.slug}`, name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer.replace(/\n{2,}/g, " ") } })),
              },
              breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]),
            ]),
          }}
        />
      )}
    </>
  );
}
