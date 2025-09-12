import type { Metadata } from "next";

import { loadCalculatorData } from "../../../../../../calculator/lib";
import { ProviderLayout } from "../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../lib/metadata/calculator-metadata";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params;
  return generateCalculatorMetadata({ key: first });
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  const calculatorData = await loadCalculatorData({ key: first });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
