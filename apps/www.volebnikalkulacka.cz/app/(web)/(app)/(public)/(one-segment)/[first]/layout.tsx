import { notFound } from "next/navigation";

import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const segments = await params;
  const key = mappedParams.key(segments);
  const calculatorData = await loadCalculatorData({ key });
  if (!calculatorData) notFound();
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
