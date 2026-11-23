import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Disclaimer, EmergencyNotice, EmptyState, PageHero } from "@/components/ui";
import { getConditions } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({ path: "/health-conditions", title: "Health Conditions We Discuss", description: "Educational overviews of common health concerns discussed at Dr. Neeta's Homeo Health Care, including when to see a doctor first." });

export default async function ConditionsPage() {
  const conditions = await getConditions();
  return (
    <>
      <PageHero eyebrow="Health conditions" title="Concerns people ask us about" intro="These pages are educational. They are not a diagnosis and do not claim that homeopathy cures any condition." crumbs={[{ label: "Health Conditions" }]} />
      <section className="section">
        <div className="wrap space-y-12">
          {conditions.length === 0 ? (
            <EmptyState title="Information is being prepared" text="Health condition overviews will appear here soon. Please contact the clinic if you have a question." action={{ href: "/contact", label: "Contact the clinic" }} />
          ) : (
            <ul className="divide-y divide-sage-200 border-y border-sage-200">
              {conditions.map((c) => (
                <li key={c._id} data-reveal>
                  <Link href={`/health-conditions/${c.slug}`} className="group flex items-center justify-between gap-6 py-7">
                    <span>
                      <span className="block font-serif text-3xl text-forest-800">{c.title}</span>
                      <span className="mt-1 block max-w-2xl text-ink-soft">{c.summary}</span>
                    </span>
                    <ArrowRight className="size-6 shrink-0 text-forest-600 transition-transform duration-500 group-hover:translate-x-2" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <EmergencyNotice />
          <Disclaimer />
        </div>
      </section>
    </>
  );
}
