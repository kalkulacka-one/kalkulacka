import { notFound } from "next/navigation";
import { OtazkaPage } from "../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ questionNumber: string }> }) {
  const questionNumberInt = Number.parseInt((await params).questionNumber);
  if (Number.isNaN(questionNumberInt)) {
    notFound();
  }
  return <OtazkaPage questionNumber={questionNumberInt} />;
}
