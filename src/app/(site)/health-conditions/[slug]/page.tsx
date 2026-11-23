import Link from "next/link";
import { notFound } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Disclaimer, EmergencyNotice, PageHero } from "@/components/ui";
import { Richtext } from "@/components/Richtext";
import { getCondition } from "@/lib/data";
import { breadcrumbJsonLd, buildMetadata, jsonLdString } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const c = await getCondition((await params).slug);
  if (!c) return { title: "Not found", robots: { index: false } };
  return buildMetadata({ path: `/health-conditions/${c.slug}`, title: c.seoTitle || c.title, description: c.seoDescription || c.summary });
}

export default async function ConditionDetailPage({ params }: Props) {
  const c = await getCondition((await params).slug);
  if (!c) notFound();
  return (
    <>
      <PageHero eyebrow="Health condition" title={c.title} intro={c.summary} crumbs={[{ label: "Health Conditions", href: "/health-conditions" }, { label: c.title }]} />
      <section className="section">
        <div className="wrap-narrow space-y-10">
          <aside className="flex gap-4 rounded-3xl border border-beige-300 bg-beige-100 p-6">
            <TriangleAlert className="mt-1 size-6 shrink-0 text-forest-700" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-normal">See a doctor first if&hellip;</h2>
              <p className="mt-2 text-ink-soft">{c.seeDoctorFirst}</p>
            </div>
          </aside>
          <Richtext text={c.body} />
          <EmergencyNotice />
          <Disclaimer />
          <Link href="/book-appointment" className="btn btn-primary">Request an appointment</Link>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Health Conditions", path: "/health-conditions" }, { name: c.title, path: `/health-conditions/${c.slug}` }])) }} />
    </>
  );
}
