import { mdiChevronDown, mdiStar, mdiStarOutline } from "@mdi/js";
import { Button } from "@repo/design-system/client";
import { Icon } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";

// temporary type
type Question = {
  id: string;
  title: string;
  statement: string;
  detail: string;
  tags: string[];
  isImportant: boolean;
};

export type RecapQuestionCard = {
  question: Question;
  questionCurrent: number;
  questionTotal: number;
};

export function RecapQuestionCard({ question, questionCurrent, questionTotal }: RecapQuestionCard) {
  const { id, title, statement, detail, tags, isImportant } = question;
  return (
    <Card corner="topLeft">
      <details className="ko:group">
        <summary className="ko:flex ko:list-none ko:[&::-webkit-details-marker]:hidden ko:items-center ko:gap-4">
          <button type="button">
            <Icon size="large" icon={isImportant ? mdiStar : mdiStarOutline} decorative={true} className={`${isImportant && "ko:text-yellow"}`} />
          </button>

          <div className="ko:flex ko:flex-col ko:gap-2 ko:flex-grow-1">
            <div className="ko:flex ko:gap-2">
              <span>
                {questionCurrent}/{questionTotal}
              </span>
              <span>{title}</span>
              <span>{tags}</span>
            </div>
            <h2>{statement}</h2>
          </div>
          <div>
            <Button variant="filled" color="neutral">
              /
            </Button>
          </div>
          <div className="ko:group-open:-rotate-180 ko:cursor-pointer">
            <Icon icon={mdiChevronDown} decorative={true} />
          </div>
        </summary>
        <div className="ko:flex ko:flex-col">
          <div className="ko:flex">
            <Button variant="filled" color="primary">
              Ano
            </Button>
            <Button variant="filled" color="secondary">
              Ne
            </Button>
          </div>
          <span>{detail}</span>
        </div>
      </details>
    </Card>
  );
}
