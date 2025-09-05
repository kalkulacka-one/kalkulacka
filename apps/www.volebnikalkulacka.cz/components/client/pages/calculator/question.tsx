import { Button } from "@repo/design-system/client";
import { useRouter } from "next/navigation";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useQuestionViewModel } from "../../../../calculator/view-models";

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
  const question = useQuestionViewModel(current);

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
      <AppQuestionPage question={question} number={current} total={3} />
      <Button onClick={handleNavigationNextClick}>Další otázka</Button>
      <Button onClick={handleNavigationPreviousClick}>Předchozí otázka</Button>
      <Button onClick={handleNavigationReviewClick}>Rekapitulace</Button>
    </div>
  );
}
