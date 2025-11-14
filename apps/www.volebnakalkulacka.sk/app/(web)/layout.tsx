import type { Metadata, Viewport } from "next";

import "../globals.css";

import { appConfig } from "@/app.config";
import { EmbedContextProvider, ThemeProvider } from "@/components/client";
import { PlausibleScript } from "@/components/server";
import { allowCrawling } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: appConfig.metadata.siteName,
    template: `%s — ${appConfig.metadata.siteName}`,
  },
  description: appConfig.metadata.description,
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
    title: appConfig.metadata.siteName,
    description: appConfig.metadata.description,
    url: appConfig.metadata.url,
    siteName: appConfig.metadata.siteName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: appConfig.metadata.ogImage.alt,
      },
    ],
    locale: appConfig.metadata.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.metadata.siteName,
    description: appConfig.metadata.description,
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
    <html lang={appConfig.metadata.language}>
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
