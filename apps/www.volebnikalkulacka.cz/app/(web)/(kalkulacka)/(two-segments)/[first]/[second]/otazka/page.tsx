import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ first: string; questionNumber: string }> }) {
  const { first, questionNumber } = await params;
  if (!questionNumber) {
    redirect(`/${first}/otazka/1`);
  }
}
