import { Card } from "@repo/design-system/ui";
import { Badge } from "@repo/design-system/badge";
import type { Question } from "@repo/schema/dist/question.schema";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null | undefined;
};

export interface Props {
  question: ExtendedQuestions;
  currentQuestion: number;
  questionCount: number;
}

const QuestionCard = ({ question, currentQuestion, questionCount }: Props) => {
  const { id, title, statement, detail, tags } = question;
  return (
    <Card
      id={id}
      corner="topLeft"
      className="k1-flex k1-w-auto k1-flex-col k1-gap-4 k1-p-customMobile md:k1-p-customDesktop"
    >
      <div className="k1-flex k1-flex-wrap k1-items-center k1-gap-4">
        <span className="k1-text-sm k1-font-normal">
          {currentQuestion}/{questionCount}
        </span>
        <span className="k1-text-sm k1-font-normal">{title}</span>
        <Badge>{tags}</Badge>
      </div>
      <div>
        {/* TODO: line height fix value */}
        <span className="k1-text-2xl k1-font-bold k1-leading-6 k1-tracking-tighter md:k1-text-4xl">
          {statement}
        </span>
      </div>
      <div>
        <p className="k1-text-base k1-font-normal k1-text-neutral">{detail}</p>
      </div>
    </Card>
  );
};

export { QuestionCard };
