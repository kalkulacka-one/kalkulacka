import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";

export type Introduction = {
  calculator: Calculator;
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
