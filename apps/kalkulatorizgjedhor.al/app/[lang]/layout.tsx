"use client";

import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import "../globals.css";
import { Blobs, Header, Footer } from "@repo/design-system/ui";

const headerText = {
  sq: "Kalkulatori Zgjedhor",
  en: "Election Calculator",
  cs: "Volební kalkulačka"
};

export default function LanguageLayout({
  params: { lang },
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}): JSX.Element | null {
  // Redirect if someone tries to access /sq
  if (lang === 'sq') {
    // Redirect to root
    window.location.href = '/';
    return null;
  }

  return (
    <html lang={lang}>
      <head>
        <script
          defer
          data-domain="kalkulatorizgjedhor.al"
          src="/js/script.tagged-events.outbound-links.js"
        />
      </head>
      <body>
        <main className="relative grid h-screen p-4">
          <Header text={headerText[lang as keyof typeof headerText]} />
          <Blobs />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
} 