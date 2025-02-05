"use client";

import "./globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { Blobs } from "@repo/design-system/ui";

export default function RootLayout({
  params: { lang },
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang={lang}>
      <head>
        <script
          defer
          data-domain="volebnikalkulacka.cz"
          src="/js/script.tagged-events.outbound-links.js"
        />
      </head>
      <body>
        <main className="grid gap-8 p-4">
          <Blobs />
          {children}
        </main>
      </body>
    </html>
  );
}
