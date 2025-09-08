import type { CalculatorViewModel } from "../../../view-models";
import { GuideComponent, GuideNavigationCard, Introduction, LayoutBottomNavigation } from "../components";

export type GuidePage = {
  calculator: CalculatorViewModel;
  step: 1 | 2;
  onNavigationNextClick: () => void;
};

export function GuidePage({ calculator, step, onNavigationNextClick }: GuidePage) {
  return (
    <>
      {(() => {
        switch (step) {
          case 1:
            return <Introduction calculator={calculator} />;
          case 2:
            return <GuideComponent />;
        }
      })()}
      <LayoutBottomNavigation>
        <GuideNavigationCard step={step} onNextClick={onNavigationNextClick} />
      </LayoutBottomNavigation>
    </>
  );
}
