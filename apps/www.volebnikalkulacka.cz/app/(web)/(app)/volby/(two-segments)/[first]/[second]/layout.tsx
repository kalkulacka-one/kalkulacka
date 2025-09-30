import { loadCalculatorData } from "../../../../../../../calculator/lib";
import { SessionProviderLayout } from "../../../../../../../components/client";
import { getSessionCookie } from "../../../../../../../lib/session";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  const calculatorData = await loadCalculatorData({ key: first, group: second });
  const sessionCookie = await getSessionCookie();
  const sessionId = sessionCookie?.id;

  return (
    <SessionProviderLayout calculatorData={calculatorData} sessionId={sessionId}>
      {children}
    </SessionProviderLayout>
  );
}
