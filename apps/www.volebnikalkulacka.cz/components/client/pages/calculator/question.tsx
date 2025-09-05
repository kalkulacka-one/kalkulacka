import { notFound, useRouter } from "next/navigation";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useQuestionsViewModel } from "../../../../calculator/view-models";
import { createBaseSegment } from "../../../../lib/routing/path-config";

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: { first: string; second?: string; embed?: string } }) {
  const router = useRouter();
  const { questions, total } = useQuestionsViewModel();
  const baseSegment = createBaseSegment(segments);
  const question = questions[current - 1];

  if (!question) {
    notFound();
  }

  const handleNextClick = () => {
    if (current < total) {
      router.push(`/${baseSegment}/otazka/${current + 1}`);
    } else {
      router.push(`/${baseSegment}/rekapitulace`);
    }
  };

  const handlePreviousClick = () => {
    if (current === 1) {
      router.push(`/${baseSegment}/navod/2`);
    } else {
      router.push(`/${baseSegment}/otazka/${current - 1}`);
    }
  };

  return (
    <div>
      <AppQuestionPage question={question} number={current} total={total} onPreviousClick={handlePreviousClick} onNextClick={handleNextClick} />
    </div>
  );
}
