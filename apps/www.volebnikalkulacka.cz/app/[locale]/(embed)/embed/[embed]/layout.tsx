import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import "./../../../../globals.css";

import { EmbedProvider } from "@/components/client";
import { PlausibleScript } from "@/components/server";
import { type EmbedName, isEmbedName } from "@/config/embeds";
import { routing } from "@/i18n/routing";
import { allowCrawling } from "@/lib/seo";

export const metadata: Metadata = {
  robots: {
    index: allowCrawling(),
    follow: allowCrawling(),
  },
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ embed: string; locale: string }> }) {
  const { embed: embedParam } = await params;
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  if (!isEmbedName(embedParam)) notFound();
  const embed: EmbedName = embedParam;

  const messages = await getMessages({ locale });

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <PlausibleScript />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <EmbedProvider name={embed}>{children}</EmbedProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
