import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

import { ErrorPageLayout } from "@/components/error-page-layout";

export type ErrorPage = {
  reset: () => void;
  digest?: string;
  compact?: boolean;
  homeHref?: string;
};

export function ErrorPage({ reset, digest, compact, homeHref = "/" }: ErrorPage) {
  const t = useTranslations("koa");

  return (
    <ErrorPageLayout title={t("appTitle")} compact={compact}>
      <p className="koa:text-xs koa:font-semibold koa:uppercase koa:tracking-widest koa:text-slate-400">{t("pages.error.eyebrow")}</p>
      <h1 className="koa:mt-2 koa:font-display koa:font-bold koa:tracking-tight koa:text-slate-700 koa:text-2xl koa:md:text-3xl">{t("pages.error.heading")}</h1>
      <p className="koa:mt-3 koa:text-slate-500">{t("pages.error.paragraph")}</p>
      <div className="koa:mt-6 koa:grid koa:gap-2">
        <Button onClick={reset}>{t("pages.error.retry")}</Button>
        <Button variant="link" color="neutral" href={homeHref} {...(compact ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {t("pages.error.home")}
        </Button>
      </div>
      <p className="koa:mt-6 koa:text-xs koa:text-slate-400">
        {t("pages.error.note")}
        {digest && (
          <>
            {" "}
            {t("pages.error.reference")}: <code className="koa:font-mono">{digest}</code>
          </>
        )}
      </p>
    </ErrorPageLayout>
  );
}
