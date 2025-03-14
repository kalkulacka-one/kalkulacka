"use client";

import SelectionForm from "./selectionForm";
import DistrictHeader from "./districtHeader";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <DistrictHeader />
      <SelectionForm />
    </div>
  );
}
