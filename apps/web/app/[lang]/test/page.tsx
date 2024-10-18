"use client";

import { BadgeStarIcon } from "@repo/design-system/demo";
import { InputField } from "@repo/design-system/ui";

export default function Page() {
  return (
    <div className="w-full min-h-80 flex flex-col p-10 justify-center items-center gap-4">
      <InputField label="Full Name" icon={BadgeStarIcon} />
      <InputField label="Full Name" icon={BadgeStarIcon} error="Test error" />
      <InputField
        label="Full Name"
        icon={BadgeStarIcon}
        showClearButton={true}
        required
      />
      <InputField label="Full Name" showClearButton={true} required />
    </div>
  );
}
