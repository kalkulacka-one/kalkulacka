import { notFound } from "next/navigation";

export function calculatorPathGuard({ calculator, prefixed, group }: { calculator: { election?: unknown; calculatorGroup?: unknown }; prefixed: boolean; group?: string }): void {
  const expectsPrefix = Boolean(calculator.election);
  const expectsGroup = Boolean(calculator.calculatorGroup);

  if (prefixed !== expectsPrefix || Boolean(group) !== expectsGroup) {
    notFound();
  }
}
