import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "../../../globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { EmbedProvider } from "../../../../components/client";
import { PlausibleScript } from "../../../../components/server";
import { type EmbedName, isEmbedName } from "../../../../config/embeds";
import { allowCrawling } from "../../../../lib/seo";

export const metadata: Metadata = {
  robots: {
    index: allowCrawling(),
    follow: allowCrawling(),
  },
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ embed: string }> }) {
  const { embed: embedParam } = await params;
  if (!isEmbedName(embedParam)) notFound();
  const embed: EmbedName = embedParam;
  const messages = await getMessages();

  return (
    <html lang="cs">
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
