import { QuestionUrlSynchronizer } from "../../../../../../../calculator/components/client";

export default async function QuestionLayout({ children, params }: { children: React.ReactNode; params: Promise<{ questionNumber: string }> }) {
  const questionNumberInt = Number.parseInt((await params).questionNumber);

  return (
    <>
      <QuestionUrlSynchronizer questionNumber={questionNumberInt} />
      {children}
    </>
  );
}
