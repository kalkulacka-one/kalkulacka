import { notFound, useRouter } from "next/navigation";

import { Button } from "@repo/design-system/client";
import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useQuestionsViewModel } from "../../../../calculator/view-models";

export function QuestionPage({
  current,
  navigationNextPath,
  navigationPreviousPath,
  navigationReviewPath,
}: {
  current: number;
  navigationNextPath: (current: number) => Promise<string>;
  navigationPreviousPath: (current: number) => Promise<string>;
  navigationReviewPath: () => Promise<string>;
}) {
  const router = useRouter();
  const { questions, total } = useQuestionsViewModel();
  const question = questions[current - 1];

  if (!question) {
    notFound();
  }

  const handleNavigationNextClick = async () => {
    const path = await navigationNextPath(current);
    router.push(path);
  };

  const handleNavigationPreviousClick = async () => {
    const path = await navigationPreviousPath(current);
    router.push(path);
  };

  const handleNavigationReviewClick = async () => {
    const path = await navigationReviewPath();
    router.push(path);
  };

  return (
    <div>
      <AppQuestionPage question={question} number={current} total={total} />
      <Button onClick={handleNavigationNextClick}>Další otázka</Button>
      <Button onClick={handleNavigationPreviousClick}>Předchozí otázka</Button>
      <Button onClick={handleNavigationReviewClick}>Rekapitulace</Button>
    </div>
  );
}
