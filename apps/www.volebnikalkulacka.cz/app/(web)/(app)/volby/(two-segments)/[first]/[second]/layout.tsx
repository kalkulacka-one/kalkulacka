import type { Metadata } from "next";

import { loadCalculatorData } from "../../../../../../../calculator/lib";
import { ProviderLayout } from "../../../../../../../components/client";
import { generateCalculatorMetadata } from "../../../../../../../lib/metadata/calculator-metadata";

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params;
  return generateCalculatorMetadata({ key: first, group: second });
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  const calculatorData = await loadCalculatorData({ key: first, group: second });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
