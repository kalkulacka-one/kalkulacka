import { notFound } from "next/navigation";

export function sessionPathGuard({ session, key, group }: { session: { calculatorKey: string; calculatorGroup: string | null }; key: string; group?: string }): void {
  if (session.calculatorKey !== key || (session.calculatorGroup ?? undefined) !== group) {
    notFound();
  }
}
