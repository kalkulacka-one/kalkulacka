import type { Metadata } from "next";

import { loadCalculatorData } from "../../../../../../calculator/lib";
import { calculatorViewModel } from "../../../../../../calculator/view-models";
import { ProviderLayout } from "../../../../../../components/client";

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params;
  const calculatorData = await loadCalculatorData({ key: first });
  const calculator = calculatorViewModel(calculatorData.calculator);

  return {
    title: calculator.title || calculator.shortTitle,
    description: calculator.description,
    openGraph: {
      title: calculator.title || calculator.shortTitle,
      description: calculator.description,
    },
    twitter: {
      card: "summary_large_image",
      title: calculator.title || calculator.shortTitle,
      description: calculator.description,
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  const calculatorData = await loadCalculatorData({ key: first });
  return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
}
