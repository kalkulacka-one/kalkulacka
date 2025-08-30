import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; questionNumber: string }> }) {
  const { embed, first, second, questionNumber } = await params;
  if (!questionNumber) {
    redirect(`/embed/${embed}/${first}/${second}/otazka/1`);
  }
}
