import type { CalculatorViewModel } from "../../../view-models";
import { Introduction } from "../components";

export type GuidePage = {
  calculator: CalculatorViewModel;
  step: number;
};

export function GuidePage({ calculator, step }: GuidePage) {
  switch (step) {
    case 1:
      return <Introduction calculator={calculator} />;
  }
}
