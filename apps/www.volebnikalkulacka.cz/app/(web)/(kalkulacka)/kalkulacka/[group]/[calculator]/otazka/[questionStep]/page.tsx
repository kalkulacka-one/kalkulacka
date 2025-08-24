import { notFound } from "next/navigation";
import OtazkaPage from "../../../../../../../../calculator/components/otazka/otazkaPage";
export default async function Page({ params }: { params: Promise<{ questionStep: string }> }) {
  const questionStepInt = Number.parseInt((await params).questionStep);
  if (Number.isNaN(questionStepInt)) {
    notFound();
  }
  return <OtazkaPage questionStep={questionStepInt} />;
}
