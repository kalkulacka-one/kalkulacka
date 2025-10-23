import { notFound } from "next/navigation";

import { loadCalculatorData } from "../../../../../../../calculator/lib";
import { SessionProviderLayout } from "../../../../../../../components/client";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  const calculatorData = await loadCalculatorData({ key: first, group: second });

  if (!calculatorData) {
    notFound();
  }

  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
