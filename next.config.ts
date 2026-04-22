import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  // Next.js App Router potrzebuje 'unsafe-inline' i 'unsafe-eval' (dev) dla runtime / hydration scripts
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind v4 + JSX inline styles
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://i.pravatar.cc",
  // connect: Vercel insights + Supabase (dynamicznie z env) + Stripe + Resend.
  // Anthropic dzieje się server-side.
  `connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://api.stripe.com https://api.resend.com${
    process.env.NEXT_PUBLIC_SUPABASE_URL
      ? ` ${process.env.NEXT_PUBLIC_SUPABASE_URL} ${process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", "wss://")}`
      : ""
  }`,
  "media-src 'self'",
  "frame-ancestors 'none'",
  // Stripe Checkout uruchamia iframe 3DS / payment methods.
  "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com",
  // script-src już ma 'unsafe-inline' — Stripe.js ładowany z tej domeny.
  // (Gdy migracja na nonce CSP — dopisz https://js.stripe.com do script-src.)
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // credentialless — bardziej elastyczne niż require-corp, działa z Google Fonts (na /api/pdf render).
  { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
];

const apiHeaders = [
  { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

const kreatorHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.pravatar.cc" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: apiHeaders },
      { source: "/kreator/:path*", headers: kreatorHeaders },
      { source: "/kreator", headers: kreatorHeaders },
    ];
  },
};

export default nextConfig;
