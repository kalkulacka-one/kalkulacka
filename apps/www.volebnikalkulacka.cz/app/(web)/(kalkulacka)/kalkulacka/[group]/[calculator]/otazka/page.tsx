import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ group: string; calculator: string; questionStep: string }> }) {
  const { group, calculator, questionStep } = await params;
  if (!questionStep) {
    redirect(`/kalkulacka/${group}/${calculator}/otazka/1`);
  }
}
