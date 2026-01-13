import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

export function NotFoundPage() {
  const t = useTranslations("calculator.pages.not-found-page");

  return (
    <div className="h-screen flex flex-col justify-center items-start lg:items-center gap-4 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16">
      <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">{t("heading")}</h2>
      <p className="text-slate-500">{t("paragraph")}</p>
      <Button variant="outline" color="neutral">
        {t("cta")}
      </Button>
    </div>
  );
}
