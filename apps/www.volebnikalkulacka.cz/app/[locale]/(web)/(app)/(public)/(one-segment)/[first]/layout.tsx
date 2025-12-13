import { notFound } from "next/navigation";

import { loadCalculatorData } from "@/calculator/data-fetching";
import { ProviderLayout } from "@/components/client";
import { NotFoundError } from "@/lib/errors";
import { mappedParams } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const segments = await params;
  const key = mappedParams.key(segments);

  try {
    const calculatorData = await loadCalculatorData({ key });
    return <ProviderLayout calculatorData={calculatorData}>{children}</ProviderLayout>;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}
