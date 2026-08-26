import { useTranslations } from "next-intl";

import { EmbedAttribution } from "@/components/embed-attribution";

const HEIGHT = "h-11";
const MARGIN_BOTTOM = "mb-11";

export type EmbedFooter = {
  attribution?: boolean;
  privacyHref?: string;
};

export function EmbedFooter({ attribution = true, privacyHref = "/soukromi" }: EmbedFooter) {
  const t = useTranslations("koa");
  const canonicalUrl = process.env.NEXT_PUBLIC_CANONICAL_URL;
  const homepageUrl = canonicalUrl ? `${canonicalUrl.replace(/\/$/, "")}/` : "/";

  return (
    <div className="flex items-baseline gap-4">
      {attribution && <EmbedAttribution href={homepageUrl} title={t("appTitle")} />}
      <a href={privacyHref} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-slate-600 hover:underline">
        {t("components.embedFooter.privacy")}
      </a>
    </div>
  );
}

EmbedFooter.heightClassNames = HEIGHT;
EmbedFooter.marginBottomClassNames = MARGIN_BOTTOM;
