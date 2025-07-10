import { Switch as SwitchHeadless, type SwitchProps as SwitchPropsHeadless } from "@headlessui/react";
import { Button } from "@repo/design-system/client";
import React from "react";
import { useState } from "react";

export type ToggleButton = {
  children: React.ReactNode;
} & SwitchPropsHeadless;

function ToggleButtonComponent({ children, ...props }: ToggleButton, ref: React.Ref<HTMLButtonElement>) {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <SwitchHeadless ref={ref} checked={enabled} onChange={setEnabled} className="ko:group ko:flex ko:gap-4" {...props}>
        <button
          type="button"
          className="ko:border-2 ko:border-primary ko:px-4 ko:py-2 ko:text-primary ko:group-hover:bg-primary ko:group-hover:text-on-bg-primary ko:group-data-checked:bg-primary ko:group-data-checked:text-on-bg-primary ko:group-data-active:bg-primary-active ko:group-data-active:border-primary-active ko:group-data-active:hover:bg-primary-active"
        >
          Test Button
        </button>
        {children}
      </SwitchHeadless>
    </>
  );
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButton>(ToggleButtonComponent);
