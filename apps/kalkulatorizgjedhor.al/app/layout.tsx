import "@repo/design-system/styles";
import "@repo/design-system/themes/kalkulacka.one";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kalkulatori zgjedhor",
  description: "Kalkulatori zgjedhor është një projekt i organizatës jofitimprurëse KohoVolit.eu, në bashkëpunim me Faktoje, dhe është një ndihmës i paanshëm në vendimin tuaj se kë të votoni.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq">
      <head>
        <script defer data-domain="kalkulatorizgjedhor.al" src="/js/script.tagged-events.outbound-links.js" />
      </head>
      <body>
        <main className="relative grid h-screen p-4">{children}</main>
      </body>
    </html>
  );
}
