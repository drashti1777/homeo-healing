"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { ErrorBanner, Field, SuccessPanel, postJson } from "./FormBits";

type FormValues = Omit<ContactInput, "consent"> & { consent: boolean };

/** Fields match the previous website's form: Full Name, E-mail Address, Phone No, Message, plus privacy consent. */
export function ContactForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema) as any,
    defaultValues: { name: "", email: "", phone: "", message: "", branch: "either", subject: "", website: "" },
  });

  if (done) {
    return (
      <SuccessPanel title="Your message was sent successfully">
        <p>Thank you for getting in touch. The clinic will reply using the email address or phone number you provided.</p>
        <p>For urgent medical concerns, please contact your doctor or local emergency services.</p>
      </SuccessPanel>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const error = await postJson("/api/contact", values);
    if (error) setServerError(error);
    else setDone(true);
  });

  const { onChange: phoneOnChange, ...phoneRegister } = register("phone");

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6" aria-label="Contact enquiry">
      {serverError && <ErrorBanner message={serverError} />}
      <Field label="Full name" htmlFor="c-name" error={errors.name}>
        <input id="c-name" className="field" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-err" : undefined} {...register("name")} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email address" htmlFor="c-email" error={errors.email}>
          <input id="c-email" type="email" className="field" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} {...register("email")} />
        </Field>
        <Field label="Phone number" htmlFor="c-phone" error={errors.phone}>
          <div
            className={`flex items-center rounded-xl border bg-white transition-[border-color,box-shadow] focus-within:border-forest-600 focus-within:ring-4 focus-within:ring-forest-600/15 ${
              errors.phone ? "!border-[#b4412f]" : "border-sage-200"
            }`}
          >
            <span className="flex select-none items-center rounded-l-xl border-r border-sage-200 bg-sage-50/60 px-3.5 py-[0.8rem] text-[0.95rem] font-medium text-forest-800">
              +91
            </span>
            <input
              id="c-phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="Enter 10-digit number"
              autoComplete="tel-national"
              className="w-full bg-transparent px-3 py-[0.8rem] text-[0.95rem] text-ink placeholder:text-ink-soft/50 focus:outline-none"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "c-phone-err" : undefined}
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
      <Field label="Message" htmlFor="c-message" error={errors.message} hint="Please do not share detailed medical records here.">
        <textarea id="c-message" rows={6} className="field resize-y" aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-err" : undefined} {...register("message")} />
      </Field>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this field empty<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      </div>
      <div>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" className="mt-1 size-4 accent-forest-700" aria-invalid={!!errors.consent} {...register("consent")} />
          <span>
            I agree that Dr. Neeta&apos;s Homeo Health Care may store these details and use them to reply to me, as described in the{" "}
            <Link href="/privacy-policy" className="font-medium text-forest-700 underline underline-offset-4">Privacy Policy</Link>.
          </span>
        </label>
          {errors.consent && <p role="alert" className="field-error">{errors.consent.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
        {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
