"use client";

import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import "./globals.css";
import { Blobs, Header } from "@repo/design-system/ui";
import { Footer } from "./components/footer";

const headerText = {
  default: "Kalkulatori Zgjedhor", // Albanian as default
  en: "Election Calculator",
  cs: "Volební kalkulačka",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="sq">
      <head>
        <script
          defer
          data-domain="kalkulatorizgjedhor.al"
          src="/js/script.tagged-events.outbound-links.js"
        />
      </head>
      <body>
        <main className="relative grid h-screen p-4">
          <Header text={headerText.default} />
          <Blobs />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
