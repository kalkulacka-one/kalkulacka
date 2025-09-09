import { useRouter } from "next/navigation";
import { useState } from "react";

import { ResultPage as AppResultPage } from "../../../../calculator/components/server";
import { useCalculatorViewModel, useResultViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function ResultPageWithRouting({ segments }: { segments: RouteSegments }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const router = useRouter();
  const calculator = useCalculatorViewModel();

  const result = useResultViewModel({ showOnlyNested });

  const handlePreviousClick = () => {
    router.push(routes.review(segments));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  return (
    <>
      <label>
        <input type="checkbox" checked={showOnlyNested} onChange={(e) => setShowOnlyNested(e.target.checked)} />
        Zobrazit všechny poslance
      </label>
      <AppResultPage calculator={calculator} result={result} onPreviousClick={handlePreviousClick} onCloseClick={handleCloseClick} />
    </>
  );
}
