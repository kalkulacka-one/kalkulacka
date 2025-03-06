"use client";

import ComparisonHeader from "./comparisonHeader";
import ComparisonGrid from "./comparisonGrid";

export default function Page() {
  return (
    <div className="flex flex-col">
      <ComparisonHeader />
      <ComparisonGrid />
    </div>
  );
}
