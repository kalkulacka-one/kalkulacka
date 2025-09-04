import { useRouter } from "next/navigation";

import { ReviewPage as AppReviewPage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";

export function ReviewPage({ navigationNextPath }: { navigationNextPath: () => Promise<string> }) {
  const router = useRouter();
  const calculator = useCalculatorViewModel();

  const handleNavigationNextClick = async () => {
    const nextUrl = await navigationNextPath();
    router.push(nextUrl);
  };

  return <AppReviewPage calculator={calculator} onNavigationNextClick={handleNavigationNextClick} />;
}
