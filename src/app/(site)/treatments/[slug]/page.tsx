import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { Richtext } from "@/components/Richtext";
import { TreatmentIcon } from "@/components/TreatmentIcon";
import { BotanicalPlaceholder, Disclaimer, EmergencyNotice, MediaImage, PageHero } from "@/components/ui";
import { getTreatment, getTreatments } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";
import { TREATMENT_GROUP_LABELS } from "@/lib/validators";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const t = await getTreatment((await params).slug);
  if (!t) return { title: "Treatment not found", robots: { index: false } };
  return buildMetadata({ path: `/treatments/${t.slug}`, title: t.seoTitle || t.title, description: t.seoDescription || t.summary, image: t.image || undefined });
}

export default async function TreatmentDetailPage({ params }: Props) {
  const slug = (await params).slug;
  const [t, all] = await Promise.all([getTreatment(slug), getTreatments()]);
  if (!t) notFound();
  const list = all.filter((x) => (x.group ?? "body-systems") !== "general");
  const idx = list.findIndex((x) => x.slug === t.slug);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const conditions = t.conditions ?? [];
  const specialist = t.riskLevel === "specialist";

  return (
    <>
      <PageHero
        eyebrow={t.group ? TREATMENT_GROUP_LABELS[t.group] : "Treatment"}
        title={t.title}
        intro={t.summary}
        crumbs={[{ label: "Treatments", href: "/treatments" }, { label: t.title }]}
      />
      <section className="section">
        <div className="wrap grid items-start gap-14 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="min-w-0">
            {/* Safety notice comes first for serious categories, before any other content. */}
            {t.safetyNotice && (
              <aside
                role="note"
                aria-labelledby="safety-heading"
                className={`mb-10 flex gap-4 rounded-[1.75rem] border p-6 md:p-7 ${specialist ? "border-[#d9a99f] bg-[#fbeeea] text-[#5a2418]" : "border-beige-300 bg-beige-100 text-ink"}`}
              >
                <ShieldAlert className="mt-1 size-6 shrink-0" aria-hidden="true" />
                <div>
                  <h2 id="safety-heading" className={`!font-sans text-base font-semibold ${specialist ? "!text-[#5a2418]" : ""}`}>
                    {specialist ? "Please seek qualified medical care" : "When to see a doctor"}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed">{t.safetyNotice}</p>
                </div>
              </aside>
            )}

            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[2rem] bg-sage-100">
              {t.image ? <MediaImage src={t.image} alt={t.imageAlt || t.title} priority className="absolute inset-0" sizes="(min-width:1024px) 60vw, 100vw" /> : <BotanicalPlaceholder className="absolute inset-0" />}
              <span className="glass absolute left-5 top-5 grid size-12 place-items-center rounded-full text-forest-800"><TreatmentIcon name={t.icon} /></span>
            </div>

            <Richtext text={t.body} />

            {(prev || next) && (
              <nav aria-label="Other treatment categories" className="mt-16 grid gap-4 border-t border-sage-200 pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link href={`/treatments/${prev.slug}`} className="group rounded-[1.5rem] border border-sage-200 p-5 transition-colors hover:border-forest-600">
                    <span className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-soft"><ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> Previous</span>
                    <span className="mt-2 block font-serif text-xl text-forest-800">{prev.title}</span>
                  </Link>
                ) : <span />}
                {next && (
                  <Link href={`/treatments/${next.slug}`} className="group rounded-[1.5rem] border border-sage-200 p-5 text-right transition-colors hover:border-forest-600">
                    <span className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.14em] text-ink-soft">Next <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                    <span className="mt-2 block font-serif text-xl text-forest-800">{next.title}</span>
                  </Link>
                )}
              </nav>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            {conditions.length > 0 && (
              <div className="rounded-[2rem] bg-sage-50 p-7">
                <h2 className="text-xl font-normal">Conditions listed</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {conditions.map((c) => <li key={c} className="rounded-full bg-paper px-3 py-1.5 text-sm text-forest-800">{c}</li>)}
                </ul>
                <p className="mt-4 text-xs text-ink-soft">Listed for information. Not a claim that homeopathy treats these conditions.</p>
              </div>
            )}
            <Link href="/book-appointment" className="btn btn-primary w-full">Request an appointment</Link>
            <Link href="/treatments" className="btn btn-ghost w-full"><ArrowLeft className="size-4" aria-hidden="true" /> All categories</Link>
            <EmergencyNotice />
          </aside>
        </div>
        <div className="wrap mt-16"><Disclaimer /></div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([
            {
              "@context": "https://schema.org",
              "@type": "MedicalWebPage",
              name: t.title,
              url: `${SITE_URL}/treatments/${t.slug}`,
              description: t.summary,
              lastReviewed: t.updatedAt?.slice(0, 10),
              about: conditions.map((c) => ({ "@type": "MedicalCondition", name: c })),
            },
            breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Treatments", path: "/treatments" }, { name: t.title, path: `/treatments/${t.slug}` }]),
          ]),
        }}
      />
    </>
  );
}
