import "@/app/globals.css";

import { PlausibleScript } from "@/components/server";
import type { I18nParams } from "@/i18n/params";

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: I18nParams }) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <head>
        <PlausibleScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
