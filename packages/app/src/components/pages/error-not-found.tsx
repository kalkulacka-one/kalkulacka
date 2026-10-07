import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { ErrorPageLayout } from "@/components/error-page-layout";

export type ErrorNotFoundPage = {
  compact?: boolean;
  homeHref?: string;
};

export function ErrorNotFoundPage({ compact, homeHref = "/" }: ErrorNotFoundPage) {
  const t = useTranslations("koa");

  return (
    <ErrorPageLayout title={t("appTitle")} compact={compact}>
      <p className="koa:text-xs koa:font-semibold koa:uppercase koa:tracking-widest koa:text-slate-400">{t("pages.notFound.eyebrow")}</p>
      <h1 className="koa:mt-2 koa:font-display koa:font-bold koa:tracking-tight koa:text-slate-700 koa:text-2xl koa:md:text-3xl">{t("pages.notFound.heading")}</h1>
      <p className="koa:mt-3 koa:text-slate-500">{t("pages.notFound.paragraph")}</p>
      <div className="koa:mt-6 koa:grid">
        <Button href={homeHref} {...(compact ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {t("pages.notFound.home")}
        </Button>
      </div>
    </ErrorPageLayout>
  );
}
