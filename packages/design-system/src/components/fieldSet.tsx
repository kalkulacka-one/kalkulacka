import { Fieldset as FieldsetHeadless, type FieldsetProps as FieldsetPropsHeadless } from '@headlessui/react';
import type { ElementType } from 'react';

const DEFAULT_FIELDSET_TAG = 'fieldset';

type Props<TTag extends ElementType = typeof DEFAULT_FIELDSET_TAG> = FieldsetPropsHeadless<TTag>;

export function Fieldset<TTag extends ElementType = typeof DEFAULT_FIELDSET_TAG>({ children, ...props }: Props<TTag>) {
  return <FieldsetHeadless {...props}>{children}</FieldsetHeadless>;
}
