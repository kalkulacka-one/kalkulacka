import type { Calculator } from "@kalkulacka-one/schema";

import { notFound } from "next/navigation";

export function calculatorPathGuard({ calculator, prefixed, group }: { calculator: Calculator; prefixed: boolean; group?: string }): void {
  const expectsPrefix = "election" in calculator;
  const expectsGroup = "calculatorGroup" in calculator;

  if (prefixed !== expectsPrefix || Boolean(group) !== expectsGroup) {
    notFound();
  }
}
