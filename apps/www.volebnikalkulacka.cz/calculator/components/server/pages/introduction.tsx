import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader, Introduction, IntroductionNavigationCard, LayoutBottomNavigation, LayoutHeader } from "../components";

export type IntroductionPage = {
  calculator: CalculatorViewModel;
  onNextClick: () => void;
};

export function IntroductionPage({ calculator, onNextClick }: IntroductionPage) {
  return (
    <>
      <LayoutHeader>
        <AppHeader>
          <h1>Volební kalkulačka</h1>
        </AppHeader>
      </LayoutHeader>
      <Introduction calculator={calculator} />
      <LayoutBottomNavigation>
        <IntroductionNavigationCard onNextClick={onNextClick} />
      </LayoutBottomNavigation>
    </>
  );
}
