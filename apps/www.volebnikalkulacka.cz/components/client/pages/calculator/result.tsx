import { ResultPage as AppResultPage } from "../../../../calculator/components/server";
import { useResultViewModel } from "../../../../calculator/view-models";

export function ResultPageWithRouting() {
  const result = useResultViewModel();

  return <AppResultPage result={result} />;
}
