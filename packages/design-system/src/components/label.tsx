import { Label as LabelHeadless, type LabelProps } from '@headlessui/react';
import React, { type Ref } from 'react';

type Props = LabelProps;

export function LabelComp({ children, ...props }: Props, ref: Ref<HTMLLabelElement>) {
  return (
    <LabelHeadless {...props} ref={ref}>
      {children}
    </LabelHeadless>
  );
}

export const Label = React.forwardRef<HTMLLabelElement, Props>(LabelComp);
