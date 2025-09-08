import { Card } from "@repo/design-system/server";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { title, intro } = calculator;
  return (
    <>
      <h1 className="text-2xl ko:font-display font-semibold mb-2 tracking-[-.03em]">{title}</h1>
      <p className="tracking-[0.03em]">{intro}</p>
    </>
  );
}
