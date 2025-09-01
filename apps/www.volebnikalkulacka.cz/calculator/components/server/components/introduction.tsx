import type { CalculatorViewModel } from "../../../view-models/calculator.view-model";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  if (!calculator) {
    return <div>...Loading</div>;
  }
  const { title, intro } = calculator;
  return (
    <>
      <h1>{title}</h1>
      <p>{intro}</p>
    </>
  );
}
