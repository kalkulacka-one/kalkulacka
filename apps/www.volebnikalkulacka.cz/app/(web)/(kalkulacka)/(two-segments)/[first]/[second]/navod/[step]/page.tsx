import { GuidePage } from "../../../../../../../../components/client";
import { stepGuard } from "../../../../../../../../lib/routing/guards/step";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; step: string }> }) {
  const { first, second, step } = await params;
  const stepInt = stepGuard(step);

  const navigationNextPath = async (currentStep: 1 | 2) => {
    "use server";
    if (currentStep === 1) {
      return `/${first}/${second}/navod/2`;
    }
    return `/${first}/${second}/otazka`;
  };

  return <GuidePage step={stepInt} navigationNextPath={navigationNextPath} />;
}
