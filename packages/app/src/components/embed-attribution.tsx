import { Logo } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

export type EmbedAttribution = {
  href: string;
  title: string;
};

export function EmbedAttribution({ href, title }: EmbedAttribution) {
  const t = useTranslations("koa.components.embedAttribution");

  return (
    <a href={href} target="_blank" className="group p-2 flex items-center gap-2 rounded-lg text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 min-w-max">
      <span>{t("broughtBy")}</span>
      <div className="group-hover:hidden">
        <Logo title={title} size="small" monochrome />
      </div>
      <div className="hidden group-hover:block">
        <Logo title={title} size="small" />
      </div>
      <span>{title}</span>
    </a>
  );
}
