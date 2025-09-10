import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "../globals.css";

import { ThemeProvider } from "../../components/client";

export const metadata: Metadata = {
  title: {
    default: "Volební kalkulačka",
    template: "%s — Volební kalkulačka",
  },
  description: "Nejužitečnějších 5 minut před sněmovními volbami 2025",
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
    index: true,
    follow: true,
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
        <Script defer data-domain="volebnikalkulacka.cz" src="/js/script.tagged-events.outbound-links.js" />
      </head>
      <body className="min-h-dvh">
        <ThemeProvider name="default">{children}</ThemeProvider>
      </body>
    </html>
  );
}
