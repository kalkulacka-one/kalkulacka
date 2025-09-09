import type { CalculatorViewModel } from "../../../view-models";
import { AppHeader, Guide, GuideNavigationCard, Introduction, LayoutBottomNavigation, LayoutHeader } from "../components";

export type GuidePage = {
  calculator: CalculatorViewModel;
  step: 1 | 2;
  onNavigationNextClick: () => void;
  onNavigationPreviousClick: () => void;
};

export function GuidePage({ calculator, step, onNavigationNextClick, onNavigationPreviousClick }: GuidePage) {
  return (
    <>
      <LayoutHeader>
        <AppHeader>
          <h1>Volební kalkulačka</h1>
        </AppHeader>
      </LayoutHeader>
      {(() => {
        switch (step) {
          case 1:
            return <Introduction calculator={calculator} />;
          case 2:
            return <Guide calculator={calculator} />;
        }
      })()}
      <LayoutBottomNavigation>
        <GuideNavigationCard step={step} onNextClick={onNavigationNextClick} onPreviousClick={onNavigationPreviousClick} />
      </LayoutBottomNavigation>
    </>
  );
}
