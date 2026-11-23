import Link from "next/link";
import { Search } from "lucide-react";
import { BlogCard, categoryLabel } from "@/components/BlogCard";
import { Disclaimer, PageHero } from "@/components/ui";
import { getAuthors, searchArticles } from "@/lib/data";
import { ARTICLE_CATEGORIES } from "@/lib/validators";

/** Server-rendered listing shared by /blog and /blog/category/[category]. Search and paging use plain GET links/forms. */
export async function BlogListing({ category, q, page }: { category?: string; q?: string; page: number }) {
  const [{ items, total, pages, page: current }, authors] = await Promise.all([searchArticles({ q, category, page }), getAuthors()]);
  const authorName = new Map(authors.map((a) => [a.slug, a.name]));
  const base = category ? `/blog/category/${category}` : "/blog";
  const href = (p: number) => {
    const s = new URLSearchParams();
    if (q) s.set("q", q);
    if (p > 1) s.set("page", String(p));
    const qs = s.toString();
    return qs ? `${base}?${qs}` : base;
  };
  const title = category ? categoryLabel(category) : "Health articles";

  return (
    <>
      <PageHero
        eyebrow="Articles"
        title={title}
        intro="Educational reading, medically reviewed before publication. It is not medical advice and does not replace your doctor."
        crumbs={category ? [{ label: "Articles", href: "/blog" }, { label: title }] : [{ label: "Articles" }]}
      />
      <section className="section">
        <div className="wrap">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="Article categories" className="flex flex-wrap gap-2">
              <Link href="/blog" aria-current={!category ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-forest-800 text-paper" : "text-forest-800 ring-1 ring-sage-200 hover:bg-sage-100"}`}>All</Link>
              {ARTICLE_CATEGORIES.map((c) => (
                <Link key={c} href={`/blog/category/${c}`} aria-current={category === c ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${category === c ? "bg-forest-800 text-paper" : "text-forest-800 ring-1 ring-sage-200 hover:bg-sage-100"}`}>{categoryLabel(c)}</Link>
              ))}
            </nav>
            <form role="search" action={base} method="get" className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-forest-600" aria-hidden="true" />
              <label htmlFor="blog-search" className="sr-only">Search articles</label>
              <input id="blog-search" name="q" type="search" defaultValue={q} placeholder="Search articles" className="field !rounded-full !pl-11" maxLength={80} />
            </form>
          </div>

          <p role="status" className="mt-8 text-sm text-ink-soft">
            {total} article{total === 1 ? "" : "s"}{q && <> matching &ldquo;{q}&rdquo; · <Link href={base} className="underline">clear search</Link></>}
          </p>

          {items.length === 0 ? (
            <div className="mt-6 rounded-[2rem] border border-dashed border-sage-300 bg-sage-50 px-6 py-16 text-center">
              <h2 className="text-2xl font-normal">{q || category ? "No articles found" : "Articles are being prepared"}</h2>
              <p className="mx-auto mt-3 max-w-md text-ink-soft">
                {q || category ? "Try a different search or category." : "Medically reviewed health articles will be published here. In the meantime, our FAQ answers common questions about homeopathy."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {(q || category) && <Link href="/blog" className="btn btn-ghost">All articles</Link>}
                <Link href="/faq" className="btn btn-primary">Read the FAQ</Link>
              </div>
            </div>
          ) : (
            <ul className="mt-8 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {items.map((a, i) => (
                <li key={a._id} data-reveal data-delay={(i % 3) * 0.08}>
                  <BlogCard a={a} authorName={authorName.get(a.authorSlug)} priority={i < 3} />
                </li>
              ))}
            </ul>
          )}

          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center justify-center gap-2">
              {current > 1 && <Link href={href(current - 1)} rel="prev" className="btn btn-ghost !px-4 !py-2.5">Previous</Link>}
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={href(p)} aria-current={p === current ? "page" : undefined}
                  className={`grid size-10 place-items-center rounded-full text-sm font-medium ${p === current ? "bg-forest-800 text-paper" : "text-forest-800 hover:bg-sage-100"}`}>{p}</Link>
              ))}
              {current < pages && <Link href={href(current + 1)} rel="next" className="btn btn-ghost !px-4 !py-2.5">Next</Link>}
            </nav>
          )}

          <Disclaimer className="mt-16" />
        </div>
      </section>
    </>
  );
}
