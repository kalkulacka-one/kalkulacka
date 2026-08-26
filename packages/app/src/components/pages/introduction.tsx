import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, type EmbedContextType, HideOnEmbed } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Introduction } from "@/components/introduction";
import { IntroductionNavigationCard } from "@/components/introduction-navigation-card";
import { Layout } from "@/components/layout";
import type { CalculatorViewModel } from "@/view-models";

export type IntroductionPage = {
  embedContext: EmbedContextType;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function IntroductionPage({ embedContext, calculator, onNextClick, onCloseClick }: IntroductionPage) {
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
            <AppHeader.BottomMain>
              <h2 className="font-display font-semibold text-2xl tracking-tight text-slate-700">{calculator?.shortTitle || ""}</h2>
            </AppHeader.BottomMain>
          </AppHeader.Bottom>
        </AppHeader>
      </Layout.Header>
      <Layout.Content>
        <Introduction calculator={calculator} />
      </Layout.Content>
      <Layout.BottomSpacer className={IntroductionNavigationCard.heightClassNames} />
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} lg:hidden`} />}
      <Layout.BottomNavigation className={hasFooter ? `${EmbedFooter.marginBottomClassNames} lg:mb-0` : undefined}>
        <IntroductionNavigationCard onNextClick={onNextClick} />
      </Layout.BottomNavigation>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} />}</Layout.Footer>
    </Layout>
  );
}
