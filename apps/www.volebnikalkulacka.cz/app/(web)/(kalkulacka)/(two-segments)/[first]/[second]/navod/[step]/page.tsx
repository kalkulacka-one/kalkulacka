import { GuidePageWithRouting } from "../../../../../../../../components/client";
import { stepGuard } from "../../../../../../../../lib/routing/guards/step";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; step: string }> }) {
  const { first, second, step } = await params;
  const stepInt = stepGuard(step);

  return <GuidePageWithRouting step={stepInt} segments={{ first, second }} />;
}
