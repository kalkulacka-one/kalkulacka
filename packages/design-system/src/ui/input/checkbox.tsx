import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { CheckedIcon } from "../../icons/checkbox/checkedIcon";
import { InterdermineIcon } from "../../icons/checkbox/interdetermineIcon";
import { EmptyCheckBoxIcon } from "../../";
import { useState } from "react";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive>
>(({ className, ...props }, ref) => {
  const [enabled, setEnabled] = React.useState(true);

  // Possible states: "unchecked", "checked", "delete"
  const [checkboxState, setCheckboxState] = useState("unchecked");

  const handleClick = () => {
    if (checkboxState === "unchecked") {
      setCheckboxState("checked");
    } else if (checkboxState === "checked") {
      setCheckboxState("delete");
    } else {
      setCheckboxState("unchecked");
    }
  };
  return (
    <CheckboxPrimitive
      ref={ref}
      checked={enabled}
      onChange={setEnabled}
      className={twMerge("", className)}
      {...props}
      onClick={handleClick}
      data-checked={checkboxState === "checked" ? true : undefined}
    >
      {checkboxState === "unchecked" && (
        <EmptyCheckBoxIcon className="k1-w-6 k1-h-6 k1-min-w-6" />
      )}
      {checkboxState === "checked" && (
        <CheckedIcon className="k1-w-6 k1-h-6 k1-min-w-6" />
      )}
      {checkboxState === "delete" && (
        <InterdermineIcon className="k1-w-6 k1-h-6 k1-min-w-6" />
      )}
    </CheckboxPrimitive>
  );
});
Checkbox.displayName = CheckboxPrimitive.displayName;

export { Checkbox };
