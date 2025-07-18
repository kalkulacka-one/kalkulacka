import type React from "react";
import { StepProgressFancy } from "./stepProgressFancy";

export type BottomBar = {
  children: React.ReactNode;
  stepCurrent: number;
  stepTotal: number;
  questions: any[];
};

export function BottomBar({ children, stepCurrent, stepTotal, questions }: BottomBar) {
  return (
    <div className="border-black border absolute left-0 bottom-0 w-full flex flex-col justify-center">
      <div>
        <StepProgressFancy questions={questions} currentQuestion={stepCurrent} questionTotal={stepTotal} />
      </div>
      {children}
    </div>
  );
}
