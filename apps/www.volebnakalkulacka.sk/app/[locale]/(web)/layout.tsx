import { bootstrapColorMode } from "@kalkulacka-one/app";

import type { Metadata, Viewport } from "next";

import type { I18nParams } from "@/i18n/params";
import { routing } from "@/i18n/routing";

import "@/app/globals.css";

import { EmbedContextProvider, ThemeProvider } from "@/components/client";
import { I18nProvider, PlausibleScript } from "@/components/server";
import { appConfig } from "@/config/app-config";
import type { ThemeName } from "@/config/themes";
import { allowCrawling } from "@/lib/seo";

// TODO [TENANT-001]: Extract site metadata to appConfig
export const metadata: Metadata = {
  title: {
    default: "Volebná kalkulačka",
    template: "%s — Volebná kalkulačka",
  },
  description: "Najužitočnejších 5 minút pred voľbami",
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
    title: "Volebná kalkulačka",
    description: "Najužitočnejších 5 minút pred voľbami",
    url: "https://www.volebnakalkulacka.sk",
    siteName: "Volebná kalkulačka",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Volebná kalkulačka",
      },
    ],
    locale: "sk_SK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Volebná kalkulačka",
    description: "Najužitočnejších 5 minút pred voľbami",
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
  /*
   * One tag, no `prefers-color-scheme` pair.
   *
   * A media-gated pair follows the *OS*, which stops being the right answer
   * the moment someone picks a mode in the app's menu — and a browser applies
   * the first tag whose media matches, so the OS's answer would keep winning
   * over anything written later. A single unconditional tag is the one the
   * colour-mode code can own: `bootstrapColorMode` below corrects it before
   * first paint and the toggle rewrites it on every switch. This value is
   * only what a browser sees in the served HTML — the light page colour of
   * the theme this site borrows (`--ko-palette-page-light` in the design
   * system's `www.volebnikalkulacka.cz/default.css`, see `themes/default-theme.tsx`).
   */
  themeColor: "#f8fafc",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: I18nParams }) {
  const { locale } = await params;
  const defaultTheme = appConfig.theme.defaultTheme as ThemeName;

  return (
    <html
      lang={locale}
      // The inline script below adds `data-mode` itself, before hydration —
      // deliberately out of step with the server-rendered markup, which
      // knows nothing about a client-only localStorage value. That mismatch
      // is the point, not a bug for React to flag.
      suppressHydrationWarning
    >
      <head>
        <PlausibleScript />
      </head>
      <body className="min-h-dvh bg-slate-50">
        {/*
          Light/dark mode defaults to the OS preference (`color-scheme: light
          dark` in the design system); this only has work to do once someone
          picks an explicit override. A plain `<script>` — not `next/script` —
          because it has to run synchronously while the server-rendered HTML
          is still being parsed, before the browser paints anything: that's
          what stops a stored override from flashing the system mode first.
        */}
        <script
          id="color-mode-bootstrap"
          suppressHydrationWarning
          // A child string triggers React's "script tag while rendering"
          // dev warning, since a `<script>` child is normally page text, not
          // code — `dangerouslySetInnerHTML` is the same output without it.
          // biome-ignore lint/security/noDangerouslySetInnerHtml: `bootstrapColorMode` is a fixed, module-scope string with no user input, not markup built from a request.
          dangerouslySetInnerHTML={{ __html: bootstrapColorMode }}
        />

        <I18nProvider locale={locale}>
          <EmbedContextProvider isEmbed={false}>
            <ThemeProvider name={defaultTheme}>{children}</ThemeProvider>
          </EmbedContextProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
