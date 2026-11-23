import { notFound } from "next/navigation";
import { categoryLabel } from "@/components/BlogCard";
import { BlogListing } from "@/components/BlogListing";
import { buildMetadata } from "@/lib/seo";
import { ARTICLE_CATEGORIES } from "@/lib/validators";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ q?: string; page?: string }> };

const isCategory = (c: string): c is (typeof ARTICLE_CATEGORIES)[number] => (ARTICLE_CATEGORIES as readonly string[]).includes(c);

export async function generateMetadata({ params, searchParams }: Props) {
  const [{ category }, sp] = await Promise.all([params, searchParams]);
  if (!isCategory(category)) return { title: "Not found", robots: { index: false } };
  const meta = await buildMetadata({ path: `/blog/category/${category}`, title: `${categoryLabel(category)} | Health Articles`, description: `Educational health articles about ${categoryLabel(category).toLowerCase()} from Homeo-Healing.` });
  return sp.q || (sp.page && sp.page !== "1") ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const [{ category }, sp] = await Promise.all([params, searchParams]);
  if (!isCategory(category)) notFound();
  return <BlogListing category={category} q={sp.q} page={Number(sp.page) || 1} />;
}
