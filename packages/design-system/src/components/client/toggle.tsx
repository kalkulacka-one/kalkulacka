import { Switch as SwitchHeadless, type SwitchProps as SwitchHeadlessProps } from "@headlessui/react";
import { ButtonVariants } from "@repo/design-system/client";
import { twMerge } from "@repo/design-system/utils";
import type { VariantProps } from "class-variance-authority";
import React from "react";

export type Toggle = Omit<SwitchHeadlessProps<"button">, "className"> & VariantProps<typeof ButtonVariants>;

function ToggleComponent({ children, size, variant, color, ...props }: Toggle, ref: React.Ref<HTMLButtonElement>) {
  return (
    <SwitchHeadless ref={ref} className={twMerge(ButtonVariants({ size, variant, color }))} {...props}>
      {children}
    </SwitchHeadless>
  );
}

export const Toggle = React.forwardRef(ToggleComponent);
