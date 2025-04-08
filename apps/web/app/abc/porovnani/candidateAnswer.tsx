import AnswerIcon from "./answerIcon";

type Answer = {
  comment?: string;
  answer?: boolean;
};

type CandidateAnswerProps = {
  id: string;
  gridCol: number;
  candidatesAnswers: Record<string, Answer[]>;
};

export default function CandidateAnswer({
  id,
  gridCol,
  candidatesAnswers,
}: CandidateAnswerProps) {
  const candidateAnswer = candidatesAnswers[id] || [];
  return (
    <>
      {candidateAnswer.map((answer, index) => {
        const number = index + 1;
        const getGridNumbers = (number: number) => number * 2 + 1;
        return (
          <div
            key={`Candidate answer ${number}`}
            style={{ gridArea: `${getGridNumbers(number)} / ${gridCol} ` }}
          >
            <AnswerIcon answerType={answer.answer} />
          </div>
        );
      })}
    </>
  );
}
