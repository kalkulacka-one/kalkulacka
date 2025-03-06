import RenderAnswerIcon from "./renderAnswerIcon";

type Answer = {
  comment?: string;
  answer?: boolean;
};

type CandidateAnswerProps = {
  id: string;
  gridPosition: number;
  candidatesAnswers: Record<string, Answer[]>;
};

export default function CandidateAnswer({
  id,
  gridPosition,
  candidatesAnswers,
}: CandidateAnswerProps) {
  // get answers
  const getCandidateAnswer = candidatesAnswers[id]?.map(
    (answer) => answer.answer,
  );
  // render answers
  const candidateAnswer = getCandidateAnswer?.map(
    (answer: any, index: number) => {
      const number = index + 1;
      const getGridNumbers = (number: number) => {
        return number * 2 + 1;
      };

      return (
        <div
          style={{ gridArea: `${getGridNumbers(number)} / ${gridPosition} ` }}
        >
          <RenderAnswerIcon answerType={answer} />
        </div>
      );
    },
  );
  return <>{candidateAnswer}</>;
}
