import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Renders admin-authored text safely as React nodes (never as raw HTML).
 * Supported: blank-line paragraphs, "## " / "### " headings, "- " bullet lists, **bold**,
 * [text](https://… or /path) links, and ![alt](/media/… or https://…) images on their own line.
 */
const SAFE_URL = /^(https:\/\/|\/(?!\/))/;

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m && SAFE_URL.test(m[2])) {
      return m[2].startsWith("/") ? <Link key={i} href={m[2]}>{m[1]}</Link> : <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Richtext({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-hh">
      {blocks.map((block, i) => {
        const img = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
        if (img && SAFE_URL.test(img[2])) {
          return (
            <figure key={i} className="!my-8">
              <span className="relative block aspect-[16/9] overflow-hidden rounded-2xl bg-sage-100">
                <Image src={img[2]} alt={img[1]} fill sizes="(min-width:768px) 46rem, 100vw" className="object-cover" />
              </span>
              {img[1] && <figcaption className="mt-2 text-center text-sm text-ink-soft">{img[1]}</figcaption>}
            </figure>
          );
        }
        if (block.startsWith("### ")) return <h3 key={i}>{block.slice(4)}</h3>;
        if (block.startsWith("## ")) return <h2 key={i}>{block.slice(3)}</h2>;
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>;
        }
        return <p key={i}>{lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l)}</Fragment>)}</p>;
      })}
    </div>
  );
}
