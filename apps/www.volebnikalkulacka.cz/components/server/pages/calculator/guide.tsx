"use client";

import { useParams, useRouter } from "next/navigation";

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
  const router = useRouter();
  const params = useParams();

  const handleNavigationClick = () => {
    if (step === 1) {
      router.push(`/${params.first}/${params.second}/navod/2`);
    } else if (step === 2) {
      router.push(`/${params.first}/${params.second}/otazka`);
    }
  };

  return <AppGuidePage onNavigationClick={handleNavigationClick} calculator={data} step={step} />;
}
