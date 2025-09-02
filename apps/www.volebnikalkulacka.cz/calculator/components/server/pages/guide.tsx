import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { Introduction } from "../components";
import { GuideComponent } from "../components/guideComponent";

export type GuidePage = {
  calculator: Calculator;
  step: number;
};

export function GuidePage({ calculator, step }: GuidePage) {
  switch (step) {
    case 1:
      return <Introduction calculator={calculator} />;
    case 2:
      return <GuideComponent href="/" />;
  }
}
