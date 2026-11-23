"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setError(d.error ?? "Could not sign in.");
        setBusy(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-sage-50 p-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-3xl bg-paper p-8 shadow-xl shadow-forest-900/5">
        <div className="flex items-center gap-2 text-forest-800"><Leaf className="size-6" aria-hidden="true" /><span className="font-serif text-2xl">Dr. Neeta's Homeo Health Care</span></div>
        <h1 className="text-xl font-normal">Staff sign in</h1>
        <div><label htmlFor="email" className="label">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="field" /></div>
        <div><label htmlFor="password" className="label">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="field" /></div>
        {error && <p role="alert" className="field-error">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full">{busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />} Sign in</button>
      </form>
    </main>
  );
}
