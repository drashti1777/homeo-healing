// One-off audit helper: prints text, links, images, forms and meta for each saved page.
import { readFileSync } from "node:fs";

const page = process.argv[2];
const html = readFileSync(new URL(`./${page}.html`, import.meta.url), "utf8");
const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const body = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");

const section = process.argv[3] ?? "all";
if (section === "meta" || section === "all") {
  console.log("TITLE:", decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""));
  for (const m of html.matchAll(/<meta\s+[^>]*(?:name|property)=["']([^"']+)["'][^>]*content=["']([^"']*)["'][^>]*>/gi)) console.log("META", m[1], "=", decode(m[2]));
}
if (section === "links" || section === "all") {
  const seen = new Set();
  for (const m of body.matchAll(/<a\s[^>]*href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const k = m[1];
    if (seen.has(k)) continue;
    seen.add(k);
    console.log("LINK", k, "|", decode(m[2].replace(/<[^>]+>/g, " ")).slice(0, 60));
  }
}
if (section === "images" || section === "all") {
  const seen = new Set();
  for (const m of body.matchAll(/<img\s[^>]*>/gi)) {
    const src = m[0].match(/\s(?:data-)?src=["']([^"']+)["']/i)?.[1];
    if (!src || seen.has(src)) continue;
    seen.add(src);
    console.log("IMG", src, "| alt:", m[0].match(/alt=["']([^"']*)["']/i)?.[1] ?? "(none)");
  }
  for (const m of body.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) console.log("BGIMG", m[1]);
}
if (section === "forms" || section === "all") {
  for (const f of body.matchAll(/<form[\s\S]*?<\/form>/gi)) {
    console.log("FORM", f[0].match(/<form[^>]*>/i)?.[0]);
    for (const i of f[0].matchAll(/<(input|textarea|select|button)\s[^>]*>/gi)) console.log("  FIELD", i[0].replace(/\s+/g, " ").slice(0, 200));
  }
  for (const m of body.matchAll(/<iframe[^>]*>/gi)) console.log("IFRAME", m[0].slice(0, 300));
}
if (section === "text" || section === "all") {
  const main = body.replace(/<(br|\/p|\/h\d|\/li|\/div|\/a|\/button|\/span)[^>]*>/gi, "\n").replace(/<[^>]+>/g, " ");
  const lines = main.split("\n").map(decode).filter(Boolean);
  console.log("TEXT:\n" + lines.join("\n"));
}
