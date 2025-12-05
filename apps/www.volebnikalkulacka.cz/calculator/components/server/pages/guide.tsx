import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiClose } from "@mdi/js";

import type { CalculatorViewModel } from "@/calculator";
import { AppHeader } from "@/calculator/client";
import { type EmbedContextType, HideOnEmbed } from "@/components/client";

import { EmbedFooter, Guide, GuideNavigationCard, Layout } from "../components";

export type GuidePage = {
  embedContext: EmbedContextType;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onBackClick: () => void;
  onCloseClick: () => void;
};

export function GuidePage({ embedContext, calculator, onNextClick, onBackClick, onCloseClick }: GuidePage) {
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  return (
    <Layout>
      <Layout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <HideOnEmbed>
              <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeader.Right>
          <AppHeader.Bottom>
            <AppHeader.BottomLeft condensed={false}>
              <Button variant="link" color="neutral" size="small" onClick={onBackClick} aria-label="Zpět na úvod">
                <Icon icon={mdiArrowLeft} size="medium" decorative />
              </Button>
            </AppHeader.BottomLeft>
            <AppHeader.BottomMain condensed={false}>
              <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">Návod</h3>
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
