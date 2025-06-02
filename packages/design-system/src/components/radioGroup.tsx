import { RadioGroup as RadioGroupHeadless, type RadioGroupProps } from '@headlessui/react';
import type { Ref } from 'react';
import React from 'react';

type Props = RadioGroupProps;

export function RadioGroupComp({ children, value, onChange, ...props }: Props, ref: Ref<HTMLElement>) {
  return (
    <RadioGroupHeadless {...props} ref={ref} value={value} onChange={onChange}>
      {children}
    </RadioGroupHeadless>
  );
}

export const RadioGroup = React.forwardRef<HTMLElement, Props>(RadioGroupComp);
