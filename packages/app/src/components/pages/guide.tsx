import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, Closable, type EmbedContextType } from "@/client";
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
          <div className="koa:mb-4">
            <Button variant="pill" color="neutral" onClick={onBackClick}>
              <Icon icon={mdiArrowLeft} size="small" decorative />
              {t("guide.back")}
            </Button>
          </div>
          <h3 className="koa:font-display koa:font-bold koa:text-display koa:tracking-tight koa:text-text koa:mb-2 koa:sm:mb-3">{t("guide.title")}</h3>
          <Guide calculator={calculator} />
        </Layout.Content>
        <Layout.BottomNavigation>
          <GuideNavigationCard onNextClick={onNextClick} />
        </Layout.BottomNavigation>
      </Layout.Body>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
