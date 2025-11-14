import { loadCalculatorData } from "@/calculator/data-fetching";
import { SessionProviderLayout } from "@/components/client";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  const calculatorData = await loadCalculatorData({ key: first });
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
