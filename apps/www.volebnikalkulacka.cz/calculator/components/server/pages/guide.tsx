import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { Introduction } from "../components";
import { GuideComponent } from "../components/guideComponent";
import { GuideNavigationCard } from "../components/guideNavigationCard";

export type GuidePage = {
  calculator: Calculator;
  step: number;
  onNavigationClick: () => void;
};

export function GuidePage({ calculator, step, onNavigationClick }: GuidePage) {
  return (
    <div>
      {(() => {
        switch (step) {
          case 1:
            return <Introduction calculator={calculator} />;
          case 2:
            return <GuideComponent href="/" />;
        }
      })()}
      <GuideNavigationCard step={step} onNavigationClick={onNavigationClick} />
    </div>
  );
}
