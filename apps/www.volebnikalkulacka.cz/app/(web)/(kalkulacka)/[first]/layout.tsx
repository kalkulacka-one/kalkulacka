import { loadCalculatorData } from "../../../../calculator/common/";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ first: string }> }) {
  const { first } = await params;
  const calculatorData = await loadCalculatorData(first);
  console.log("From first:", calculatorData);
  return (
    <section>
      <p>First: `{first}`</p>
      <main>{children}</main>
    </section>
  );
}
