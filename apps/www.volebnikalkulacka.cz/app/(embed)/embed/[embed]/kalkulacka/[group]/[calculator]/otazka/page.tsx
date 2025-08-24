import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ embed: string; group: string; calculator: string; questionStep: string }> }) {
  const { embed, group, calculator, questionStep } = await params;
  if (!questionStep) {
    redirect(`/embed/${embed}/kalkulacka/${group}/${calculator}/otazka/1`);
  }
}
