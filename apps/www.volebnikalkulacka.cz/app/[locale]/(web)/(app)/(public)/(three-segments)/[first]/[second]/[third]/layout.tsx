import { notFound } from "next/navigation";

import { loadCalculatorData } from "@/calculator";
import { ProviderLayout } from "@/components/client";
import { mappedParams, prefixGuard } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const segments = await params;
  const { first } = segments;

  prefixGuard(first);

  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  try {
    const calculatorData = await loadCalculatorData({ key, group });
    return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
  } catch (error) {
    console.error("Failed to load calculator data:", error);
    notFound();
  }
}
