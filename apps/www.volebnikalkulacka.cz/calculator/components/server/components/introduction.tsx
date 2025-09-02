import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { title, intro } = calculator;
  return (
    <>
      <h1>{title}</h1>
      <p>{intro}</p>
    </>
  );
}
