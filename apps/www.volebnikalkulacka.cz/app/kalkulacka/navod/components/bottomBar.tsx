import type React from "react";
import { StepProgress } from "./stepProgress";

export type BottomBar = {
  children: React.ReactNode;
  stepCurrent: number;
  stepTotal: number;
};

export function BottomBar({ children, stepCurrent, stepTotal }: BottomBar) {
  return (
    <div className="border-black border absolute left-0 bottom-0 w-full flex justify-center">
      {/* content */}
      <div className="flex flex-col w-1/3">
        {/* progress */}
        <div className="flex justify-between items-center">
          {/* progress text */}
          <span>
            Návod {stepCurrent}/{stepTotal}
          </span>
          {/* progress gui */}
          <div>
            <StepProgress stepTotal={stepTotal} stepCurrent={stepCurrent} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
