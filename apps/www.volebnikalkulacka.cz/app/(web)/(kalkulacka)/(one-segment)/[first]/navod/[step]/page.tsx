import { GuidePageWithRouting } from "../../../../../../../components/client";
import { stepGuard } from "../../../../../../../lib/routing/guards/step";

export default async function Page({ params }: { params: Promise<{ first: string; step: string }> }) {
  const { first, step } = await params;
  const stepInt = stepGuard(step);

  return <GuidePageWithRouting step={stepInt} segments={{ first }} />;
}
