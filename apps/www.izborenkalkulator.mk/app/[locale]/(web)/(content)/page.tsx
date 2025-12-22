import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("homepage");

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">{t("title")}</h1>
      </div>
    </div>
  );
}
