import { notFound } from "next/navigation";
export default async function Page({ params }: { params: Promise<{ questionStep: string }> }) {
  const questionStepInt = Number.parseInt((await params).questionStep);
  if (Number.isNaN(questionStepInt)) {
    notFound();
  }
  return <h2>Otázka, questionStep {questionStepInt}</h2>;
}
