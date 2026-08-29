import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { type EmbedContextType, HideOnEmbed } from "../../../../components/client";
import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader } from "../../client";
import { EmbedFooter, Introduction, IntroductionNavigationCard, Layout } from "../components";

export type IntroductionPage = {
  embedContext: EmbedContextType;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function IntroductionPage({ embedContext, calculator, onNextClick, onCloseClick }: IntroductionPage) {
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;
  const t = useTranslations("calculator.introduction");

  return (
    <Layout>
      <Layout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <HideOnEmbed>
              <Button variant="link" color="neutral" size="small" aria-label={t("close-aria-label")} title={t("close-aria-label")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeader.Right>
          <AppHeader.Bottom>
            <AppHeader.BottomMain>
              <h2 className="font-display font-semibold text-2xl tracking-tight text-slate-700">{calculator?.shortTitle || "Voksmonitor 2026"}</h2>
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
