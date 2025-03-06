import { Badge } from "@repo/design-system/badge";
import { Card } from "@repo/design-system/ui";

type ComparisonGridCardProps = {
  questions: any[];
};

export default function ComparisonGridCard({
  questions,
}: ComparisonGridCardProps) {
  return (
    <>
      {questions.map((question, index) => {
        return (
          <Card
            key={question.id}
            corner="topLeft"
            className="sticky left-4 flex max-w-[calc(100vw-1rem)] flex-col justify-self-start p-4"
            style={{ gridArea: `${(index + 1) * 2} / 1 / auto / span 28` }}
          >
            <div className="flex items-center gap-4">
              <p className="font-primary text-sm font-light">
                {index + 1}/{questions.length}
              </p>
              <p className="text-sm font-light">{question.title}</p>
              <Badge color="neutral">{question.tags}</Badge>
            </div>
            <div>
              <span className="text-3xl font-bold leading-[1.28] tracking-slight-tight">
                {question.statement}
              </span>
            </div>
          </Card>
        );
      })}
    </>
  );
}
