import type { Metadata } from "next";
import { SITE_URL } from "./env";
import { getSeoPage, type SettingsDoc } from "./data";

export const SITE_NAME = "Dr. Neeta's Homeo Health Care";
export const DEFAULT_DESCRIPTION =
  "Dr. Neeta's Homeo Health Care offers unhurried, whole-person homeopathic consultations and honest, educational health information.";

type PageMeta = { path: string; title: string; description: string; image?: string; type?: "website" | "article"; noIndex?: boolean };

/** Builds metadata for a page. An SEO override saved in the admin panel for the same path wins. */
export async function buildMetadata(meta: PageMeta): Promise<Metadata> {
  let override = null;
  try {
    override = await getSeoPage(meta.path);
  } catch {
    /* DB unavailable: fall back to code defaults */
  }
  const title = override?.title ?? meta.title;
  const description = override?.description ?? meta.description;
  const image = override?.ogImage || meta.image;
  const noIndex = override?.noIndex ?? meta.noIndex ?? false;
  const url = `${SITE_URL}${meta.path === "/" ? "" : meta.path}`;
  return {
    title: meta.path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title, description, url, siteName: SITE_NAME, type: meta.type ?? "website", locale: "en",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : undefined },
  };
}

export function clinicJsonLd(s: SettingsDoc) {
  const hasAddress = s.addressLine || s.city;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE_URL}/#clinic`,
    name: s.clinicName || SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    medicalSpecialty: "Homeopathy",
    ...(s.phone && { telephone: s.phone }),
    ...(s.email && { email: s.email }),
    ...(hasAddress && {
      address: {
        "@type": "PostalAddress",
        streetAddress: s.addressLine,
        addressLocality: s.city,
        addressRegion: s.state,
        postalCode: s.postalCode,
        addressCountry: s.country,
      },
    }),
    ...(s.openingHours.length && { openingHours: s.openingHours }),
    sameAs: [s.instagramUrl, s.facebookUrl, s.youtubeUrl].filter(Boolean),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** Escapes "<" so stored content can never close the script tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
