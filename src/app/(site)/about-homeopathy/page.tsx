import Link from "next/link";
import { Disclaimer, EmergencyNotice, PageHero } from "@/components/ui";
import { HOMEOPATHY_SECTIONS } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({ path: "/about-homeopathy", title: "About Homeopathy: What It Is and What the Evidence Says", description: "A balanced, educational introduction to homeopathy: how it works in theory, what the scientific evidence says, and how to use it safely." });

export default function AboutHomeopathyPage() {
  return (
    <>
      <PageHero eyebrow="Educational guide" title="Understanding homeopathy" intro="A balanced overview of what homeopathy is, what research says, and how to use it safely alongside conventional care." crumbs={[{ label: "About Homeopathy" }]} />
      <section className="section">
        <div className="wrap-narrow space-y-14">
          {HOMEOPATHY_SECTIONS.map((s) => (
            <article key={s.title}>
              <h2 data-split className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal">{s.title}</h2>
              <div className="mt-5 space-y-4 text-lg text-ink-soft" data-reveal>
                {s.body.map((p) => <p key={p}>{p}</p>)}
              </div>
            </article>
          ))}
          <EmergencyNotice />
          <Disclaimer />
          <div className="flex flex-wrap gap-4" data-reveal>
            <Link href="/book-appointment" className="btn btn-primary">Request an appointment</Link>
            <Link href="/faq" className="btn btn-ghost">Read the FAQ</Link>
          </div>
        </div>
      </section>
    </>
  );
}
