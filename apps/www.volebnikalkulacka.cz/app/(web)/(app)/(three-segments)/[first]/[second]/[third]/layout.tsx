import { notFound } from "next/navigation";

import { loadCalculatorData } from "@/calculator";
import { SessionProviderLayout } from "@/components/client";
import { isAllowedPrefix } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  // Validate prefix
  if (!isAllowedPrefix(first)) {
    notFound();
  }

  // Load calculator data with key=second, group=third
  const calculatorData = await loadCalculatorData({ key: second, group: third });
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
