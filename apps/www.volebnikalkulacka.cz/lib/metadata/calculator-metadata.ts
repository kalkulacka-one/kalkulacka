import type { Metadata } from "next";

import { loadCalculatorData } from "../../calculator/lib";
import { calculatorViewModel } from "../../calculator/view-models/server";

export async function generateCalculatorMetadata({ key, group }: { key: string; group?: string }): Promise<Metadata> {
  const { calculator: calculatorData } = await loadCalculatorData({ key, group });
  const calculator = calculatorViewModel(calculatorData);

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
