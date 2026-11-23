"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import type { FieldDef } from "./config";
import { RichTextEditor } from "./RichTextEditor";

type Values = Record<string, unknown>;

export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative h-40 w-64 overflow-hidden rounded-xl border border-sage-200 bg-sage-50">
          <Image src={value} alt="Selected" fill sizes="256px" className="object-cover" unoptimized={value.startsWith("/media/")} />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="btn btn-ghost !px-4 !py-2.5">
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
          {value ? "Replace image" : "Upload image"}
        </button>
        {value && <button type="button" onClick={() => onChange("")} className="text-sm text-ink-soft underline">Remove</button>}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" aria-label="Choose image file" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </div>
      <input className="field" placeholder="…or paste an https image URL" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Image URL" />
      {error && <p role="alert" className="field-error">{error}</p>}
    </div>
  );
}

function FieldInput({ field: f, id, value: v, onChange: set }: { field: FieldDef; id: string; value: unknown; onChange: (v: unknown) => void }) {
  if (f.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 text-sm font-medium text-forest-800">
        <input type="checkbox" className="size-4 accent-forest-700" checked={Boolean(v)} onChange={(e) => set(e.target.checked)} />
        {f.label}
      </label>
    );
  }
  if (f.type === "repeater") return <RepeaterField field={f} id={id} value={Array.isArray(v) ? (v as Values[]) : []} onChange={set} />;
  if (f.type === "richtext") {
    return (
      <div>
        <label htmlFor={id} className="label">{f.label}{f.required && <span aria-hidden="true"> *</span>}</label>
        <RichTextEditor id={id} value={String(v ?? "")} onChange={set} />
        {f.hint && <p className="mt-1.5 text-xs text-ink-soft">{f.hint}</p>}
      </div>
    );
  }
  return (
    <div>
      <label htmlFor={id} className="label">{f.label}{f.required && <span aria-hidden="true"> *</span>}</label>
      {f.type === "textarea" ? (
        <textarea id={id} rows={f.rows ?? 4} className="field resize-y" value={String(v ?? "")} onChange={(e) => set(e.target.value)} />
      ) : f.type === "lines" ? (
        <textarea id={id} rows={4} className="field resize-y" value={Array.isArray(v) ? v.join("\n") : ""} onChange={(e) => set(e.target.value.split("\n"))} onBlur={(e) => set(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />
      ) : f.type === "select" ? (
        <select id={id} className="field" value={String(v ?? "")} onChange={(e) => set(e.target.value)}>
          {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : f.type === "image" ? (
        <ImageField value={String(v ?? "")} onChange={set} />
      ) : f.type === "number" ? (
        <input id={id} type="number" className="field" value={Number(v ?? 0)} onChange={(e) => set(Number(e.target.value))} />
      ) : (
        <input id={id} type={f.type === "password" ? "password" : f.type === "date" ? "date" : "text"} autoComplete={f.type === "password" ? "new-password" : "off"} className="field" value={String(v ?? "")} onChange={(e) => set(e.target.value)} />
      )}
      {f.hint && <p className="mt-1.5 text-xs text-ink-soft">{f.hint}</p>}
    </div>
  );
}

/** A list of rows, each with its own small set of fields. Rows can be added, removed and reordered. */
function RepeaterField({ field: f, id, value, onChange }: { field: FieldDef; id: string; value: Values[]; onChange: (v: Values[]) => void }) {
  const update = (i: number, name: string, v: unknown) => onChange(value.map((row, j) => (j === i ? { ...row, [name]: v } : row)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const label = f.itemLabel ?? "item";
  return (
    <fieldset className="rounded-2xl border border-sage-200 bg-sage-50/60 p-4 sm:p-5">
      <legend className="label px-1">{f.label}</legend>
      {f.hint && <p className="mb-4 text-xs text-ink-soft">{f.hint}</p>}
      {value.length === 0 && <p className="mb-4 text-sm text-ink-soft">No {label}s yet.</p>}
      <ol className="space-y-4">
        {value.map((row, i) => (
          <li key={i} className="rounded-xl border border-sage-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{label} {i + 1}{row.title ? `: ${String(row.title).slice(0, 50)}` : ""}</span>
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${label} ${i + 1} up`} className="grid size-8 place-items-center rounded-full hover:bg-sage-100 disabled:opacity-30"><ChevronUp className="size-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Move ${label} ${i + 1} down`} className="grid size-8 place-items-center rounded-full hover:bg-sage-100 disabled:opacity-30"><ChevronDown className="size-4" /></button>
                <button type="button" onClick={() => window.confirm(`Remove this ${label}?`) && onChange(value.filter((_, j) => j !== i))} aria-label={`Remove ${label} ${i + 1}`} className="grid size-8 place-items-center rounded-full text-[#9a3322] hover:bg-[#fbeeea]"><Trash2 className="size-4" /></button>
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {f.itemFields?.map((sub) => (
                <div key={sub.name} className={sub.type === "textarea" || sub.name === "title" ? "sm:col-span-2" : ""}>
                  <FieldInput field={sub} id={`${id}-${i}-${sub.name}`} value={row[sub.name]} onChange={(v) => update(i, sub.name, v)} />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => onChange([...value, { ...(f.itemDefaults ?? {}) }])} className="btn btn-ghost mt-4 !px-4 !py-2.5">
        <Plus className="size-4" aria-hidden="true" /> Add {label}
      </button>
    </fieldset>
  );
}

export function AdminForm({
  fields, initial, onSubmit, onCancel, submitLabel = "Save", readOnlyInfo,
}: {
  fields: FieldDef[];
  initial: Values;
  onSubmit: (values: Values) => Promise<string | null>;
  onCancel?: () => void;
  submitLabel?: string;
  readOnlyInfo?: { label: string; value: string }[];
}) {
  const [values, setValues] = useState<Values>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const set = (name: string, v: unknown) => { setValues((p) => ({ ...p, [name]: v })); setSaved(false); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    const msg = await onSubmit(values);
    setBusy(false);
    if (msg) setError(msg);
    else setSaved(true);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {readOnlyInfo && (
        <dl className="grid gap-4 rounded-2xl bg-sage-50 p-5 sm:grid-cols-2">
          {readOnlyInfo.map((i) => (
            <div key={i.label} className={i.label === "Message" ? "sm:col-span-2" : ""}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{i.label}</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-ink">{i.value || "—"}</dd>
            </div>
          ))}
        </dl>
      )}
      {fields.map((f) => <FieldInput key={f.name} field={f} id={`f-${f.name}`} value={values[f.name]} onChange={(v) => set(f.name, v)} />)}
      {error && <p role="alert" className="rounded-xl border border-[#d9a99f] bg-[#fbeeea] p-3 text-sm text-[#6b2a1e]">{error}</p>}
      {saved && <p role="status" className="rounded-xl bg-sage-100 p-3 text-sm text-forest-800">Saved.</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {submitLabel}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>}
      </div>
    </form>
  );
}
