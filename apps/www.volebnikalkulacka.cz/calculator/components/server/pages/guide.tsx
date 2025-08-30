import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { Introduction } from "../components";

export type GuidePage = {
  calculator: Calculator;
  step: number;
};

export function GuidePage({ calculator, step }: GuidePage) {
  switch (step) {
    case 1:
      return <Introduction calculator={calculator} />;
  }
}
