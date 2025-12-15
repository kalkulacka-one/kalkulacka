import type { I18nParams } from "@/i18n/params";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function WebLayout({ children, params }: { children: React.ReactNode; params: I18nParams }) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className="min-h-dvh bg-slate-50">{children}</body>
    </html>
  );
}
