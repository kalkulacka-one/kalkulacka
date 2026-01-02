import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "@/app/globals.css";

import { EmbedProvider } from "@/components/client";
import { I18nProvider, PlausibleScript } from "@/components/server";
import { type EmbedName, isEmbedName } from "@/config/embeds";
import { routing } from "@/i18n/routing";
import { allowCrawling } from "@/lib/seo";

export const metadata: Metadata = {
  robots: {
    index: allowCrawling(),
    follow: allowCrawling(),
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ embed: string; locale: string }> }) {
  const { embed: embedParam, locale } = await params;

  if (!isEmbedName(embedParam)) notFound();
  const embed: EmbedName = embedParam;

  return (
    <html lang={locale}>
      <head>
        <PlausibleScript />
      </head>
      <body>
        <I18nProvider locale={locale}>
          <EmbedProvider name={embed}>{children}</EmbedProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
