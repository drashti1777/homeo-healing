import Link from "next/link";
import { BotanicalPlaceholder, MediaImage } from "@/components/ui";
import type { ArticleDoc } from "@/lib/data";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/validators";

export const categoryLabel = (c: string) => ARTICLE_CATEGORY_LABELS[c as keyof typeof ARTICLE_CATEGORY_LABELS] ?? c;
export const formatDate = (d: string) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "");

export function BlogCard({ a, authorName, priority = false }: { a: ArticleDoc; authorName?: string; priority?: boolean }) {
  return (
    <Link href={`/blog/${a.slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden rounded-[1.75rem] bg-sage-100">
        {a.image ? (
          <MediaImage src={a.image} alt={a.imageAlt} priority={priority} className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105" sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" />
        ) : (
          <BotanicalPlaceholder className="absolute inset-0" />
        )}
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-sage-500">
        {a.category ? categoryLabel(a.category) : "Article"}
        {a.publishedAt && <span className="font-normal normal-case tracking-normal text-ink-soft"> · {formatDate(a.publishedAt)}</span>}
      </p>
      <h2 className="mt-2 text-2xl font-normal transition-colors group-hover:text-forest-600">{a.title}</h2>
      <p className="mt-2 text-ink-soft">{a.excerpt}</p>
      {authorName && <p className="mt-3 text-sm text-ink-soft">By {authorName}</p>}
    </Link>
  );
}
