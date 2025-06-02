import { Legend as LegendHeadless, type LegendProps as LegendPropsHeadless } from '@headlessui/react';

type Props = LegendPropsHeadless;

export function Legend({ children, ...props }: Props) {
  return <LegendHeadless {...props}>{children}</LegendHeadless>;
}

// 1. refs fix

// import { Legend as LegendHeadless, type LegendProps } from '@headlessui/react';
// import React, { type ElementType } from 'react';

// const DEFAULT_LEGEND_TAG = import('/Users/michalwierzgon/Documents/dev/kalkulacka/node_modules/@headlessui/react/dist/components/label/label.js')._internal_ComponentLabel;

// type Props<TTag extends ElementType = typeof DEFAULT_LEGEND_TAG> = LegendProps<TTag>;

// type GenericLegendComp = <TTag extends ElementType = typeof DEFAULT_LEGEND_TAG>(props: Props<TTag> & React.RefAttributes<HTMLElement>) => React.ReactNode;

// export function LegendComp({ children, ...props }: Props<TTag>, ref: React.Ref<HTMLElement>) {
//   return (
//     <LegendHeadless {...props} ref={ref}>
//       {children}
//     </LegendHeadless>
//   );
// }

// export const Legend: GenericLegendComp = React.forwardRef(LegendComp);

// // 1. refs fix
