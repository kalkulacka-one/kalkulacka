import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, Closable, type EmbedContextType } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { EmbedLayout } from "@/components/embed-layout";
import { Introduction } from "@/components/introduction";
import { IntroductionNavigationCard } from "@/components/introduction-navigation-card";
import { Layout as AppLayout } from "@/components/layout";
import type { CalculatorViewModel } from "@/view-models";

export type IntroductionPage = {
  embedContext: EmbedContextType;
  homepageHref: string;
  privacyHref?: string;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function IntroductionPage({ embedContext, homepageHref, privacyHref, calculator, onNextClick, onCloseClick }: IntroductionPage) {
  const t = useTranslations("koa.pages");

  const Layout = embedContext.isEmbed ? EmbedLayout : AppLayout;

  return (
    <Layout>
      <Layout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <Closable>
              <Button variant="round" color="neutral" size="small" aria-label={t("common.closeCalculator")} title={t("common.closeCalculator")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </Closable>
          </AppHeader.Right>
        </AppHeader>
      </Layout.Header>
      <Layout.Body>
        <Layout.Content>
          <h2 className="koa:font-display koa:font-bold koa:text-display koa:tracking-tight koa:text-text koa:mb-2 koa:sm:mb-3">{calculator?.shortTitle}</h2>
          <Introduction calculator={calculator} />
        </Layout.Content>
        <Layout.BottomNavigation>
          <IntroductionNavigationCard onNextClick={onNextClick} />
        </Layout.BottomNavigation>
      </Layout.Body>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
