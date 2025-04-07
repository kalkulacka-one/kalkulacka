import {
  RadioGroup as HeadlessRadioGroup,
  type RadioGroupProps as HeadlessRadioGroupProps,
} from "@headlessui/react";
import React from "react";

type RadioGroupProps = {
  children: React.ReactNode;
} & HeadlessRadioGroupProps;

function RadioGroupComponent(
  { children, ...props }: RadioGroupProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <HeadlessRadioGroup ref={ref} {...props}>
      {children}
    </HeadlessRadioGroup>
  );
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  RadioGroupComponent,
);

export { RadioGroup };
