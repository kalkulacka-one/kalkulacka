import { Fieldset as FieldsetHeadlessOriginal, type FieldsetProps } from '@headlessui/react';
import React, { type Ref } from 'react';

type Props = FieldsetProps;

const FieldsetHeadless = FieldsetHeadlessOriginal as React.ForwardRefExoticComponent<FieldsetProps & React.RefAttributes<HTMLFieldSetElement>>;
export function FieldsetComp({ children, ...props }: Props, ref: Ref<HTMLFieldSetElement>) {
  return (
    <FieldsetHeadless {...props} ref={ref}>
      {children}
    </FieldsetHeadless>
  );
}

export const Fieldset = React.forwardRef<HTMLFieldSetElement, Props>(FieldsetComp);
