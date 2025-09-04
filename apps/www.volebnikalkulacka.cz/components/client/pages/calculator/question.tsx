import { useRouter } from "next/navigation";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";

export function QuestionPage({
  questionNumber,
  navigationNextPath,
  navigationPreviousPath,
  navigationResultsPath,
}: {
  questionNumber: number;
  navigationNextPath: (currentQuestionNumber: number) => Promise<string>;
  navigationPreviousPath: (currentQuestionNumber: number) => Promise<string>;
  navigationResultsPath: () => Promise<string>;
}) {
  const router = useRouter();
  const calculator = useCalculatorViewModel();

  const handleNavigationNextClick = async () => {
    const nextUrl = await navigationNextPath(questionNumber);
    router.push(nextUrl);
  };

  const handleNavigationPreviousClick = async () => {
    const previousUrl = await navigationPreviousPath(questionNumber);
    router.push(previousUrl);
  };

  const handleNavigationResultsClick = async () => {
    const resultsUrl = await navigationResultsPath();
    router.push(resultsUrl);
  };

  return (
    <AppQuestionPage
      calculator={calculator}
      questionNumber={questionNumber}
      onNavigationNextClick={handleNavigationNextClick}
      onNavigationPreviousClick={handleNavigationPreviousClick}
      onNavigationResultsClick={handleNavigationResultsClick}
    />
  );
}
