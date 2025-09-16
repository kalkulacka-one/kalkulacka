import type { Metadata, Viewport } from "next";

import "../globals.css";

import { EmbedContextProvider, ThemeProvider } from "../../components/client";
import { PlausibleScript } from "../../components/server";
import { allowCrawling } from "../../lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Volební kalkulačka",
    template: "%s — Volební kalkulačka",
  },
  description: "Nejužitečnějších 5 minut před sněmovními volbami 2025",
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
    title: "Volební kalkulačka",
    description: "Nejužitečnějších 5 minut před sněmovními volbami 2025",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Volební kalkulačka",
    description: "Nejužitečnějších 5 minut před sněmovními volbami 2025",
    images: ["/og-image.png"],
  },
  robots: {
    index: allowCrawling(),
    follow: allowCrawling(),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <PlausibleScript />
      </head>
      <body className="min-h-dvh bg-slate-50">
        <EmbedContextProvider isEmbed={false}>
          <ThemeProvider name="default">{children}</ThemeProvider>
        </EmbedContextProvider>
      </body>
    </html>
  );
}
