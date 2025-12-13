import { loadCalculatorData } from "@/calculator";
import { SessionProviderLayout } from "@/components/client";
import { mappedParams, prefixGuard } from "@/lib/routing";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string; third: string }> }) {
  const segments = await params;
  const { first } = segments;

  prefixGuard(first);

  const key = mappedParams.key(segments);
  const group = mappedParams.group(segments);
  const calculatorData = await loadCalculatorData({ dataEndpoint: process.env.DATA_ENDPOINT ?? "", key, group });
  return <SessionProviderLayout calculatorData={calculatorData}>{children}</SessionProviderLayout>;
}
