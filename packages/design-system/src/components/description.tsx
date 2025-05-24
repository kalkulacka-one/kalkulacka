import { Description as DescriptionHeadless, type DescriptionProps } from '@headlessui/react';
import React, { type ElementType } from 'react';

const DEFAULT_DESCRIPTION_TAG = 'p';

type Props<TTag extends ElementType = typeof DEFAULT_DESCRIPTION_TAG, TType = string> = DescriptionProps<TTag>;

type GenericDescriptionComp = <TTag extends ElementType = typeof DEFAULT_DESCRIPTION_TAG>(props: Props<TTag> & React.RefAttributes<HTMLElement>) => React.ReactNode;

export function DescriptionComp<TTag extends ElementType = typeof DEFAULT_DESCRIPTION_TAG>({ children, ...props }: Props<TTag>, ref: React.Ref<HTMLElement>) {
  return (
    <DescriptionHeadless {...props} ref={ref}>
      {children}
    </DescriptionHeadless>
  );
}

export const Description: GenericDescriptionComp = React.forwardRef(DescriptionComp);
