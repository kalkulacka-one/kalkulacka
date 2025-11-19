import type { Metadata, Viewport } from "next";

import "../globals.css";

import { EmbedContextProvider, ThemeProvider } from "../../components/client";
import { PlausibleScript } from "../../components/server";
import { allowCrawling } from "../../lib/seo";

const baseUrl = process.env.NEXT_PUBLIC_CANONICAL_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Voksmonitor",
    template: "%s — Voksmonitor",
  },
  description: "Voksmonitor 2025 - Hasonlítsd össze az álláspontod a frakciók és a képviselők álláspontjával!",
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
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Fővárosi Közgyűlés Voksmonitor 2025",
    description: "Voksmonitor 2025 - Hasonlítsd össze az álláspontod a frakciók és a képviselők álláspontjával!",
    url: baseUrl,
    siteName: "Voksmonitor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hasonlítsd össze az álláspontod a frakciók és a képviselők álláspontjával!",
      },
    ],
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fővárosi Közgyűlés Voksmonitor 2025",
    description: "Voksmonitor 2025 - Hasonlítsd össze az álláspontod a frakciók és a képviselők álláspontjával!",
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
    <html lang="hu">
      <head>
        <PlausibleScript />
      </head>
      <body className="min-h-dvh bg-gray-50">
        <EmbedContextProvider isEmbed={false}>
          <ThemeProvider name="default">{children}</ThemeProvider>
        </EmbedContextProvider>
      </body>
    </html>
  );
}
