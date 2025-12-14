import { Logo } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

export type EmbedAttribution = {
  href: string;
  title: string;
};

export function EmbedAttribution({ href, title }: EmbedAttribution) {
  const t = useTranslations("koa.components.embedAttribution");

  return (
    <a
      href={href}
      target="_blank"
      className="koa:group koa:p-2 koa:flex koa:items-center koa:gap-2 koa:rounded-lg koa:text-sm koa:text-slate-400 koa:hover:text-slate-600 koa:hover:bg-slate-100 koa:min-w-max"
    >
      <span>{t("broughtBy")}</span>
      <div className="koa:group-hover:hidden">
        <Logo title={title} size="small" monochrome />
      </div>
      <div className="koa:hidden koa:group-hover:block">
        <Logo title={title} size="small" />
      </div>
      <span>{title}</span>
    </a>
  );
}
