/**
 * Downloads the clinic-room photos from drneetahomeohealing.com/gallery.php into public/gallery as optimised WebP.
 * Next/Image then serves responsive AVIF/WebP variants. Team and success-story photos are deliberately skipped
 * (see docs/content-verification-required.md, section 6).
 * Run: npm run import:gallery
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BASE = "https://drneetahomeohealing.com/assets/img/gallery";
const OUT = path.resolve("public/gallery");

const FILES: [string, string][] = [
  ["reception-area/reception.jpg", "reception-1"],
  ...[1, 2, 3, 4].map((n) => [`consultation-room/consultation room${n}.jpg`, `consultation-${n}`] as [string, string]),
  ...[1, 2, 3, 4].map((n) => [`dispensing-area/dispencing area${n}.jpg`, `dispensing-${n}`] as [string, string]),
];

await mkdir(OUT, { recursive: true });
for (const [src, name] of FILES) {
  const url = `${BASE}/${src.replace(/ /g, "%20")}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) {
    console.warn(`skip ${src}: HTTP ${res.status}`);
    continue;
  }
  const out = await sharp(Buffer.from(await res.arrayBuffer()))
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, `${name}.webp`), out.data);
  console.log(`${name}.webp  ${out.info.width}x${out.info.height}  ${(out.info.size / 1024).toFixed(0)} KB`);
}
