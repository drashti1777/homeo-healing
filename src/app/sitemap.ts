import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { getArticles, getConditions, getTreatments } from "@/lib/data";

const STATIC = ["", "/about", "/about-homeopathy", "/treatments", "/health-conditions", "/gallery", "/blog", "/faq", "/contact", "/book-appointment", "/privacy-policy", "/terms-and-conditions", "/medical-disclaimer"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: p === "" ? "weekly" : "monthly", priority: p === "" ? 1 : 0.7 }));
  try {
    const [treatments, conditions, articles] = await Promise.all([getTreatments(), getConditions(), getArticles()]);
    for (const t of treatments) entries.push({ url: `${SITE_URL}/treatments/${t.slug}`, lastModified: t.updatedAt, priority: 0.7 });
    for (const c of conditions) entries.push({ url: `${SITE_URL}/health-conditions/${c.slug}`, lastModified: c.updatedAt, priority: 0.6 });
    for (const a of articles) entries.push({ url: `${SITE_URL}/blog/${a.slug}`, lastModified: a.updatedAt, priority: 0.6 });
    for (const c of new Set(articles.map((a) => a.category).filter(Boolean))) entries.push({ url: `${SITE_URL}/blog/category/${c}`, priority: 0.5 });
  } catch (err) {
    console.error("[sitemap] dynamic entries unavailable", err);
  }
  return entries;
}
