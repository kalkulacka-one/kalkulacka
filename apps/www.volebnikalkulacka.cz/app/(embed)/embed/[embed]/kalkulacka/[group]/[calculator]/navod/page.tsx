import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ embed: string; group: string; calculator: string; guideStep: string }> }) {
  const { embed, group, calculator, guideStep } = await params;
  if (!guideStep) {
    redirect(`/embed/${embed}/kalkulacka/${group}/${calculator}/navod/1`);
  }
}
