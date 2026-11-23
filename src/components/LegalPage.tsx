import { PageHero } from "@/components/ui";
import type { LegalDoc } from "@/content/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero eyebrow={`Last updated ${doc.updated}`} title={doc.title} intro={doc.intro} crumbs={[{ label: doc.title }]} />
      <section className="section">
        <div className="wrap-narrow prose-hh">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
