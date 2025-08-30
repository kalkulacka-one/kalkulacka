import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; questionNumber: string }> }) {
  const { first, second, questionNumber } = await params;
  if (!questionNumber) {
    redirect(`/${first}/${second}/otazka/1`);
  }
}
