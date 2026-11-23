"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { appointmentSchema, BRANCHES, BRANCH_LABELS, CONSULTATION_LABELS, CONSULTATION_TYPES, TIME_SLOTS, type AppointmentInput } from "@/lib/validators";
import { ErrorBanner, Field, SuccessPanel } from "./FormBits";

type FormValues = Omit<AppointmentInput, "consent"> & { consent: boolean };

export function AppointmentForm({ defaultBranch = "bhavnagar" }: { defaultBranch?: (typeof BRANCHES)[number] }) {
  const [result, setResult] = useState<{ reference: string; duplicate: boolean } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inFlight = useRef(false);
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: { branch: defaultBranch, consultationType: "in-clinic", message: "", website: "" },
  });
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const { onChange: phoneOnChange, ...phoneRegister } = register("phone");

  if (result) {
    return (
      <SuccessPanel title="Your request has been received">
        <div className="rounded-2xl bg-paper p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">Your reference number</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <p className="font-mono text-2xl font-semibold tracking-wider text-forest-800">{result.reference}</p>
            <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(result.reference); setCopied(true); } catch { /* unsupported */ } }} className="inline-flex items-center gap-1 text-xs text-forest-700 underline">
              <Copy className="size-3.5" aria-hidden="true" /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-sm">Please quote this number if you contact the clinic about your request.</p>
        </div>
        {result.duplicate && <p>We already had a request from you for this date, so we have not created a second one.</p>}
        <p>This is an <strong>appointment request, not a confirmed booking</strong>. The clinic will contact you by phone or email to agree a time and confirm your appointment.</p>
        <p>If your concern is urgent, please contact your doctor or local emergency services rather than waiting for a reply.</p>
        <Link href="/" className="btn btn-ghost mt-2">Back to home</Link>
      </SuccessPanel>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    if (inFlight.current) return; // guards against double-click / double-submit
    inFlight.current = true;
    setServerError(null);
    try {
      const res = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = (await res.json().catch(() => null)) as { reference?: string; duplicate?: boolean; error?: string } | null;
      if (res.ok && data?.reference) setResult({ reference: data.reference, duplicate: !!data.duplicate });
      else setServerError(data?.error ?? "Something went wrong. Please try again.");
    } catch {
      setServerError("We could not reach the server. Check your connection and try again.");
    } finally {
      inFlight.current = false;
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6" aria-label="Appointment request">
      {serverError && <ErrorBanner message={serverError} />}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Patient name" htmlFor="name" error={errors.name}>
          <input id="name" className="field" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Phone number" htmlFor="phone" error={errors.phone}>
          <div
            className={`flex items-center rounded-xl border bg-white transition-[border-color,box-shadow] focus-within:border-forest-600 focus-within:ring-4 focus-within:ring-forest-600/15 ${
              errors.phone ? "!border-[#b4412f]" : "border-sage-200"
            }`}
          >
            <span className="flex select-none items-center rounded-l-xl border-r border-sage-200 bg-sage-50/60 px-3.5 py-[0.8rem] text-[0.95rem] font-medium text-forest-800">
              +91
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="Enter 10-digit number"
              autoComplete="tel-national"
              className="w-full bg-transparent px-3 py-[0.8rem] text-[0.95rem] text-ink placeholder:text-ink-soft/50 focus:outline-none"
              aria-invalid={!!errors.phone}
              {...phoneRegister}
              onKeyDown={(e) => {
                if (
                  [
                    "Backspace",
                    "Delete",
                    "Tab",
                    "Escape",
                    "Enter",
                    "ArrowLeft",
                    "ArrowRight",
                    "Home",
                    "End",
                  ].includes(e.key) ||
                  e.ctrlKey ||
                  e.metaKey
                ) {
                  return;
                }
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 10 && val.startsWith("91")) {
                  val = val.slice(2);
                }
                e.target.value = val.slice(0, 10);
                phoneOnChange(e);
              }}
            />
          </div>
        </Field>
      </div>
      <Field label="Email address" htmlFor="email" error={errors.email}>
        <input id="email" type="email" className="field" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <fieldset>
        <legend className="label">Preferred branch</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {BRANCHES.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-3 rounded-xl border border-sage-200 bg-white p-4 text-sm font-medium text-forest-800 has-[:checked]:border-forest-600 has-[:checked]:bg-sage-50 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-forest-600/20">
              <input type="radio" value={b} className="size-4 accent-forest-700" {...register("branch")} />
              {BRANCH_LABELS[b]}
            </label>
          ))}
        </div>
        {errors.branch && <p role="alert" className="field-error">{errors.branch.message}</p>}
      </fieldset>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Preferred date" htmlFor="preferredDate" error={errors.preferredDate}>
          <input id="preferredDate" type="date" min={today} className="field" aria-invalid={!!errors.preferredDate} {...register("preferredDate")} />
        </Field>
        <Field label="Preferred time" htmlFor="preferredTime" error={errors.preferredTime}>
          <select id="preferredTime" className="field" defaultValue="" aria-invalid={!!errors.preferredTime} {...register("preferredTime")}>
            <option value="" disabled>Select a time of day</option>
            {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Consultation type" htmlFor="consultationType" error={errors.consultationType}>
        <select id="consultationType" className="field" aria-invalid={!!errors.consultationType} {...register("consultationType")}>
          {CONSULTATION_TYPES.map((t) => <option key={t} value={t}>{CONSULTATION_LABELS[t]}</option>)}
        </select>
      </Field>
      <Field label="Message (optional)" htmlFor="message" error={errors.message} hint="Briefly tell us what you would like to discuss. Please do not include detailed medical records.">
        <textarea id="message" rows={4} className="field resize-y" aria-invalid={!!errors.message} {...register("message")} />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this field empty<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" className="mt-1 size-4 accent-forest-700" aria-invalid={!!errors.consent} {...register("consent")} />
          <span>
            I agree that Dr. Neeta&apos;s Homeo Health Care may store these details and use them to contact me about this request, as described in the{" "}
            <Link href="/privacy-policy" className="font-medium text-forest-700 underline underline-offset-4">Privacy Policy</Link>.
          </span>
        </label>
        {errors.consent && <p role="alert" className="field-error">{errors.consent.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full sm:w-auto">
        {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Sending request…" : "Send appointment request"}
      </button>
      <p className="text-xs text-ink-soft">Submitting this form does not book an appointment. The clinic will contact you to confirm a time.</p>
    </form>
  );
}
