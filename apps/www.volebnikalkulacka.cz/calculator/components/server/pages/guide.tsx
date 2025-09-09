import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader, Guide, GuideNavigationCard, LayoutBottomNavigation, LayoutHeader } from "../components";

export type GuidePage = {
  calculator: CalculatorViewModel;
  onNextClick: () => void;
};

export function GuidePage({ calculator, onNextClick }: GuidePage) {
  return (
    <>
      <LayoutHeader>
        <AppHeader>
          <h1>Volební kalkulačka</h1>
        </AppHeader>
      </LayoutHeader>
      <Guide calculator={calculator} />
      <LayoutBottomNavigation>
        <GuideNavigationCard onNextClick={onNextClick} />
      </LayoutBottomNavigation>
    </>
  );
}
