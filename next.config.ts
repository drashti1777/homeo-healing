import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Keep links to the previous website (drneetahomeohealing.com/*.php) working.
  async redirects() {
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/about.php", destination: "/about", permanent: true },
      { source: "/treatment.php", destination: "/treatments", permanent: true },
      { source: "/faq.php", destination: "/faq", permanent: true },
      { source: "/gallery.php", destination: "/gallery", permanent: true },
      { source: "/contact.php", destination: "/contact", permanent: true },
      // No verified payment integration yet: send old Pay Now links to Contact rather than a payment page.
      { source: "/paynow.php", destination: "/pay-now", permanent: false },
      { source: "/doctor", destination: "/about", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
