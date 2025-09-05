import { notFound } from "next/navigation";

import { GuidePage } from "../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ step: string }> }) {
  const stepInt = Number.parseInt((await params).step);
  if (Number.isNaN(stepInt) || (stepInt !== 1 && stepInt !== 2)) {
    notFound();
  }
  return <GuidePage step={stepInt as 1 | 2} />;
}
