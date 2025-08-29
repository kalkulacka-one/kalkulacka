"use client";

import { useCalculatorStore } from "./calculatorStore";

export default function NavodView() {
  const data = useCalculatorStore((state) => state.data);
  return (
    <div>
      Návod view:
      <span>{data.intro}</span>
    </div>
  );
}
