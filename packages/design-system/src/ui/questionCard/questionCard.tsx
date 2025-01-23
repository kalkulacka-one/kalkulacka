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
      color="white"
      corner="topLeft"
      className="k1-flex k1-w-auto k1-flex-col max-[575px]:k1-gap-2 k1-gap-4 sm:k1-gap-8 max-[575px]:k1-p-customMobile k1-p-customDesktop"
    >
      <div className="k1-flex k1-flex-wrap k1-items-center k1-gap-4">
        {/* font weight 400 300 issue solve */}
        <span className="k1-font-primary k1-text-sm k1-font-light">
          {currentQuestion}/{questionCount}
        </span>
        <span className="k1-text-sm k1-font-light">{title}</span>
        <Badge color="neutral">{tags}</Badge>
      </div>
      <div>
        {/* TODO: line height fix value */}
        {/* Fix left text alignment */}
        <span className="k1-text-3xl min-[701px]:k1-text-7xl k1-text-neutral-strong k1-font-bold min-[700px]:k1-leading-[1.03] k1-leading-[1.28] -k1-tracking-wider">
          {statement}
        </span>
      </div>
      <div>
        <p className="k1-text-base k1-font-light k1-leading-[1.5] k1-text-neutral">
          {detail}
        </p>
      </div>
    </Card>
  );
};

export { QuestionCard };

// TODO
// 1. Font weights bug fix!
// 2. Replace with typo components
// 3. Solve fonts issue!
