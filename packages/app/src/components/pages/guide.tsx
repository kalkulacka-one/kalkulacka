import { Button, Icon } from "@kalkulacka-one/design-system/client";

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
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onBackClick: () => void;
  onCloseClick: () => void;
};

export function GuidePage({ embedContext, calculator, onNextClick, onBackClick, onCloseClick }: GuidePage) {
  const t = useTranslations("koa.pages");
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  return (
    <Layout>
      <Layout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <HideOnEmbed>
              <Button variant="link" color="neutral" size="small" aria-label={t("common.close")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeader.Right>
          <AppHeader.Bottom>
            <AppHeader.BottomLeft condensed={false}>
              <Button variant="link" color="neutral" size="small" onClick={onBackClick} aria-label={t("guide.back")}>
                <Icon icon={mdiArrowLeft} size="medium" decorative />
              </Button>
            </AppHeader.BottomLeft>
            <AppHeader.BottomMain condensed={false}>
              <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">{t("guide.title")}</h3>
            </AppHeader.BottomMain>
          </AppHeader.Bottom>
        </AppHeader>
      </Layout.Header>
      <Layout.Content>
        <Guide calculator={calculator} />
      </Layout.Content>
      <Layout.BottomSpacer className={GuideNavigationCard.heightClassNames} />
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} lg:hidden`} />}
      <Layout.BottomNavigation className={hasFooter ? `${EmbedFooter.marginBottomClassNames} lg:mb-0` : undefined}>
        <GuideNavigationCard onNextClick={onNextClick} />
      </Layout.BottomNavigation>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} />}</Layout.Footer>
    </Layout>
  );
}
