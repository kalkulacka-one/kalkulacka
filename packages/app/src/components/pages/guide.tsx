import { Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, type EmbedContextType, HideOnEmbed } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Guide } from "@/components/guide";
import { GuideNavigationCard } from "@/components/guide-navigation-card";
import { Layout } from "@/components/layout";
import type { CalculatorViewModel } from "@/view-models";

export type GuidePage = {
  embedContext: EmbedContextType;
  homepageHref: string;
  privacyHref?: string;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onBackClick: () => void;
  onCloseClick: () => void;
};

export function GuidePage({ embedContext, homepageHref, privacyHref, calculator, onNextClick, onBackClick, onCloseClick }: GuidePage) {
  const t = useTranslations("koa.pages");
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  return (
    <Layout>
      <Layout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <HideOnEmbed>
              <AppHeader.IconButton aria-label={t("common.close")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </AppHeader.IconButton>
            </HideOnEmbed>
          </AppHeader.Right>
        </AppHeader>
      </Layout.Header>
      <Layout.Content>
        <button
          type="button"
          onClick={onBackClick}
          className="koa:inline-flex koa:items-center koa:gap-1.5 koa:rounded-pill koa:border koa:border-border koa:px-3 koa:py-1.5 koa:text-sm koa:text-text-muted koa:mb-4 koa:hover:bg-surface-sunken"
        >
          <Icon icon={mdiArrowLeft} size="small" decorative />
          {t("guide.back")}
        </button>
        <h3 className="koa:font-display koa:font-bold koa:text-display koa:tracking-tight koa:text-text koa:mb-2 koa:sm:mb-3">{t("guide.title")}</h3>
        <Guide calculator={calculator} />
      </Layout.Content>
      <Layout.BottomSpacer className={GuideNavigationCard.heightClassNames} />
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
      <Layout.BottomNavigation className={hasFooter ? "koa:bottom-11" : undefined}>
        <GuideNavigationCard onNextClick={onNextClick} />
      </Layout.BottomNavigation>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
