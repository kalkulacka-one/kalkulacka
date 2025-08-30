import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";

const data = {
  id: "00000000-0000-0000-0000-000000000000",
  createdAt: new Date(0).toISOString(),
  key: "kalkulacka",
  shortTitle: "Sněmovní 2025",
  title: "Volební kalkulačka pro sněmovní volby 2025",
  intro: "Čeká vás 35 otázek, na které jsme se zeptali všech 26 kandidujících subjektů.",
} satisfies Calculator;

export function GuidePage({ step }: { step: number }) {
  return <AppGuidePage calculator={data} step={step} />;
}
