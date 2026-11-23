import { BlogListing } from "@/components/BlogListing";
import { buildMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props) {
  const sp = await searchParams;
  const meta = await buildMetadata({ path: "/blog", title: "Health Articles", description: "Educational health articles from Homeo-Healing. Medically reviewed information that does not replace advice from your doctor." });
  // Search and pagination variants are not separate pages for search engines.
  return sp.q || (sp.page && sp.page !== "1") ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <BlogListing q={sp.q} page={Number(sp.page) || 1} />;
}
