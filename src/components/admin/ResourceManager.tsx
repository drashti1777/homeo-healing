"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { AdminForm } from "./AdminForm";
import { CONSULT_LABELS, type ResourceConfig } from "./config";

type Item = Record<string, unknown> & { _id: string };
type ListResponse = { items: Item[]; total: number; page: number; pages: number; counts: Record<string, Record<string, number>> };

async function api(url: string, init?: RequestInit): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  try {
    const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.status === 401) window.location.href = "/admin/login";
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: { error: "Could not reach the server." } };
  }
}

function errorText(data: Record<string, unknown>) {
  const details = Array.isArray(data.details) ? (data.details as { path: string; message: string }[]).map((d) => `${d.path}: ${d.message}`).join(" · ") : "";
  return `${String(data.error ?? "Something went wrong.")}${details ? ` (${details})` : ""}`;
}

function fmt(item: Item, col: ResourceConfig["columns"][number]) {
  const v = item[col.name];
  if (col.format === "bool") return v ? "Yes" : "No";
  if (col.format === "date" && v) return new Date(String(v)).toLocaleDateString();
  if (col.format === "consult") return CONSULT_LABELS[String(v)] ?? String(v ?? "");
  if (col.format === "image") return v ? <span className="relative block size-12 overflow-hidden rounded-lg bg-sage-100"><Image src={String(v)} alt="" fill sizes="48px" className="object-cover" /></span> : "—";
  return String(v ?? "");
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#fdf3dc] text-[#7a5a12]", new: "bg-[#fdf3dc] text-[#7a5a12]",
  contacted: "bg-sage-100 text-forest-800", read: "bg-sage-100 text-forest-800",
  confirmed: "bg-forest-800 text-paper", replied: "bg-forest-800 text-paper", completed: "bg-forest-700 text-paper",
  cancelled: "bg-[#fbeeea] text-[#7a2a1c]", archived: "bg-beige-200 text-ink-soft",
};

