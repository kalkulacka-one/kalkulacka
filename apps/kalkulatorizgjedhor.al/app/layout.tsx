"use client";

import "./globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { Blobs, Header, Footer } from "@repo/design-system/ui";

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
        <main className="relative grid h-screen p-4">
          <Header />
          <Blobs />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
