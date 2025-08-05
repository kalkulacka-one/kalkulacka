import { Card } from "@repo/design-system/server";

// temporary type
type Question = {
  id: string;
  title: string;
  statement: string;
  detail: string;
  tags: string[];
};

export type QuestionCard = {
  question: Question;
  questionCurrent: number;
  questionTotal: number;
};

export function QuestionCard({ question, questionCurrent, questionTotal }: QuestionCard) {
  const { title, tags, detail, statement } = question;
  return (
    <Card corner="topLeft">
      <div className="ko:flex ko:flex-col ko:gap-4">
        <div className="ko:flex ko:gap-2">
          <span>
            {questionCurrent}/{questionTotal}
          </span>
          <span>{title}</span>
          <span>{tags}</span>
        </div>
        <h2>{statement}</h2>
        <span>{detail}</span>
      </div>
    </Card>
  );
}
