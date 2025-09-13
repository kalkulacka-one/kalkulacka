import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "../globals.css";

import { EmbedContextProvider, ThemeProvider } from "../../components/client";
import { StructuredData } from "../../components/structured-data";

export const metadata: Metadata = {
  title: {
    default: "Volební kalkulačka — Sněmovní volby 2025",
    template: "%s — Volební kalkulačka",
  },
  description: "Nejužitečnějších 5 minut před sněmovními volbami 2025. Zjistěte, která strana či koalice se nejvíc shoduje s vašimi názory.",
  keywords: [
    "volební kalkulačka",
    "sněmovní volby 2025",
    "volby do sněmovny",
    "politický kompas",
    "volby česká republika",
    "parlamentní volby",
    "politické strany",
    "koalice",
    "volební test",
    "demokracie",
  ],
  authors: [{ name: "Tým Volební kalkulačky" }],
  creator: "Volební kalkulačka",
  publisher: "Volební kalkulačka",
  metadataBase: new URL("https://www.volebnikalkulacka.cz"),
  alternates: {
    canonical: "https://www.volebnikalkulacka.cz",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Volební kalkulačka — Sněmovní volby 2025",
    description: "Nejužitečnějších 5 minut před sněmovními volbami 2025. Zjistěte, která strana či koalice se nejvíc shoduje s vašimi názory.",
    url: "https://www.volebnikalkulacka.cz",
    siteName: "Volební kalkulačka",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Volební kalkulačka - Sněmovní volby 2025",
      },
    ],
    locale: "cs_CZ",
    type: "website",
    countryName: "Czech Republic",
  },
  twitter: {
    card: "summary_large_image",
    site: "@volebnikalkulacka",
    creator: "@volebnikalkulacka",
    title: "Volební kalkulačka — Sněmovní volby 2025",
    description: "Nejužitečnějších 5 minut před sněmovními volbami 2025. Zjistěte, která strana či koalice se nejvíc shoduje s vašimi názory.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  verification: {
    google: "google-site-verification-token-here",
  },
  category: "Politics",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <Script defer data-domain="volebnikalkulacka.cz" src="/js/script.tagged-events.outbound-links.js" />
        <StructuredData />
      </head>
      <body className="min-h-dvh">
        <EmbedContextProvider isEmbed={false} name={null}>
          <ThemeProvider name="default">{children}</ThemeProvider>
        </EmbedContextProvider>
      </body>
    </html>
  );
}
