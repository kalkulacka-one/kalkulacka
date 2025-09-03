import type { CalculatorViewModel } from "../../../view-models";
import { Introduction } from "../components";
import { GuideComponent } from "../components/guide-component";

export type GuidePage = {
  calculator: CalculatorViewModel;
  step: number;
};

export function GuidePage({ calculator, step }: GuidePage) {
  switch (step) {
    case 1:
      return <Introduction calculator={calculator} />;
    case 2:
      return <GuideComponent />;
  }
}
