import { Card } from "@repo/design-system/ui";
import { Badge } from "@repo/design-system/badge";
import type { Question } from "@repo/schema/dist/question.schema";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null | undefined;
};

export interface QuestionCardProps {
  question: ExtendedQuestions;
  currentQuestion: number;
  questionCount: number;
}

const QuestionCard = ({
  question,
  currentQuestion,
  questionCount,
}: QuestionCardProps) => {
  const { id, title, statement, detail, tags } = question;
  return (
    <Card
      id={id}
      color="white"
      corner="topLeft"
      className="k1-flex k1-w-auto k1-flex-col k1-gap-4 k1-p-customDesktop max-[575px]:k1-gap-2 max-[575px]:k1-p-customMobile sm:k1-gap-8"
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
        <span className="k1-text-3xl k1-font-bold k1-leading-[1.28] -k1-tracking-wider k1-text-neutral-strong min-[700px]:k1-leading-[1.03] min-[701px]:k1-text-7xl">
          {statement}
        </span>
      </div>
      <div>
        <p className="k1-text-base k1-font-light k1-leading-normal k1-text-neutral">
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
