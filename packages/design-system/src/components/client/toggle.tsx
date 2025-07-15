import { Switch as SwitchHeadless, type SwitchProps as SwitchPropsHeadless } from "@headlessui/react";
import React from "react";
import { useState } from "react";

export type Toggle = {
  children: React.ReactNode;
} & SwitchPropsHeadless;

function ToggleComponent({ children, ...props }: Toggle, ref: React.Ref<HTMLButtonElement>) {
  const [enabled, setEnabled] = useState(false);
  return (
    <SwitchHeadless ref={ref} checked={enabled} onChange={setEnabled} className="ko:group ko:flex ko:gap-4" {...props}>
      {children}
    </SwitchHeadless>
  );
}

export const Toggle = React.forwardRef<HTMLButtonElement, Toggle>(ToggleComponent);
