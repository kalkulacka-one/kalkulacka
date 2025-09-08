import { AnswersStoreProvider, CalculatorStoreProvider } from "../../../../../../calculator/components/client";
import { Layout as AppLayout } from "../../../../../../calculator/components/server";
import { loadCalculatorData } from "../../../../../../calculator/lib";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  const calculatorData = await loadCalculatorData({ key: first, group: second });

  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <AnswersStoreProvider>
        <AppLayout>{children}</AppLayout>
      </AnswersStoreProvider>
    </CalculatorStoreProvider>
  );
}
