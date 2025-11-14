import { notFound } from "next/navigation";

import { loadCalculatorData } from "../../../../../../../calculator/lib";
import { ProviderLayout } from "../../../../../../../components/client";
import { isAllowedPrefix } from "../../../../../../../lib/routing/allowed-prefixes";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  // Validate prefix
  if (!isAllowedPrefix(first)) {
    notFound();
  }

  // Load calculator data with key=second, group=third
  const calculatorData = await loadCalculatorData({ key: second, group: third });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
