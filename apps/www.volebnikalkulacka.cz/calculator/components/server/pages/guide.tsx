import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader, AppHeaderBottomLeft, AppHeaderBottomMain, AppHeaderMain, AppHeaderRight } from "../../client";
import { GuideComponent, GuideNavigationCard, Introduction, LayoutBottomNavigation, LayoutHeader } from "../components";

export type GuidePage = {
  calculator: CalculatorViewModel;
  step: 1 | 2;
  onNavigationNextClick: () => void;
  onNavigationPreviousClick: () => void;
  onPreviousClick: () => void;
};

export function GuidePage({ calculator, step, onNavigationNextClick, onNavigationPreviousClick, onPreviousClick }: GuidePage) {
  return (
    <>
      <LayoutHeader>
        <AppHeader>
          <AppHeaderMain />
          <AppHeaderRight>
            <Button variant="link" color="neutral" size="small" aria-label="Close">
              <Icon icon={mdiClose} size="medium" decorative />
            </Button>
          </AppHeaderRight>
          <AppHeaderBottomLeft>
            <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label="Back">
              <Icon icon={mdiArrowLeft} size="medium" decorative />
            </Button>
          </AppHeaderBottomLeft>
          <AppHeaderBottomMain>Návod</AppHeaderBottomMain>
        </AppHeader>
      </LayoutHeader>
      {(() => {
        switch (step) {
          case 1:
            return <Introduction calculator={calculator} />;
          case 2:
            return <GuideComponent />;
        }
      })()}
      <LayoutBottomNavigation>
        <GuideNavigationCard step={step} onNextClick={onNavigationNextClick} onPreviousClick={onNavigationPreviousClick} />
      </LayoutBottomNavigation>
    </>
  );
}
