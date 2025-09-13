import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { HideOnEmbed } from "../../../../components/client";
import { canonical } from "../../../../lib/routing/url-builders";
import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader, AppHeaderBottom, AppHeaderBottomMain, AppHeaderMain, AppHeaderRight } from "../../client";
import { Introduction, IntroductionNavigationCard, LayoutBottomNavigation, LayoutContent, LayoutHeader } from "../components";

export type IntroductionPage = {
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onCloseClick: () => void;
  isEmbed?: boolean;
};

export function IntroductionPage({ calculator, onNextClick, onCloseClick, isEmbed }: IntroductionPage) {
  return (
    <>
      <LayoutHeader>
        <AppHeader logoTitle="Volební kalkulačka">
          <AppHeaderMain title="Volební kalkulačka" tertiaryTitle="Sněmovní volby 2025" />
          <AppHeaderRight>
            <HideOnEmbed>
              <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeaderRight>
          <AppHeaderBottom>
            <AppHeaderBottomMain>
              <h2 className="font-display font-semibold text-3xl">{calculator?.shortTitle}</h2>
            </AppHeaderBottomMain>
          </AppHeaderBottom>
        </AppHeader>
      </LayoutHeader>
      <LayoutContent>
        <Introduction calculator={calculator} />
      </LayoutContent>
      <LayoutBottomNavigation>
        <IntroductionNavigationCard onNextClick={onNextClick} attributionHref={isEmbed ? canonical.homepage() : undefined} />
      </LayoutBottomNavigation>
    </>
  );
}
