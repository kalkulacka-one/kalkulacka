import { notFound } from "next/navigation";

import { loadCalculatorData } from "../../../../../../calculator/lib";
import { SessionProviderLayout } from "../../../../../../components/client";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  const calculatorData = await loadCalculatorData({ key: first });

  if (!calculatorData) {
    notFound();
  }

  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
