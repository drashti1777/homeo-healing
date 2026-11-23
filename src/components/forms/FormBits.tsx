import type { FieldError } from "react-hook-form";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function Field({ label, error, htmlFor, hint, children }: { label: string; error?: FieldError; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
      {error && <p id={`${htmlFor}-err`} role="alert" className="field-error">{error.message}</p>}
    </div>
  );
}

export function SuccessPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="status" className="rounded-3xl border border-sage-300 bg-sage-50 p-8 md:p-10">
      <CheckCircle2 className="size-9 text-forest-600" aria-hidden="true" />
      <h2 className="mt-4 text-3xl font-normal">{title}</h2>
      <div className="mt-3 space-y-3 text-ink-soft">{children}</div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-[#d9a99f] bg-[#fbeeea] p-4 text-sm text-[#6b2a1e]">
      <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

/** Posts JSON and returns a friendly error string or null on success. */
export async function postJson(url: string, body: unknown): Promise<string | null> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) return null;
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return data?.error ?? "Something went wrong. Please try again.";
  } catch {
    return "We could not reach the server. Check your connection and try again.";
  }
}
