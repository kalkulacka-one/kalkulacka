import { useTranslations } from "next-intl";

import { EmbedAttribution } from "@/components/embed-attribution";

const HEIGHT = "koa:h-11";
const MARGIN_BOTTOM = "koa:mb-11";

export type EmbedFooter = {
  attribution?: boolean;
  homepageHref: string;
  privacyHref?: string;
};

export function EmbedFooter({ attribution = true, homepageHref, privacyHref }: EmbedFooter) {
  const t = useTranslations("koa");

  return (
    <div className="koa:flex koa:items-baseline koa:gap-4">
      {attribution && <EmbedAttribution href={homepageHref} title={t("appTitle")} />}
      {privacyHref && (
        <a href={privacyHref} target="_blank" rel="noopener noreferrer" className="koa:text-xs koa:text-slate-400 koa:hover:text-slate-600 koa:hover:underline">
          {t("components.embedFooter.privacy")}
        </a>
      )}
    </div>
  );
}

EmbedFooter.heightClassNames = HEIGHT;
EmbedFooter.marginBottomClassNames = MARGIN_BOTTOM;