export function ResourceManager({ config, canWrite, canDelete }: { config: ResourceConfig; canWrite: boolean; canDelete: boolean }) {
  const [list, setList] = useState<ListResponse | null>(null);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [busyReorder, setBusyReorder] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const p = new URLSearchParams({ page: String(page) });
    if (query) p.set("q", query);
    for (const [k, v] of Object.entries(filters)) if (v) p.set(k, v);
    const { ok, data } = await api(`/api/admin/${config.key}?${p}`);
    if (ok) { setList(data as unknown as ListResponse); setLoadError(""); }
    else setLoadError(errorText(data));
  }, [config.key, page, query, filters]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => { setPage(1); setQuery(q.trim()); }, 300);
    return () => clearTimeout(debounce.current);
  }, [q]);

  async function save(values: Record<string, unknown>) {
    const isNew = editing === "new";
    // Send only editable form fields; read-only records (e.g. original migrated text) are left untouched on the server.
    const payload = Object.fromEntries(config.fields.map((f) => [f.name, values[f.name]]));
    const { ok, data } = await api(isNew ? `/api/admin/${config.key}` : `/api/admin/${config.key}/${(editing as Item)._id}`, { method: isNew ? "POST" : "PUT", body: JSON.stringify(payload) });
    if (!ok) return errorText(data);
    await load();
    setEditing(null);
    return null;
  }

  async function remove(item: Item) {
    const label = String(item[config.titleField] ?? config.singular);
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    const { ok, data } = await api(`/api/admin/${config.key}/${item._id}`, { method: "DELETE" });
    if (!ok) window.alert(errorText(data));
    else await load();
  }

  async function move(index: number, dir: -1 | 1) {
    if (!list) return;
    const items = [...list.items];
    [items[index], items[index + dir]] = [items[index + dir], items[index]];
    setList({ ...list, items });
    setBusyReorder(true);
    const { ok, data } = await api(`/api/admin/${config.key}`, { method: "PATCH", body: JSON.stringify({ ids: items.map((i) => i._id) }) });
    setBusyReorder(false);
    if (!ok) window.alert(errorText(data));
    await load();
  }

  if (editing) {
    const initial = editing === "new" ? config.defaults : { ...config.defaults, ...editing, ...(config.key === "users" ? { password: "" } : {}) };
    const info = editing !== "new" && config.readOnlyInfo
      ? config.readOnlyInfo.map((i) => {
          const raw = editing[i.name];
          let value: string;
          if (i.name === "createdAt") value = new Date(String(raw)).toLocaleString();
          else if (i.name === "consultationType") value = CONSULT_LABELS[String(raw)] ?? "";
          else if (i.name === "statusHistory" && Array.isArray(raw)) value = (raw as { status: string; at: string; by?: string }[]).map((h) => `${new Date(h.at).toLocaleString()} · ${h.status}${h.by ? ` · ${h.by}` : ""}`).join("\n");
          else value = String(raw ?? "");
          return { label: i.label, value };
        })
      : undefined;
    return (
      <div className="max-w-3xl">
        <h2 className="mb-6 font-serif text-2xl">{editing === "new" ? `New ${config.singular}` : `Edit ${config.singular}`}</h2>
        <AdminForm fields={config.fields} initial={initial} onSubmit={save} onCancel={() => setEditing(null)} readOnlyInfo={info} submitLabel={editing === "new" ? "Create" : "Save changes"} />
      </div>
    );
  }

  const filtersActive = !!query || Object.values(filters).some(Boolean);
  const canReorder = !!config.reorderable && canWrite && !filtersActive && (list?.pages ?? 1) === 1;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {config.description && <p className="max-w-2xl text-sm text-ink-soft">{config.description}</p>}
        {config.canCreate && canWrite && (
          <button type="button" onClick={() => setEditing("new")} className="btn btn-primary !py-3"><Plus className="size-4" aria-hidden="true" /> Add {config.singular}</button>
        )}
      </div>

      {(config.searchable || config.filterChips?.length) && (
        <div className="mb-5 space-y-3">
          {config.searchable && (
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
              <label htmlFor={`search-${config.key}`} className="sr-only">Search {config.title}</label>
              <input id={`search-${config.key}`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={config.searchPlaceholder ?? "Search"} className="field !rounded-full !pl-11" />
            </div>
          )}
          {config.filterChips?.map((fc) => (
            <div key={fc.field} role="group" aria-label={`Filter by ${fc.label}`} className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">{fc.label}</span>
              {[{ value: "", label: "All" }, ...fc.options].map((o) => {
                const active = (filters[fc.field] ?? "") === o.value;
                const n = o.value ? list?.counts?.[fc.field]?.[o.value] ?? 0 : list?.total;
                return (
                  <button key={o.value || "all"} type="button" aria-pressed={active}
                    onClick={() => { setPage(1); setFilters((f) => ({ ...f, [fc.field]: o.value })); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-forest-800 text-paper" : "bg-white text-forest-800 ring-1 ring-sage-200 hover:bg-sage-50"}`}>
                    {o.label}{o.value && n !== undefined ? ` (${n})` : ""}
                  </button>
                );
              })}
            </div>
          ))}
          {filtersActive && (
            <button type="button" onClick={() => { setQ(""); setQuery(""); setFilters({}); setPage(1); }} className="inline-flex items-center gap-1 text-xs text-ink-soft underline">
              <X className="size-3" aria-hidden="true" /> Clear search and filters
            </button>
          )}
        </div>
      )}

      {loadError ? (
        <p role="alert" className="rounded-xl border border-[#d9a99f] bg-[#fbeeea] p-4 text-sm text-[#6b2a1e]">{loadError}</p>
      ) : list === null ? (
        <p className="flex items-center gap-2 text-ink-soft"><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading…</p>
      ) : list.items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-sage-300 bg-sage-50 p-10 text-center text-ink-soft">{filtersActive ? "No records match your search or filters." : "Nothing here yet."}</p>
      ) : (
        <>
          <p className="mb-2 text-xs text-ink-soft" role="status">{list.total} record{list.total === 1 ? "" : "s"}{busyReorder ? " · saving order…" : ""}{config.reorderable && !canReorder && canWrite ? " · clear filters to reorder" : ""}</p>
          <div className="overflow-x-auto rounded-2xl border border-sage-200 bg-white">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="bg-sage-50 text-xs uppercase tracking-wider text-ink-soft">
                <tr>
                  {canReorder && <th scope="col" className="w-20 px-3 py-3"><span className="sr-only">Order</span></th>}
                  <th scope="col" className="px-4 py-3">Name</th>
                  {config.columns.map((c) => <th key={c.name} scope="col" className="px-4 py-3">{c.label}</th>)}
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {list.items.map((item, i) => (
                  <tr key={item._id} className="hover:bg-sage-50/60">
                    {canReorder && (
                      <td className="whitespace-nowrap px-3 py-3">
                        <button type="button" disabled={i === 0 || busyReorder} onClick={() => move(i, -1)} aria-label={`Move ${String(item[config.titleField] ?? "")} up`} className="grid size-8 place-items-center rounded-full hover:bg-sage-100 disabled:opacity-30"><ArrowUp className="size-4" /></button>
                        <button type="button" disabled={i === list.items.length - 1 || busyReorder} onClick={() => move(i, 1)} aria-label={`Move ${String(item[config.titleField] ?? "")} down`} className="grid size-8 place-items-center rounded-full hover:bg-sage-100 disabled:opacity-30"><ArrowDown className="size-4" /></button>
                      </td>
                    )}
                    <td className="max-w-[18rem] truncate px-4 py-3 font-medium text-forest-800">{String(item[config.titleField] ?? "")}</td>
                    {config.columns.map((c) => (
                      <td key={c.name} className="px-4 py-3 text-ink-soft">
                        {c.name === "status" ? <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[String(item.status)] ?? "bg-sage-100"}`}>{String(item.status ?? "")}</span> : fmt(item, c)}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button type="button" onClick={() => setEditing(item)} className="mr-3 font-semibold text-forest-700 underline underline-offset-4">{canWrite ? "Open" : "View"}</button>
                      {canDelete && <button type="button" onClick={() => remove(item)} aria-label={`Delete ${String(item[config.titleField] ?? "")}`} className="inline-grid size-8 place-items-center rounded-full text-[#9a3322] hover:bg-[#fbeeea]"><Trash2 className="size-4" aria-hidden="true" /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {list.pages > 1 && (
            <nav aria-label="Pages" className="mt-4 flex items-center gap-3 text-sm">
              <button type="button" disabled={list.page <= 1} onClick={() => setPage(list.page - 1)} className="btn btn-ghost !px-4 !py-2 disabled:opacity-40">Previous</button>
              <span className="text-ink-soft">Page {list.page} of {list.pages}</span>
              <button type="button" disabled={list.page >= list.pages} onClick={() => setPage(list.page + 1)} className="btn btn-ghost !px-4 !py-2 disabled:opacity-40">Next</button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
