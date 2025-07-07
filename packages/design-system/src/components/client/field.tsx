import { Field as FieldHeadless, type FieldProps as FieldPropsHeadless } from "@headlessui/react";

export type Field = FieldPropsHeadless;

export function Field({ ...props }: Field) {
  return <FieldHeadless {...props} />;
}
