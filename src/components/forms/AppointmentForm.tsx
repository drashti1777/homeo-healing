"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Copy,
  Check,
  Loader2,
  ArrowRight,
  User,
  Mail,
  Calendar,
  Clock,
  Building2,
  ClipboardList,
  RotateCcw,
  Sparkles,
  Shield,
  MapPin,
  Sun,
  Sunrise,
  Moon,
} from "lucide-react";
import Link from "next/link";
import {
  appointmentSchema,
  BRANCHES,
  BRANCH_LABELS,
  CONSULTATION_TYPES,
  TIME_SLOTS,
  type AppointmentInput,
} from "@/lib/validators";
import { ErrorBanner, SuccessPanel } from "./FormBits";

type FormValues = Omit<AppointmentInput, "consent"> & { consent: boolean };

export function AppointmentForm({
  defaultBranch = "bhavnagar",
}: {
  defaultBranch?: (typeof BRANCHES)[number];
}) {
  const [result, setResult] = useState<{ reference: string; duplicate: boolean } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inFlight = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: {
      branch: defaultBranch,
      consultationType: "in-clinic",
      preferredTime: "Morning",
      message: "",
      website: "",
    },
  });

  const selectedBranch = watch("branch") || defaultBranch;
  const selectedType = watch("consultationType") || "in-clinic";
  const selectedTime = watch("preferredTime") || "Morning";

  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const { onChange: phoneOnChange, ...phoneRegister } = register("phone");

  if (result) {
    return (
      <div className="rounded-3xl bg-white p-7 sm:p-10 shadow-xl shadow-forest-950/5 border border-forest-800/10 animate-in fade-in-50 duration-300">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Check className="size-6 stroke-[3]" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-500/20">
              Request Received
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">
              Appointment Request Submitted
            </h2>
          </div>
        </div>

        <div className="mt-7 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-sand-50/60 to-sage-50/70 p-6 sm:p-7 border border-emerald-500/20">
          <p className="text-xs uppercase font-bold tracking-wider text-forest-800 flex items-center gap-1.5">
            <Shield className="size-4 text-emerald-600" />
            Your Reference Number
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-forest-950">
              {result.reference}
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(result.reference);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  /* unsupported */
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-forest-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-600 active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-300" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden="true" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-ink-soft">
            Please quote this reference number if you contact the clinic about your request.
          </p>
        </div>

        {result.duplicate && (
          <div className="mt-4 rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs sm:text-sm text-amber-900">
            We already had a request from you for this date, so we have kept your existing slot active.
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-sand-50/70 p-5 border border-forest-900/10 text-xs sm:text-sm text-ink-soft space-y-2">
          <p className="font-semibold text-forest-950">What happens next?</p>
          <p>
            This is an <strong>appointment request, not a confirmed booking</strong>. The clinic will
            contact you by phone or email to agree a time and confirm your appointment.
          </p>
          <p className="text-xs text-ink-soft/80">
            If your concern is urgent, please contact your doctor or local emergency services rather
            than waiting for a reply.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              reset();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-forest-800/20 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-forest-900 transition-colors hover:bg-sage-50 cursor-pointer"
          >
            <RotateCcw className="size-4" />
            Book another appointment
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-600"
          >
            Back to home
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setServerError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as {
        reference?: string;
        duplicate?: boolean;
        error?: string;
      } | null;
      if (res.ok && data?.reference) {
        setResult({ reference: data.reference, duplicate: !!data.duplicate });
      } else {
        setServerError(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("We could not reach the server. Check your connection and try again.");
    } finally {
      inFlight.current = false;
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6" aria-label="Appointment request">
      {serverError && <ErrorBanner message={serverError} />}

      {/* 1. Branch Selector (Interactive Location Cards) */}
      <div>
        <label className="label mb-2 flex items-center justify-between">
          <span className="text-forest-950 font-bold">1. Select Preferred Branch</span>
          <span className="text-xs font-normal text-ink-soft">Choose clinic location</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BRANCHES.map((b) => {
            const isChecked = selectedBranch === b;
            return (
              <label
                key={b}
                className={`relative flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${isChecked
                  ? "border-forest-700 bg-forest-950 text-white shadow-md ring-2 ring-forest-700/20"
                  : "border-sage-200 bg-white hover:border-forest-600/40 hover:bg-sand-50/40 text-forest-950"
                  }`}
              >
                <input
                  type="radio"
                  value={b}
                  className="sr-only"
                  {...register("branch")}
                />
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${isChecked ? "bg-emerald-500 text-forest-950" : "bg-sage-100 text-forest-800"
                    }`}
                >
                  <MapPin className="size-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isChecked ? "text-white" : "text-forest-950"}`}>
                    {b === "bhavnagar" ? "Bhavnagar Clinic" : "Ahmedabad Branch"}
                  </p>
                  <p className={`text-xs truncate ${isChecked ? "text-white/70" : "text-ink-soft"}`}>
                    {b === "bhavnagar" ? "Shastrinagar • Main Clinic" : "4D Square • Motera"}
                  </p>
                </div>
                <div
                  className={`size-4 rounded-full border flex items-center justify-center ${isChecked ? "border-emerald-400 bg-emerald-400" : "border-sage-300 bg-white"
                    }`}
                >
                  {isChecked && <div className="size-1.5 rounded-full bg-forest-950" />}
                </div>
              </label>
            );
          })}
        </div>
        {errors.branch && <p role="alert" className="field-error">{errors.branch.message}</p>}
      </div>

      {/* 2. Patient Information (Clean 2-Column Grid) */}
      <div className="space-y-4 pt-1">
        <label className="label mb-0 text-forest-950 font-bold">2. Patient Details</label>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Patient Name */}
          <div>
            <label htmlFor="name" className="text-xs font-semibold text-ink-soft mb-1.5 block">
              Patient name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="name"
                className="field pl-9.5 text-sm"
                placeholder="Enter full name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft/50 pointer-events-none" />
            </div>
            {errors.name && <p role="alert" className="field-error">{errors.name.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="text-xs font-semibold text-ink-soft mb-1.5 block">
              Phone number <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center rounded-xl border bg-white transition-[border-color,box-shadow] focus-within:border-forest-600 focus-within:ring-4 focus-within:ring-forest-600/15 ${errors.phone ? "!border-[#b4412f]" : "border-sage-200"
                }`}
            >
              <span className="flex select-none items-center rounded-l-xl border-r border-sage-200 bg-sage-50/70 px-3 py-[0.8rem] text-sm font-semibold text-forest-900">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit mobile"
                autoComplete="tel-national"
                className="w-full bg-transparent px-3 py-[0.8rem] text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none"
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
            {errors.phone && <p role="alert" className="field-error">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="text-xs font-semibold text-ink-soft mb-1.5 block">
            Email address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className="field pl-9.5 text-sm"
              placeholder="e.g. patient@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft/50 pointer-events-none" />
          </div>
          {errors.email && <p role="alert" className="field-error">{errors.email.message}</p>}
        </div>
      </div>

      {/* 3. Consultation Mode & Timings */}
      <div className="space-y-4 pt-1">
        <label className="label mb-0 text-forest-950 font-bold">3. Consultation Type & Schedule</label>

        {/* Consultation Mode Interactive Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONSULTATION_TYPES.filter((t) => t !== "online").map((t) => {
            const isChecked = selectedType === t;
            return (
              <label
                key={t}
                className={`relative flex items-center justify-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                  isChecked
                    ? "border-emerald-600 bg-emerald-50 text-forest-950 font-bold ring-1 ring-emerald-500/30"
                    : "border-sage-200 bg-white hover:border-sage-300 text-ink-soft hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  value={t}
                  className="sr-only"
                  {...register("consultationType")}
                />
                {t === "in-clinic" && <Building2 className={`size-4 ${isChecked ? "text-emerald-700" : "text-ink-soft"}`} />}
                {t === "follow-up" && <ClipboardList className={`size-4 ${isChecked ? "text-emerald-700" : "text-ink-soft"}`} />}
                <span>{t === "in-clinic" ? "In-Clinic Consultation" : "Follow-Up Consultation"}</span>
              </label>
            );
          })}
        </div>
        {errors.consultationType && <p role="alert" className="field-error">{errors.consultationType.message}</p>}

        {/* Date & Time Slot Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Preferred Date */}
          <div>
            <label htmlFor="preferredDate" className="text-xs font-semibold text-ink-soft mb-1.5 block">
              Preferred date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="preferredDate"
                type="date"
                min={today}
                className="field pl-9.5 text-sm"
                aria-invalid={!!errors.preferredDate}
                {...register("preferredDate")}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft/50 pointer-events-none" />
            </div>
            {errors.preferredDate && <p role="alert" className="field-error">{errors.preferredDate.message}</p>}
          </div>

          {/* Preferred Time Slots (Chips) */}
          <div>
            <label className="text-xs font-semibold text-ink-soft mb-1.5 block">
              Preferred time of day <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isChecked = selectedTime === slot;
                return (
                  <label
                    key={slot}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border cursor-pointer text-center transition-all ${isChecked
                      ? "border-forest-800 bg-forest-900 text-white font-bold"
                      : "border-sage-200 bg-white hover:border-sage-300 text-ink-soft hover:text-ink text-xs"
                      }`}
                  >
                    <input
                      type="radio"
                      value={slot}
                      className="sr-only"
                      {...register("preferredTime")}
                    />
                    {slot === "Morning" && <Sunrise className="size-3.5 mb-0.5 opacity-80" />}
                    {slot === "Afternoon" && <Sun className="size-3.5 mb-0.5 opacity-80" />}
                    {slot === "Evening" && <Moon className="size-3.5 mb-0.5 opacity-80" />}
                    <span className="text-[11px] leading-tight">{slot}</span>
                  </label>
                );
              })}
            </div>
            {errors.preferredTime && <p role="alert" className="field-error">{errors.preferredTime.message}</p>}
          </div>
        </div>
      </div>

      {/* 4. Health Concern Note (Optional) */}
      <div>
        <label htmlFor="message" className="label mb-1.5 flex items-center justify-between">
          <span className="text-forest-950 font-bold">4. Message (optional)</span>
          <span className="text-xs font-normal text-ink-soft">Symptoms or health history</span>
        </label>
        <textarea
          id="message"
          rows={3}
          className="field text-sm resize-y"
          placeholder="Briefly tell us what you would like to discuss. Please do not include detailed medical records."
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && <p role="alert" className="field-error">{errors.message.message}</p>}
      </div>

      {/* Honeypot hidden input */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      {/* 5. Privacy Consent Checkbox */}
      <div className="rounded-xl bg-sand-50/70 p-3.5 border border-forest-900/10">
        <label className="flex items-start gap-3 text-xs sm:text-sm text-ink-soft cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded accent-forest-700 cursor-pointer"
            aria-invalid={!!errors.consent}
            {...register("consent")}
          />
          <span className="leading-relaxed">
            I agree that Dr. Neeta&apos;s Homeo Health Care may store these details and use them to
            contact me about this request, as described in the{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-forest-800 hover:text-emerald-700 underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="field-error mt-1.5">
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* 6. Action Button */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-forest-900 px-9 py-4 text-sm sm:text-base font-semibold text-white shadow-xl shadow-forest-900/20 transition-all duration-200 hover:bg-emerald-500 hover:text-forest-950 hover:shadow-emerald-500/25 active:bg-emerald-600 active:text-forest-950 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
        >
          {isSubmitting && (
            <Loader2
              className="size-4 animate-spin text-white group-hover:text-forest-950"
              aria-hidden="true"
            />
          )}
          <span>{isSubmitting ? "Sending request…" : "Send appointment request"}</span>
          {!isSubmitting && (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          )}
        </button>

        <p className="mt-3 text-xs text-ink-soft">
          Submitting this form does not book an appointment. The clinic will contact you to confirm a time.
        </p>
      </div>
    </form>
  );
}
