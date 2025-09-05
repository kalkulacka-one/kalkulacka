import { notFound, useRouter } from "next/navigation";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useQuestionsViewModel } from "../../../../calculator/view-models";

export function QuestionPage({
  current,
  nextQuestionPath,
  previousQuestionPath,
  guidePath,
  reviewPath,
}: {
  current: number;
  nextQuestionPath: (current: number) => Promise<string>;
  previousQuestionPath: (current: number) => Promise<string>;
  guidePath: () => Promise<string>;
  reviewPath: () => Promise<string>;
}) {
  const router = useRouter();
  const { questions, total } = useQuestionsViewModel();
  const question = questions[current - 1];

  if (!question) {
    notFound();
  }

  const handleNavigationNextClick = async () => {
    const path = await nextQuestionPath(current);
    if (current < total) {
      router.push(path);
    } else {
      const review = await reviewPath();
      router.push(review);
    }
  };

  const handleNavigationPreviousClick = async () => {
    const path = await previousQuestionPath(current);
    if (current === 1) {
      const guide = await guidePath();
      router.push(guide);
    } else {
      router.push(path);
    }
  };

  return (
    <div>
      <AppQuestionPage question={question} number={current} total={total} onPreviousClick={handleNavigationPreviousClick} onNextClick={handleNavigationNextClick} />
    </div>
  );
}
