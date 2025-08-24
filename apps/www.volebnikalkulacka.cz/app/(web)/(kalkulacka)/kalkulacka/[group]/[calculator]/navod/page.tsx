import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ group: string; calculator: string; guideStep: string }> }) {
  const { group, calculator, guideStep } = await params;
  if (!guideStep) {
    redirect(`/kalkulacka/${group}/${calculator}/navod/1`);
  }
}
