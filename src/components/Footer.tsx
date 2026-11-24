import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS } from "@/content/site";
import type { SettingsDoc } from "@/lib/data";

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
    <footer className="relative overflow-hidden bg-white text-gray-700 border-t border-gray-200">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <Image
          src="/gallery/footer-image.webp"
          alt=""
          fill
          className="object-cover object-center opacity-85"
          sizes="100vw"
        />
      </div>

      <div className="wrap relative z-10 py-12 md:py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_0.8fr_0.8fr_1.4fr] lg:gap-14">

        {/* Column 1: Logo + Address */}
        <div>
          <Link href="/" aria-label={`${settings.clinicName} home`} className="inline-block mb-4">
            <Image src="/logo.webp" alt={settings.clinicName} width={483} height={184} className="h-14 w-auto" />
          </Link>
          <address className="not-italic text-sm leading-relaxed text-gray-600 space-y-2 mt-2">
            {address && (
              <p className="flex gap-2 items-start">
                <span className="text-accent mt-0.5">📍</span>
                <span>{address}</span>
              </p>
            )}
            {otherAddresses.map((a) => (
              <p key={a} className="flex gap-2 items-start">
                <span className="text-accent mt-0.5">📍</span>
                <span>{a}</span>
              </p>
            ))}
            {phone && (
              <p className="flex gap-2 items-center">
                <span className="text-accent">📞</span>
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="hover:text-accent transition-colors">{phone}</a>
              </p>
            )}
            {email && (
              <p className="flex gap-2 items-center">
                <span className="text-accent">✉</span>
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a>
              </p>
            )}
          </address>
        </div>

        {/* Column 2: Categories */}
        <nav aria-label="Categories">
          <h2 className="font-semibold text-forest-800 mb-4 text-sm uppercase tracking-wide">Categories</h2>
          <ul className="space-y-3 text-sm">
            {FOOTER_LINKS.Categories.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Column 3: Links */}
        <nav aria-label="Links">
          <h2 className="font-semibold text-forest-800 mb-4 text-sm uppercase tracking-wide">&nbsp;</h2>
          <ul className="space-y-3 text-sm">
            {FOOTER_LINKS.Links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Column 4: Web Presence */}
        <div>
          <h2 className="font-semibold text-forest-800 mb-4 text-sm uppercase tracking-wide">Web Presence</h2>
          {/* Social icons row */}
          <div className="flex flex-wrap gap-2 mb-3">
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="size-8 rounded-full bg-forest-800 text-white flex items-center justify-center hover:bg-accent transition-colors text-xs font-bold">f</a>
            )}
            {settings.youtubeUrl && (
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="size-8 rounded-full bg-forest-800 text-white flex items-center justify-center hover:bg-accent transition-colors text-xs font-bold">▶</a>
            )}
            <a href="https://wa.me/918160602060" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className="size-8 rounded-full bg-emerald-500 text-forest-950 flex items-center justify-center hover:bg-emerald-400 transition-colors text-xs font-bold">W</a>
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="size-8 rounded-full bg-forest-800 text-white flex items-center justify-center hover:bg-accent transition-colors text-xs font-bold">IG</a>
            )}
          </div>
          {/* Partner logos row (JD, Paytm, Google) */}
          <div className="flex gap-2 items-center mb-4">
            <Image src="/pay/paytm.webp" alt="Paytm" width={56} height={24} className="h-6 w-auto object-contain" />
            <Image src="/pay/googlepay.webp" alt="Google Pay" width={56} height={24} className="h-6 w-auto object-contain" />
          </div>
          {/* QR Code */}
          <div className="inline-block border border-gray-200 rounded-xl p-2.5 bg-white shadow-sm">
            <Image
              src="/pay/footer-qr.webp"
              alt="Scan to pay"
              width={160}
              height={170}
              className="w-36 md:w-40 h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="relative z-10 border-t border-gray-200/80 bg-white/80 backdrop-blur-[2px] py-4 text-xs text-gray-600">
        <div className="wrap text-center">
          Copyright &copy;{new Date().getFullYear()} All rights reserved | Powered By{" "}
          <a href="https://midnightdigital.in" target="_blank" rel="noopener noreferrer" className="text-forest-800 font-medium hover:text-accent hover:underline">
            Midnight Digital Pvt. Ltd.
          </a>
        </div>
      </div>
    </footer>
  );
}
