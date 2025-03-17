"use client";

import DistrictHeader from "./districtHeader";
import districts from "./districts.json";
import { DistrictSelectionForm } from "@repo/design-system/ui";

const title = "Zvolte svůj kraj";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <DistrictHeader title={title} />
      <DistrictSelectionForm options={districts} formLabel={title} />
    </div>
  );
}
