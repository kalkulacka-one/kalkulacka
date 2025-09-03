import { GuidePage } from "../../../../../../../../../components/client";
import { stepGuard } from "../../../../../../../../../lib/routing/guards/step";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; step: string }> }) {
  const { embed, first, second, step } = await params;
  const stepInt = stepGuard(step);

  const navigationNextPath = async (currentStep: 1 | 2) => {
    "use server";
    if (currentStep === 1) {
      return `/embed/${embed}/${first}/${second}/navod/2`;
    }
    return `/embed/${embed}/${first}/${second}/otazka`;
  };

  return <GuidePage step={stepInt} navigationNextPath={navigationNextPath} />;
}
