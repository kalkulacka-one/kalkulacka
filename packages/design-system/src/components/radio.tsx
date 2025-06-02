import { Radio as RadioHeadless, type RadioProps } from '@headlessui/react';
import React, { type ElementType } from 'react';

const DEFAULT_RADIO_TAG_FOR_RADIO = 'span';

type Props<TTag extends ElementType = typeof DEFAULT_RADIO_TAG_FOR_RADIO, TType = string> = RadioProps<TTag, TType>;

type GenericRadioComp = <TTag extends ElementType = typeof DEFAULT_RADIO_TAG_FOR_RADIO, TType = string>(props: Props<TTag, TType> & React.RefAttributes<HTMLElement>) => React.ReactNode;

export function RadioComp<TTag extends ElementType = typeof DEFAULT_RADIO_TAG_FOR_RADIO, TType = string>({ children, ...props }: Props<TTag, TType>, ref: React.Ref<HTMLElement>) {
  return (
    <RadioHeadless {...props} ref={ref}>
      {children}
    </RadioHeadless>
  );
}

export const Radio: GenericRadioComp = React.forwardRef(RadioComp);

// import { Radio as RadioHeadless, type RadioProps } from '@headlessui/react';
// import React, { type Ref } from 'react';

// type Props = RadioProps;

// export function RadioComp({ children, ...props }: Props, ref: React.Ref<HTMLInputElement>) {
//   return (
//     <RadioHeadless {...props} ref={ref}>
//       {children}
//     </RadioHeadless>
//   );
// }

// export const Radio = React.forwardRef<HTMLInputElement, Props>(RadioComp);
