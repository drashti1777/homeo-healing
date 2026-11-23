"use client";

import { useRef, useState } from "react";
import { Bold, Eye, Heading2, Heading3, ImagePlus, Link, List, Loader2, Pencil } from "lucide-react";
import { Richtext } from "@/components/Richtext";

/**
 * Rich text editing for articles. Content is stored as the site's safe markdown subset
 * (rendered by <Richtext>, never as raw HTML), so stored content cannot inject scripts.
 * Toolbar: H2, H3, bold, bullet list, link, image upload, and a live preview.
 */
export function RichTextEditor({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /** Replace the current selection (or insert at caret) and keep focus. */
  function apply(fn: (selected: string) => { text: string; select?: [number, number] }) {
    const el = ta.current;
    if (!el) return;
    const [start, end] = [el.selectionStart, el.selectionEnd];
    const { text, select } = fn(value.slice(start, end));
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const [a, b] = select ?? [text.length, text.length];
      el.setSelectionRange(start + a, start + b);
    });
  }
  const block = (prefix: string, placeholder: string) =>
    apply((sel) => {
      const body = sel || placeholder;
      const lead = value.slice(0, ta.current?.selectionStart ?? 0).endsWith("\n\n") || (ta.current?.selectionStart ?? 0) === 0 ? "" : "\n\n";
      return { text: `${lead}${prefix}${body}\n\n`, select: [lead.length + prefix.length, lead.length + prefix.length + body.length] };
    });
  const list = () =>
    apply((sel) => {
      const lines = (sel || "List item").split("\n").map((l) => `- ${l.replace(/^- /, "")}`).join("\n");
      return { text: `\n\n${lines}\n\n` };
    });
  const bold = () => apply((sel) => ({ text: `**${sel || "bold text"}**`, select: [2, 2 + (sel || "bold text").length] }));
  const link = () => {
    const url = window.prompt("Link URL (https://… or /page)");
    if (!url || !/^(https:\/\/|\/)/.test(url)) return;
    apply((sel) => ({ text: `[${sel || "link text"}](${url})` }));
  };

  async function upload(f: File) {
    setUploading(true);
    setError("");
    const body = new FormData();
    body.set("file", f);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      const alt = window.prompt("Describe this image for screen readers (alt text)")?.trim() || "Article image";
      apply(() => ({ text: `\n\n![${alt.replace(/[[\]]/g, "")}](${data.url})\n\n` }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (file.current) file.current.value = "";
    }
  }

  const btn = "grid size-9 place-items-center rounded-lg text-forest-800 hover:bg-sage-100 disabled:opacity-40";
  return (
    <div className="overflow-hidden rounded-xl border border-sage-200 bg-white focus-within:border-forest-600 focus-within:ring-4 focus-within:ring-forest-600/15">
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1 border-b border-sage-200 bg-sage-50 px-2 py-1.5">
        <button type="button" className={btn} onClick={() => block("## ", "Heading")} disabled={preview} aria-label="Heading"><Heading2 className="size-4" /></button>
        <button type="button" className={btn} onClick={() => block("### ", "Subheading")} disabled={preview} aria-label="Subheading"><Heading3 className="size-4" /></button>
        <button type="button" className={btn} onClick={bold} disabled={preview} aria-label="Bold"><Bold className="size-4" /></button>
        <button type="button" className={btn} onClick={list} disabled={preview} aria-label="Bullet list"><List className="size-4" /></button>
        <button type="button" className={btn} onClick={link} disabled={preview} aria-label="Link"><Link className="size-4" /></button>
        <button type="button" className={btn} onClick={() => file.current?.click()} disabled={preview || uploading} aria-label="Insert image">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        </button>
        <input ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" aria-label="Choose image to insert" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <span className="flex-1" />
        <button type="button" onClick={() => setPreview((p) => !p)} aria-pressed={preview} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-forest-800 hover:bg-sage-100">
          {preview ? <><Pencil className="size-3.5" aria-hidden="true" /> Edit</> : <><Eye className="size-3.5" aria-hidden="true" /> Preview</>}
        </button>
      </div>
      {preview ? (
        <div className="max-h-[32rem] overflow-y-auto p-5">{value.trim() ? <Richtext text={value} /> : <p className="text-sm text-ink-soft">Nothing to preview yet.</p>}</div>
      ) : (
        <textarea ref={ta} id={id} rows={18} value={value} onChange={(e) => onChange(e.target.value)} className="block w-full resize-y border-0 p-4 font-mono text-sm leading-relaxed text-ink focus:outline-none" />
      )}
      {error && <p role="alert" className="field-error px-4 pb-3">{error}</p>}
    </div>
  );
}
