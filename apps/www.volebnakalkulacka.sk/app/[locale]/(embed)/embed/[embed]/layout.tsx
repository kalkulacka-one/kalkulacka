import { bootstrapColorMode } from "@kalkulacka-one/app";

import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // One un-gated tag, corrected before first paint by `bootstrapColorMode`
  // below — see the site layout for why not a `prefers-color-scheme` pair.
  // A partner theme resolves its own page colour; this is only the served
  // guess, the default theme's light page.
  themeColor: "#f8fafc",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ embed: string; locale: string }> }) {
  const { embed: embedParam, locale } = await params;

  if (!isEmbedName(embedParam)) notFound();
  const embed: EmbedName = embedParam;

  return (
    // `suppressHydrationWarning`: the inline script below adds `data-mode`
    // before hydration, out of step with the server markup on purpose.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <PlausibleScript />
      </head>
      <body>
        {/*
          The same pre-paint colour-mode bootstrap as the site layout. A
          single-mode partner theme pins `color-scheme: light` in its own
          stylesheet, which outranks the `data-mode` this writes — so a dark
          override stored on the main site cannot leak into the partner's
          palette, while the theme-colour it corrects is still the partner's.
        */}
        <script
          id="color-mode-bootstrap"
          suppressHydrationWarning
          // biome-ignore lint/security/noDangerouslySetInnerHtml: `bootstrapColorMode` is a fixed, module-scope string with no user input, not markup built from a request.
          dangerouslySetInnerHTML={{ __html: bootstrapColorMode }}
        />

        <I18nProvider locale={locale}>
          <EmbedProvider name={embed}>{children}</EmbedProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
