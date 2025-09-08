import { useState } from "react";

import { ResultPage as AppResultPage } from "../../../../calculator/components/server";
import { useResultViewModel } from "../../../../calculator/view-models";

export function ResultPageWithRouting() {
  const [showOnlyNested, setShowOnlyNested] = useState(false);

  const result = useResultViewModel({ showOnlyNested });

  return (
    <>
      <label>
        <input type="checkbox" checked={showOnlyNested} onChange={(e) => setShowOnlyNested(e.target.checked)} />
        Zobrazit všechny poslance
      </label>
      <AppResultPage result={result} />
    </>
  );
}
