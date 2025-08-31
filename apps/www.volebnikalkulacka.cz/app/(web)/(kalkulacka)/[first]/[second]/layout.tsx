import { loadCalculatorData } from "../../../../../calculator/common";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  const calculatorData = await loadCalculatorData(first, second);
  console.log("From second:", calculatorData);

  return (
    <section>
      <p>Second: `{second}`</p>
      <main>{children}</main>
    </section>
  );
}
