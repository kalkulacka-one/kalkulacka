import { Field as FieldPrimitive } from "@headlessui/react";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

function Field({ children }: Props) {
  return (
    <FieldPrimitive className="focus-within:k1-border-neutral-active focus-visible:k1-border-neutral-active k1-w-full k1-border k1-rounded-md k1-rounded-br-none k1-relative k1-p-4 k1-border-neutral hover:k1-border-neutral-hover k1-bg-white k1-flex k1-gap-2 k1-items-center disabled:k1-border-neutral-disabled has-[error]:k1-border-secondary-strong">
      {children}
    </FieldPrimitive>
  );
}

export { Field };
