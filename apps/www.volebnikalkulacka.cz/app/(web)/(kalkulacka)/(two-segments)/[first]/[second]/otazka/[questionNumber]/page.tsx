import { notFound } from "next/navigation";

import { QuestionPage } from "../../../../../../../../components/server";

export default async function Page({ params }: { params: Promise<{ questionNumber: string }> }) {
  const questionNumberInt = Number.parseInt((await params).questionNumber);
  if (Number.isNaN(questionNumberInt)) {
    notFound();
  }
  return <QuestionPage questionNumber={questionNumberInt} />;
}
