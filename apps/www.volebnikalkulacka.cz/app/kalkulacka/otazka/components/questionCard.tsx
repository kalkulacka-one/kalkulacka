import { Card } from "@repo/design-system/server";

export type QuestionCard = {
  question: any[];
  children?: React.ReactNode;
  questionCurrent: number;
  questionTotal: number;
};

export function QuestionCard({ questionCurrent, questionTotal, question }: QuestionCard) {
  return (
    <Card>
      <div className="p-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <span>
              {questionCurrent}/{questionTotal}
            </span>
            <span>{question[questionCurrent - 1]?.title}</span>
            <span>{question[questionCurrent - 1]?.tags}</span>
          </div>
          <h2 className="text-4xl font-bold">{question[questionCurrent - 1]?.statement}</h2>
          <span>{question[questionCurrent - 1]?.detail}</span>
        </div>
      </div>
    </Card>
  );
}
