import { notFound } from "next/navigation";

import { loadCalculatorData } from "@/calculator";
import { SessionProviderLayout } from "@/components/client";
import { mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const segments = await params;
  const key = mappedParams.key(segments);
  try {
    const calculatorData = await loadCalculatorData({ key });
    return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
  } catch (error) {
    console.error("Failed to load calculator data:", error);
    notFound();
  }
}
