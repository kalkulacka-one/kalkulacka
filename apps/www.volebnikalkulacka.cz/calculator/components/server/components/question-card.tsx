import { Card, Pill, Typography } from "@repo/design-system/server";

import type { Question } from "../../../../../../packages/schema/schemas/question.schema";
import type { Tag } from "../../../../../../packages/schema/schemas/tags.schema";

export type QuestionCard = {
  question: Question;
  questionCurrent: number;
  questionTotal: number;
};

export function QuestionCard({ question, questionCurrent, questionTotal }: QuestionCard) {
  const { title, tags, detail, statement } = question;
  return (
    <Card corner="topLeft">
      <div className="flex flex-col gap-6 sm:gap-8 p-6 sm:p-10">
        {/* Header section with question counter, title and tags */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Question counter */}
          <Typography size="base" className="text-neutral whitespace-nowrap flex-shrink-0">
            {questionCurrent}/{questionTotal}
          </Typography>

          {/* Question title/category */}
          {title && (
            <Typography as="h2" size="base" className="text-neutral whitespace-normal flex-shrink-0">
              {title}
            </Typography>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: Tag) => (
                <Pill key={tag} size="medium" variant="subtle" rounded="md">
                  {tag}
                </Pill>
              ))}
            </div>
          )}
        </div>

        {/* Main statement */}
        <Typography as="h3" size="3xl" weight="bold" leading="tight">
          {statement}
        </Typography>

        {/* Detail/explanation section */}
        {detail && (
          <Typography as="p" size="base" className="text-neutral" leading="relaxed">
            {detail}
          </Typography>
        )}
      </div>
    </Card>
  );
}
