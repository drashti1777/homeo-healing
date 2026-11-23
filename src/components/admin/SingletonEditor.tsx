"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminForm } from "./AdminForm";
import { SINGLETONS } from "./config";

export function SingletonEditor({ name }: { name: "doctor" | "settings" }) {
  const def = SINGLETONS[name];
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/singleton/${name}`)
      .then(async (r) => {
        const d = (await r.json()) as { item?: Record<string, unknown>; error?: string };
        if (!r.ok) throw new Error(d.error ?? "Could not load");
        setInitial({ ...def.defaults, ...d.item });
      })
      .catch((e: Error) => setError(e.message));
  }, [name, def.defaults]);

  async function save(values: Record<string, unknown>) {
    const allowed = Object.fromEntries(def.fields.map((f) => [f.name, values[f.name]]));
    const res = await fetch(`/api/admin/singleton/${name}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(allowed) });
    if (res.ok) return null;
    const d = (await res.json().catch(() => ({}))) as { error?: string; details?: { path: string; message: string }[] };
    return `${d.error ?? "Could not save."} ${d.details?.map((x) => `${x.path}: ${x.message}`).join(" · ") ?? ""}`.trim();
  }

  if (error) return <p role="alert" className="rounded-xl border border-[#d9a99f] bg-[#fbeeea] p-4 text-sm text-[#6b2a1e]">{error}</p>;
  if (!initial) return <p className="flex items-center gap-2 text-ink-soft"><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading…</p>;
  return (
    <div className="max-w-3xl">
      <p className="mb-6 text-sm text-ink-soft">{def.description}</p>
      <AdminForm fields={def.fields} initial={initial} onSubmit={save} />
    </div>
  );
}
