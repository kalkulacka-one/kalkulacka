"use client";

import { useShallow } from "zustand/react/shallow";
import type { Calculator } from "../../../packages/schema/schemas/calculator.schema";
import { type Questions, questionsSchema } from "../../../packages/schema/schemas/questions.schema";
import { useCalculatorStore } from "./calculatorStore";

export default function NavodView() {
  const { calculator, questions, step, actions } = useCalculatorStore(
    useShallow((state) => ({
      calculator: state.calculator?.calculator || ({} as Calculator),
      questions: state.calculator?.questions || ({} as Questions),
      step: state.step,
      actions: state.actions,
    })),
  );

  const { intro } = calculator;
  const { handleStep } = actions;

  console.log(calculator);
  return (
    <div>
      Návod view:
      <span>{intro}</span>
      <button className="bg-amber-200 p-4" type="button" onClick={() => handleStep("next")}>
        Next step
      </button>
      <button className="bg-red-200 p-4" type="button" onClick={() => handleStep("previous")}>
        Prev step
      </button>
      <span>{step}</span>
      {questions.map((question) => (
        <p key={question.id}>{question.statement}</p>
      ))}
    </div>
  );
}
