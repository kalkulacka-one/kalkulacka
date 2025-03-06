import { Card } from "@repo/design-system/ui";

type Answer = {
  comment?: string;
  answer?: boolean;
};

type CandidateCommentProps = {
  id: string;
  gridPosition: number;
  candidatesAnswers: Record<string, Answer[]>;
};

export default function CandidateComment({
  id,
  gridPosition,
  candidatesAnswers,
}: CandidateCommentProps) {
  const candidateComment = candidatesAnswers[id]?.map((answer, index) => {
    const number = index + 1;
    const getGridNumbers = (number: number) => {
      return number * 2 + 1;
    };
    if (answer.comment) {
      return (
        <div
          key={index}
          style={{ gridArea: `${getGridNumbers(number)} / ${gridPosition} ` }}
        >
          <Card
            border="none"
            className="ml-[calc(-1*1rem)] mt-[calc(2.5rem/2)] max-w-[calc(6*2rem)] break-words p-4"
          >
            <p className="text-sm font-light leading-[1.23]">
              {answer.comment}
            </p>
          </Card>
        </div>
      );
    }
    return undefined;
  });
  return <>{candidateComment}</>;
}
