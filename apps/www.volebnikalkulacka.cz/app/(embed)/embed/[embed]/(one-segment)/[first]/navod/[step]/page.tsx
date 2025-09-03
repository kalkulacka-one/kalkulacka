import { GuidePage } from "../../../../../../../../components/client";
import { stepGuard } from "../../../../../../../../lib/routing/guards/step";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; step: string }> }) {
  const { embed, first, step } = await params;
  const stepInt = stepGuard(step);

  const navigationNextPath = (currentStep: 1 | 2) => {
    if (currentStep === 1) {
      return `/embed/${embed}/${first}/navod/2`;
    }
    return `/embed/${embed}/${first}/otazka`;
  };

  return <GuidePage step={stepInt} navigationNextPath={navigationNextPath} />;
}
