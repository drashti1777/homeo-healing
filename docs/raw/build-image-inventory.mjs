// Builds docs/image-inventory.json from imgs-probed.tsv (HTTP-probed on 20 Nov 2026).
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://drneetahomeohealing.com";
const PAGE = { index: "/", about: "/about.php", treatment: "/treatment.php", faq: "/faq.php", gallery: "/gallery.php", contact: "/contact.php", paynow: "/paynow.php" };

function classify(src) {
  if (src.endsWith("logo.webp")) return { category: "logo", migrate: "reuse", note: "Primary brand logo, transparent background. Already copied to public/logo.webp." };
  if (src.includes("/heading/")) return { category: "decorative-section-icon", migrate: "do-not-migrate", note: "64x64 section heading icon from the old template. Replace with new design system icons." };
  if (/Practo|justdial|paytm|googlepay/.test(src)) return { category: "third-party-brand-icon", migrate: "do-not-migrate", note: "Third-party trademark icon. On the old site these link to '#' (no real profile URL)." };
  if (src.includes("scanf")) return { category: "payment-qr", migrate: "owner-verification-required", note: "Small QR in footer. Payment destination must be confirmed by owner before reuse." };
  if (src.endsWith("scan.jpg")) return { category: "payment-qr", migrate: "owner-verification-required", note: "Pay Now QR code for UPI ID 7623913175@paytm. Confirm it is current before reuse." };
  if (src.includes("/treatment/")) return { category: "treatment-category-icon", migrate: "reuse-with-permission", note: "256x256 illustration. Possibly stock artwork; confirm licence." };
  if (src.includes("homeo-health-team")) return { category: "team-photo", migrate: "reuse-with-permission", note: "Original clinic photo (high resolution). Owner must identify who is pictured and confirm consent." };
  if (src.includes("consultation-room")) return { category: "clinic-photo", migrate: "reuse-with-permission", note: "Low resolution (450x300). Request originals for a premium layout." };
  if (src.includes("dispensing-area")) return { category: "clinic-photo", migrate: "reuse-with-permission", note: "Very large original (about 5 MB). Must be resized and converted." };
  if (src.includes("reception-area")) return { category: "clinic-photo", migrate: "reuse-with-permission", note: "High resolution original." };
  if (src.includes("success-story")) return { category: "success-story", migrate: "owner-verification-required", note: "May show patient information. Requires patient consent before publishing." };
  if (src.endsWith("gallery/success.jpg")) return { category: "broken", migrate: "unavailable", note: "Returns HTTP 404 on the live site." };
  if (src.includes("service-item-img")) return { category: "about-tab-image", migrate: "owner-verification-required", note: "Used beside Lorem Ipsum placeholder tabs. Likely template/stock image; confirm source." };
  if (src.includes("i.ibb.co")) return { category: "external-hosted", migrate: "owner-verification-required", note: "Hosted on a third-party image host (ImgBB), shown in the testimonials area. Confirm what it shows and who owns it." };
  return { category: "other", migrate: "review", note: "" };
}

const rows = readFileSync(new URL("./imgs-probed.tsv", import.meta.url), "utf8").trim().split("\n").map((l) => l.split("\t"));
const images = rows.map(([page, src, alt, status, type, bytes, dim], i) => {
  const url = src.startsWith("http") ? src : `${BASE}/${src.replace(/ /g, "%20")}`;
  const c = classify(src);
  return {
    id: `img-${String(i + 1).padStart(3, "0")}`,
    sourceUrl: `${BASE}${PAGE[page]}`,
    imageUrl: url,
    originalTitle: src.split("/").pop(),
    originalAlt: alt === "(none)" ? "" : alt,
    contentType: "image",
    category: c.category,
    httpStatus: Number(status),
    mimeType: type.split(";")[0],
    bytes: Number(bytes),
    dimensions: dim === "-" ? null : dim,
    migration: c.migrate,
    verificationStatus: c.migrate === "reuse" ? "verified-from-source" : c.migrate === "unavailable" ? "unavailable" : "needs-owner-verification",
    notes: c.note,
  };
});

const extras = [
  { id: "media-001", sourceUrl: `${BASE}/gallery.php`, imageUrl: "https://www.youtube.com/embed/MmN6xSjrdtk", originalTitle: "Video Testimonials", contentType: "video-embed", category: "video-testimonial", migration: "owner-verification-required", verificationStatus: "needs-owner-verification", notes: "YouTube embed under 'Video Testimonials'. Confirm patient consent and channel ownership before embedding." },
  { id: "media-002", sourceUrl: `${BASE}/`, imageUrl: "https://files.elfsight.com/storage/a61c071c-8333-46e5-bd89-1a295be276cb/f3bae0bb-759c-4793-86f0-77805e898796.png", originalTitle: "Dr. Neeta (WhatsApp widget avatar)", contentType: "image", category: "doctor-photo-candidate", httpStatus: 301, migration: "owner-verification-required", verificationStatus: "needs-owner-verification", notes: "Avatar in the Elfsight WhatsApp widget, labelled 'Dr. Neeta'. URL redirects; not downloaded. Ask owner for an original doctor portrait." },
];

writeFileSync(
  new URL("../image-inventory.json", import.meta.url),
  JSON.stringify({ generated: "2026-11-20", source: BASE, method: "HTML parse of 7 pages + HTTP probe of each image (status, MIME, bytes, pixel size)", totals: { images: images.length, broken: images.filter((i) => i.httpStatus !== 200).length }, images, otherMedia: extras }, null, 2) + "\n",
);
console.log(`wrote ${images.length} images + ${extras.length} other media`);
