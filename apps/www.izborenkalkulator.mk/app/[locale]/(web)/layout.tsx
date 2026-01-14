// TODO [TENANT-001]: Extract site metadata to appConfig

import type { Metadata, Viewport } from "next";

import type { I18nParams } from "@/i18n/params";
import { routing } from "@/i18n/routing";

import "@/app/globals.css";

import { EmbedContextProvider, ThemeProvider } from "@/components/client";
import { I18nProvider, PlausibleScript } from "@/components/server";
import { appConfig } from "@/config/app-config";
import type { ThemeName } from "@/config/themes";
import { allowCrawling } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Изборен калкулатор",
    template: "%s — Изборен калкулатор",
  },
  description: "Најкорисните 5 минути пред изборите",
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
    title: "Изборен калкулатор",
    description: "Најкорисните 5 минути пред изборите",
    url: "https://www.izborenkalkulator.mk",
    siteName: "Изборен калкулатор",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Изборен калкулатор",
      },
    ],
    locale: "mk_MK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Изборен калкулатор",
    description: "Најкорисните 5 минути пред изборите",
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: I18nParams }) {
  const { locale } = await params;
  const defaultTheme = appConfig.theme.defaultTheme as ThemeName;

  return (
    <html lang={locale}>
      <head>
        <PlausibleScript />
      </head>
      <body className="min-h-dvh bg-slate-50">
        <I18nProvider locale={locale}>
          <EmbedContextProvider isEmbed={false}>
            <ThemeProvider name={defaultTheme}>{children}</ThemeProvider>
          </EmbedContextProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
