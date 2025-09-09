import { useRouter } from "next/navigation";
import { useState } from "react";

import { ResultPage as AppResultPage } from "../../../../calculator/components/server";
import { useResultViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function ResultPageWithRouting({ segments }: { segments: RouteSegments }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const router = useRouter();

  const result = useResultViewModel({ showOnlyNested });

  const handlePreviousClick = () => {
    router.push(routes.review(segments));
  };

  return (
    <>
      <label>
        <input type="checkbox" checked={showOnlyNested} onChange={(e) => setShowOnlyNested(e.target.checked)} />
        Zobrazit všechny poslance
      </label>
      <AppResultPage result={result} onPreviousClick={handlePreviousClick} />
    </>
  );
}
