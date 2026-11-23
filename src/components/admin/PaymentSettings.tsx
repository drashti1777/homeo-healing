"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle2, Circle, Loader2 } from "lucide-react";

type P = { enabled: boolean; provider: string; upiId: string; merchantVerified: boolean; amountAndPurposeVerified: boolean; callbacksVerified: boolean; notes: string };
const EMPTY: P = { enabled: false, provider: "", upiId: "", merchantVerified: false, amountAndPurposeVerified: false, callbacksVerified: false, notes: "" };

export function PaymentSettings() {
  const [p, setP] = useState<P | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/payment").then(async (r) => {
      const d = (await r.json()) as { item?: Partial<P>; error?: string };
      if (r.ok) setP({ ...EMPTY, ...d.item });
      else setMsg({ ok: false, text: d.error ?? "Could not load" });
    });
  }, []);
  if (!p) return msg ? <p role="alert" className="text-sm text-[#6b2a1e]">{msg.text}</p> : <p className="flex items-center gap-2 text-ink-soft"><Loader2 className="size-4 animate-spin" /> Loading…</p>;

  const checks = [
    { key: "provider", label: "Actual payment gateway / provider identified", done: !!p.provider },
    { key: "merchantVerified", label: "Authorised merchant account confirmed by the clinic owner", done: p.merchantVerified },
    { key: "amountAndPurposeVerified", label: "Payment amount and purpose agreed (e.g. consultation fee)", done: p.amountAndPurposeVerified },
    { key: "callbacksVerified", label: "Successful and failed payment callbacks tested", done: p.callbacksVerified },
  ];
  const ready = checks.every((c) => c.done);
  const set = <K extends keyof P>(k: K, v: P[K]) => { setP({ ...p, [k]: v, ...(k !== "enabled" && !v ? { enabled: false } : {}) }); setMsg(null); };

  async function save() {
    setBusy(true);
    const r = await fetch("/api/admin/payment", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    const d = (await r.json().catch(() => ({}))) as { error?: string; details?: { message: string }[] };
    setBusy(false);
    setMsg(r.ok ? { ok: true, text: "Saved." } : { ok: false, text: `${d.error ?? "Could not save"} ${d.details?.map((x) => x.message).join(" ") ?? ""}` });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex gap-4 rounded-2xl border border-[#e6cf9a] bg-[#fdf6e3] p-5 text-sm text-[#5b4512]">
        <Ban className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">Online payment is disabled.</p>
          <p className="mt-1">The previous website&apos;s Pay Now page showed only a static Paytm UPI QR image (UPI ID <strong>7623913175@paytm</strong>). It had no payment gateway, merchant account, amount, order reference or success/failure handling. No payment button is shown on the website until every check below is complete. Gateway API keys must be stored in server environment variables, never here.</p>
        </div>
      </div>

      <ul className="space-y-2">
        {checks.map((c) => (
          <li key={c.key} className="flex items-center gap-3 text-sm">
            {c.done ? <CheckCircle2 className="size-5 text-forest-600" aria-hidden="true" /> : <Circle className="size-5 text-ink-soft" aria-hidden="true" />}
            <span className={c.done ? "text-forest-800" : "text-ink-soft"}>{c.label}</span>
          </li>
        ))}
      </ul>

      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="pay-provider" className="label">Provider</label><input id="pay-provider" className="field" value={p.provider} onChange={(e) => set("provider", e.target.value)} placeholder="e.g. Razorpay, Paytm Business" /></div>
        <div><label htmlFor="pay-upi" className="label">UPI ID (from previous site)</label><input id="pay-upi" className="field" value={p.upiId} onChange={(e) => set("upiId", e.target.value)} /></div>
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-3 text-sm font-medium text-forest-800"><input type="checkbox" className="size-4 accent-forest-700" checked={p.merchantVerified} onChange={(e) => set("merchantVerified", e.target.checked)} /> Merchant account verified</label>
        <label className="flex items-center gap-3 text-sm font-medium text-forest-800"><input type="checkbox" className="size-4 accent-forest-700" checked={p.amountAndPurposeVerified} onChange={(e) => set("amountAndPurposeVerified", e.target.checked)} /> Amount and purpose verified</label>
        <label className="flex items-center gap-3 text-sm font-medium text-forest-800"><input type="checkbox" className="size-4 accent-forest-700" checked={p.callbacksVerified} onChange={(e) => set("callbacksVerified", e.target.checked)} /> Success and failure callbacks verified</label>
      </div>
      <div><label htmlFor="pay-notes" className="label">Verification notes</label><textarea id="pay-notes" rows={5} className="field resize-y" value={p.notes} onChange={(e) => set("notes", e.target.value)} /></div>

      <label className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${ready ? "border-forest-600 text-forest-800" : "border-sage-200 text-ink-soft"}`}>
        <input type="checkbox" className="size-4 accent-forest-700" disabled={!ready} checked={p.enabled} onChange={(e) => set("enabled", e.target.checked)} />
        Enable payments {!ready && <span className="font-normal">(complete all checks first)</span>}
      </label>
      <p className="text-xs text-ink-soft">Enabling this flag records that the integration is approved. A developer still needs to connect the verified gateway; no payment UI exists on the website yet.</p>

      {msg && <p role={msg.ok ? "status" : "alert"} className={`rounded-xl p-3 text-sm ${msg.ok ? "bg-sage-100 text-forest-800" : "border border-[#d9a99f] bg-[#fbeeea] text-[#6b2a1e]"}`}>{msg.text}</p>}
      <button type="button" onClick={save} disabled={busy} className="btn btn-primary">{busy && <Loader2 className="size-4 animate-spin" />} Save</button>
    </div>
  );
}
