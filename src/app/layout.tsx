import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Syne,
  Manrope,
  Playfair_Display,
  IBM_Plex_Sans,
  Outfit,
  Source_Sans_3,
  Lora,
  Merriweather,
  Roboto_Slab,
  Work_Sans,
  Nunito_Sans,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider } from "@/components/landing/_shared/lenis-provider";
import { CookieConsent } from "@/components/landing/cookie-consent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// ─── CV-only czcionki (wybór użytkownika w kreatorze) ──────────────────────────
const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F1E8" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0E1A" },
  ],
  width: "device-width",
  initialScale: 1,
};

// P1.8: metadataBase preview-aware — w preview deploy OG/canonical wskazuje
// na URL deploya zamiast hardcoded https://agentcv.pl (Slack/X share = działający link).
function getMetadataBase(): URL {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return new URL(fromEnv);
  if (process.env.VERCEL_ENV === "production") return new URL("https://agentcv.pl");
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "agentcv — Twój Agent CV, który pisze CV dostające rozmowy",
    template: "%s | agentcv",
  },
  description:
    "agentcv.pl — agent Pracuś napisze Twoje CV w 5 minut. ATS-friendly, RODO compliant, po polsku. Pierwsze CV za darmo, plany od 19 zł miesięcznie.",
  applicationName: "agentcv",
  keywords: [
    "agentcv",
    "agent CV",
    "kreator CV z AI",
    "CV ATS",
    "CV po polsku",
    "generator CV",
    "CV PDF",
    "dopasowanie CV do ogłoszenia",
    "Pracuś",
  ],
  authors: [{ name: "agentcv", url: "https://agentcv.pl" }],
  creator: "agentcv",
  publisher: "agentcv",
  alternates: {
    canonical: "/",
    languages: {
      "pl-PL": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://agentcv.pl",
    siteName: "agentcv",
    title: "agentcv — Twój Agent CV, który pisze CV dostające rozmowy",
    description:
      "Agent Pracuś napisze Twoje CV w 5 minut. ATS-friendly, po polsku, pierwsze CV gratis.",
    images: [
      {
        url: "/brand/agentcv-og.svg",
        width: 1200,
        height: 630,
        alt: "agentcv — Twój Agent CV",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "agentcv — Twój Agent CV",
    description:
      "Agent Pracuś napisze Twoje CV w 5 minut. ATS-friendly, po polsku, pierwsze CV gratis.",
    images: ["/brand/agentcv-og.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "agentcv",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${manrope.variable} ${playfair.variable} ${ibmPlex.variable} ${outfit.variable} ${sourceSans.variable} ${lora.variable} ${merriweather.variable} ${robotoSlab.variable} ${workSans.variable} ${nunitoSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] bg-background text-foreground font-body antialiased selection:bg-[color:var(--saffron)]/30 selection:text-[color:var(--ink)]">
        <LenisProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </LenisProvider>
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
