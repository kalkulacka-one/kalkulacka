import { getTranslations } from "next-intl/server";

import { Header } from "../../../../components/client";
import { Footer } from "../../../../components/server";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "layouts" });
  return (
    <div className="grid grid-cols-1">
      <Header />
      {children}
      <Footer locale={locale} />
    </div>
  );
}
