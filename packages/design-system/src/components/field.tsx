import { Field as FieldHeadless, type FieldProps as FieldPropsHeadless } from '@headlessui/react';

type Props = FieldPropsHeadless;

export function Field({ children, ...props }: Props) {
  return <FieldHeadless {...props}>{children}</FieldHeadless>;
}
