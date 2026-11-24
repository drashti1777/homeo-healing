"use client";

import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS } from "@/content/site";
import type { SettingsDoc } from "@/lib/data";
import { Mail, MapPin, Phone, Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export function Footer({ settings }: { settings: SettingsDoc }) {
  const facebookUrl = settings.facebookUrl || "https://www.facebook.com/Dr-Neetss-Homeo-Health-Care-107686881068210";
  const instagramUrl = settings.instagramUrl || "https://www.instagram.com/drneetahomeoheathcare/";
  const phone = settings.phone || "+91 81606 02060";
  const email = settings.email || "drneetahomeohealing@gmail.com";
  const addressLine = settings.addressLine || "2nd Floor, Ratna Plaza Complex, R.T.O, Vithalwadi Road, Above R.K Travels, Opposite Madhav Complex, Shastrinagar";
  const otherAddresses = settings.otherAddresses?.length
    ? settings.otherAddresses
    : ["32_FF, 1st Floor, 4D Square, Opposite IIT Engineering College, Near Visat Petrol Pump, Gandhinagar Highway, Motera, Ahmedabad, Gujarat"];

  const address = [addressLine, settings.city || "Bhavnagar", settings.state || "Gujarat", settings.postalCode || "364001", settings.country || "India"].filter(Boolean).join(", ");

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-white pt-16 sm:pt-24 md:pt-28 pb-6">
      {/* 1. Homeopathy Nature Panoramic Landscape Artwork Background */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <Image
          src="/gallery/homeo-footer-landscape.webp"
          alt="Homeopathy natural botanical landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Soft top blend and deep lower gradient for pristine typography readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-forest-950/75 to-forest-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/90 to-transparent" />
      </div>

      <div className="wrap relative z-10">
        {/* 2. Panoramic Layout with Botanical Branding */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-8 border-b border-white/15">

          {/* Column 1: Brand & Clinics (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Link
              href="/"
              aria-label={`${settings.clinicName} home`}
              className="inline-block rounded-2xl bg-white/95 p-3.5 shadow-xl backdrop-blur-md transition-transform hover:scale-105"
            >
              <Image src="/logo.webp" alt={settings.clinicName} width={483} height={184} className="h-11 sm:h-12 w-auto" />
            </Link>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-md">
              Pure constitutional homeopathic medicine derived from nature. Healing body, mind, and vitality from root cause without side effects.
            </p>

            <address className="not-italic text-xs text-white/85 space-y-2.5 pt-2">
              {address && (
                <div className="flex gap-2.5 items-start">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">📍</span>
                  <span><strong className="text-emerald-300 font-semibold uppercase tracking-wider text-[11px] block">Bhavnagar Clinic:</strong> {address}</span>
                </div>
              )}
              {otherAddresses.map((a, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">📍</span>
                  <span><strong className="text-emerald-300 font-semibold uppercase tracking-wider text-[11px] block">Ahmedabad Clinic:</strong> {a}</span>
                </div>
              ))}
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs">
                {phone && (
                  <p className="flex gap-2 items-center font-bold text-white">
                    <span className="text-emerald-400">📞</span>
                    <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="hover:text-emerald-300 transition-colors">{phone}</a>
                  </p>
                )}
                {email && (
                  <p className="flex gap-2 items-center text-white/80">
                    <span className="text-accent">✉</span>
                    <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a>
                  </p>
                )}
              </div>
            </address>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {FOOTER_LINKS.Links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-emerald-300 transition-colors inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Treatment Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Treatments
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {FOOTER_LINKS.Categories.slice(0, 5).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-emerald-300 transition-colors inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Scan to Pay & Social Channels (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Payment &amp; Connect
            </h4>

            {/* Clean QR Code Card */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md flex items-center gap-3.5 max-w-xs shadow-lg">
              <div className="rounded-xl bg-white p-2 shrink-0 shadow-sm">
                <Image
                  src="/pay/footer-qr.webp"
                  alt="Scan to pay"
                  width={90}
                  height={90}
                  className="size-16 sm:size-18 object-contain rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <span className="inline-block rounded-full bg-emerald-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
                  Instant UPI
                </span>
                <div className="flex gap-1.5 items-center bg-white/95 rounded-lg px-2 py-1 w-fit">
                  <Image src="/pay/paytm.webp" alt="Paytm" width={38} height={14} className="h-3 w-auto object-contain" />
                  <div className="h-2 w-px bg-gray-300" />
                  <Image src="/pay/googlepay.webp" alt="Google Pay" width={38} height={14} className="h-3 w-auto object-contain" />
                </div>
              </div>
            </div>

            {/* Social Icons in Brand Palette */}
            <div className="flex flex-wrap gap-2 pt-1">
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="size-8.5 rounded-full bg-white/15 border border-white/20 text-white flex items-center justify-center hover:bg-emerald-500 hover:text-forest-950 transition-all font-bold text-xs shadow-xs">f</a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  className="size-8.5 rounded-full bg-white/15 border border-white/20 text-white flex items-center justify-center hover:bg-emerald-500 hover:text-forest-950 transition-all font-bold text-xs shadow-xs">▶</a>
              )}
              <a href="https://wa.me/918160602060" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="size-8.5 rounded-full bg-emerald-500 text-forest-950 flex items-center justify-center hover:bg-emerald-400 transition-all font-bold text-xs shadow-md shadow-emerald-500/25">W</a>
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="size-8.5 rounded-full bg-white/15 border border-white/20 text-white flex items-center justify-center hover:bg-accent hover:text-white transition-all font-bold text-[10px] shadow-xs">IG</a>
              )}
            </div>
          </div>
        </div>

        {/* 3. Bottom Panoramic Copyright Bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-white/70 text-center sm:text-left">
          <p>
            Copyright &copy;{new Date().getFullYear()} Dr. Neeta&apos;s Homeo Health Care. All rights reserved.
          </p>
          <p>
            Designed &amp; Powered By{" "}
            <a href="https://midnightdigital.in" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline">
              Midnight Digital Pvt. Ltd.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
