import { notFound } from "next/navigation";

import { loadCalculatorData } from "@/calculator";
import { ProviderLayout } from "@/components/client";
import { isAllowedPrefix } from "@/lib/routing/allowed-prefixes";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  // Validate prefix
  if (!isAllowedPrefix(first)) {
    notFound();
  }

  // Load calculator data with key=second (no group for 2-segment routes)
  const calculatorData = await loadCalculatorData({ key: second });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
