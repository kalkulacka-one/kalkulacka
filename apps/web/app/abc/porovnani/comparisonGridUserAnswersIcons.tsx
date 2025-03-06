// simplify this component
import RenderAnswerIcon from "./renderAnswerIcon";

type ComparisonGridUserAnswersIconsProps = {
  questions: any[];
};

export default function ComparisonGridUserAnswersIcons({
  questions,
}: ComparisonGridUserAnswersIconsProps) {
  return (
    <>
      {questions.map((question, index) => {
        const number = index + 1;

        const getGridNumbers = (number: number) => {
          return number * 2 + 1;
        };

        const gridNumber = getGridNumbers(number);

        return (
          <div
            key={`Answer to question: ${question.id}`}
            className="sticky left-4 w-fit"
            style={{ gridArea: `${gridNumber} / 1` }}
          >
            <RenderAnswerIcon answerType={question.answerType} />
          </div>
        );
      })}
    </>
  );
}
