import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { BlogCard, categoryLabel, formatDate } from "@/components/BlogCard";
import { Richtext } from "@/components/Richtext";
import { Disclaimer, EmergencyNotice, MediaImage, PageHero } from "@/components/ui";
import { getArticle, getAuthors, getRelatedArticles, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, buildMetadata, jsonLdString, SITE_NAME } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const a = await getArticle((await params).slug);
  if (!a) return { title: "Article not found", robots: { index: false } };
  return buildMetadata({ path: `/blog/${a.slug}`, title: a.seoTitle || a.title, description: a.seoDescription || a.excerpt, image: a.image || undefined, type: "article" });
}

export default async function ArticlePage({ params }: Props) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const [settings, authors, related] = await Promise.all([getSettings(), getAuthors(), getRelatedArticles(a)]);
  const bySlug = new Map(authors.map((x) => [x.slug, x]));
  const author = bySlug.get(a.authorSlug);
  const reviewer = bySlug.get(a.reviewerSlug);
  const isHealth = a.category !== "clinic-news";
  const abs = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u}`);
  const person = (p?: { name: string; credentials: string }) => (p ? { "@type": "Person", name: p.name, ...(p.credentials && { jobTitle: p.credentials }) } : undefined);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": isHealth ? "MedicalWebPage" : "Article",
      headline: a.title,
      description: a.excerpt,
      ...(a.image && { image: abs(a.image) }),
      ...(a.publishedAt && { datePublished: a.publishedAt }),
      dateModified: a.updatedAt,
      author: person(author) ?? { "@type": "Organization", name: settings.clinicName || SITE_NAME },
      ...(reviewer && { reviewedBy: person(reviewer), lastReviewed: a.reviewedAt }),
      publisher: { "@type": "Organization", name: settings.clinicName || SITE_NAME },
      mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
    },
    breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Articles", path: "/blog" }, { name: a.title, path: `/blog/${a.slug}` }]),
  ];

  return (
    <>
      <PageHero
        eyebrow={a.category ? categoryLabel(a.category) : "Article"}
        title={a.title}
        intro={a.excerpt}
        crumbs={[{ label: "Articles", href: "/blog" }, ...(a.category ? [{ label: categoryLabel(a.category), href: `/blog/category/${a.category}` }] : []), { label: a.title }]}
      />
      <article className="section">
        <div className="wrap-narrow space-y-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-sage-200 pb-6 text-sm text-ink-soft">
            {author && (
              <span className="flex items-center gap-3">
                {author.photo && <span className="relative size-10 overflow-hidden rounded-full bg-sage-100"><Image src={author.photo} alt="" fill sizes="40px" className="object-cover" /></span>}
                <span>By <strong className="font-semibold text-forest-800">{author.name}</strong>{author.credentials && `, ${author.credentials}`}</span>
              </span>
            )}
            {a.publishedAt && <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>}
          </div>

          {isHealth && reviewer && (
            <p className="flex gap-3 rounded-2xl bg-sage-50 p-4 text-sm text-forest-800">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-forest-600" aria-hidden="true" />
              <span>Medically reviewed by <strong>{reviewer.name}</strong>{reviewer.credentials && `, ${reviewer.credentials}`}{a.reviewedAt && <> on <time dateTime={a.reviewedAt}>{formatDate(a.reviewedAt)}</time></>}.</span>
            </p>
          )}

          {a.image && <div className="relative aspect-[16/9] overflow-hidden rounded-3xl"><MediaImage src={a.image} alt={a.imageAlt} priority className="absolute inset-0" sizes="(min-width:768px) 46rem, 100vw" /></div>}
          <Richtext text={a.body} />

          {a.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {a.tags.map((t) => <li key={t}><Link href={`/blog?q=${encodeURIComponent(t)}`} className="rounded-full bg-sage-100 px-3 py-1.5 text-sm text-forest-800 hover:bg-sage-200">#{t}</Link></li>)}
            </ul>
          )}

          {isHealth && <EmergencyNotice />}
          <Disclaimer />
        </div>
      </article>

      {related.length > 0 && (
        <section className="section bg-sage-50" aria-labelledby="related-heading">
          <div className="wrap">
            <h2 id="related-heading" data-split className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal">Related articles</h2>
            <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {related.map((r) => <li key={r._id} data-reveal><BlogCard a={r} authorName={bySlug.get(r.authorSlug)?.name} /></li>)}
            </ul>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
    </>
  );
}
