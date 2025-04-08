import ComparisonGridUserCircleBadge from "./comparisonGridUserCircleBadge";
import ComparisonGridUserAnswersIcons from "./comparisonGridUserAnswersIcons";

type ComparisonGridUserProps = {
  questions: any[];
};

export default function ComparisonGridUser({
  questions,
}: ComparisonGridUserProps) {
  return (
    <>
      <ComparisonGridUserCircleBadge />
      <ComparisonGridUserAnswersIcons questions={questions} />
    </>
  );
}
