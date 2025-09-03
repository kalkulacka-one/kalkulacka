import { GuidePage } from "../../../../../../../components/client";
import { stepGuard } from "../../../../../../../lib/routing/guards/step";

export default async function Page({ params }: { params: Promise<{ first: string; step: string }> }) {
  const { first, step } = await params;
  const stepInt = stepGuard(step);

  const navigationNextPath = (currentStep: 1 | 2) => {
    if (currentStep === 1) {
      return `/${first}/navod/2`;
    }
    return `/${first}/otazka`;
  };

  return <GuidePage step={stepInt} navigationNextPath={navigationNextPath} />;
}
