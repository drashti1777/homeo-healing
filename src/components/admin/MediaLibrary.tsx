"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, Loader2, Upload } from "lucide-react";

export function MediaLibrary() {
  const [items, setItems] = useState<{ url: string }[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/media");
    const d = (await res.json()) as { items?: { url: string }[]; error?: string };
    if (res.ok && d.items) setItems(d.items);
    else setError(d.error ?? "Could not load images");
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body });
    const d = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (input.current) input.current.value = "";
    if (!res.ok) setError(d.error ?? "Upload failed");
    else await load();
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm text-ink-soft">Uploaded images are converted to optimised WebP and stripped of location metadata. To use one, open any treatment, article or doctor profile and upload there, or copy the path below.</p>
      <button type="button" onClick={() => input.current?.click()} disabled={busy} className="btn btn-primary mb-6">
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />} Upload image
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" aria-label="Choose image file" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      {error && <p role="alert" className="mb-4 rounded-xl border border-[#d9a99f] bg-[#fbeeea] p-3 text-sm text-[#6b2a1e]">{error}</p>}
      {items === null ? <p className="text-ink-soft">Loading…</p> : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-sage-300 bg-white p-10 text-center text-ink-soft">No images uploaded yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <li key={i.url} className="overflow-hidden rounded-2xl border border-sage-200 bg-white">
              <div className="relative aspect-[4/3] bg-sage-50"><Image src={i.url} alt="" fill sizes="25vw" className="object-cover" unoptimized /></div>
              <button type="button" onClick={() => copy(i.url)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-ink-soft hover:bg-sage-50">
                <span className="truncate">{i.url}</span>{copied === i.url ? <Check className="size-4 text-forest-600" aria-label="Copied" /> : <Copy className="size-4" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
