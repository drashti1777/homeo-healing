import Image from "next/image";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    path: "/pay-now",
    title: "Pay Now | Dr. Neeta's Homeo Health Care",
    description: "Scan & Pay for Dr. Neeta's Homeo Health Care using UPI / Paytm QR code.",
  });
}

export default function PayNowPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-28 pb-16 px-4">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-semibold text-accent text-center mb-2">
        Scan &amp; Pay for Dr. Neeta&apos;s Homeo Health Care
      </h1>

      {/* Divider line with icon */}
      <div className="flex items-center gap-2 my-4">
        <div className="h-px w-16 bg-gray-300" />
        <span className="text-sage-500 text-lg">🌿</span>
        <div className="h-px w-16 bg-gray-300" />
      </div>

      {/* UPI ID */}
      <p className="text-base font-medium text-gray-700 mb-6">
        UPI ID:-&nbsp;<span className="font-semibold text-forest-800">7623913175@paytm</span>
      </p>

      {/* QR Code card */}
      <div className="border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center bg-white">
        <Image
          src="/pay/pay-now-qr.webp"
          alt="Paytm QR Code — dr.parmar788@okaxis"
          width={200}
          height={200}
          className="rounded-lg"
          priority
        />
        <p className="text-xs text-gray-500 mt-2">dr.parmar788@okaxis</p>
      </div>

      {/* Doctor info */}
      <div className="mt-6 text-center space-y-1">
        <p className="text-base font-semibold text-forest-800">Dr. Neeta Parmar</p>
        <p className="text-sm text-gray-500">dr.parmar788@gmail.com</p>
        <p className="text-sm text-gray-500">+91 76239 13175</p>
      </div>
    </div>
  );
}
