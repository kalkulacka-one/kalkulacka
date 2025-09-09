import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader, AppHeaderBottom, AppHeaderBottomMain, AppHeaderMain, AppHeaderRight, Introduction, IntroductionNavigationCard, LayoutBottomNavigation, LayoutHeader } from "../components";

export type IntroductionPage = {
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function IntroductionPage({ calculator, onNextClick, onCloseClick }: IntroductionPage) {
  return (
    <>
      <LayoutHeader>
        <AppHeader>
          <AppHeaderMain title="Volební kalkulačka" tertiaryTitle="Sněmovní volby 2025" />
          <AppHeaderRight>
            <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
              <Icon icon={mdiClose} size="medium" decorative />
            </Button>
          </AppHeaderRight>
          <AppHeaderBottom>
            <AppHeaderBottomMain>
              <h2 className="ko:font-display font-semibold text-3xl">{calculator?.shortTitle}</h2>
            </AppHeaderBottomMain>
          </AppHeaderBottom>
        </AppHeader>
      </LayoutHeader>
      <Introduction calculator={calculator} />
      <LayoutBottomNavigation>
        <IntroductionNavigationCard onNextClick={onNextClick} />
      </LayoutBottomNavigation>
    </>
  );
}
