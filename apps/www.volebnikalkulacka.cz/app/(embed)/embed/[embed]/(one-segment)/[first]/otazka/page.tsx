import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; questionNumber: string }> }) {
  const { embed, first, questionNumber } = await params;
  if (!questionNumber) {
    redirect(`/embed/${embed}/${first}/otazka/1`);
  }
}
