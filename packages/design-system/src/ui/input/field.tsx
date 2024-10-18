import { Field as FieldPrimitive } from "@headlessui/react";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

function Field({ children }: Props) {
  return (
    <FieldPrimitive className="focus-within:k1-outline focus-visible:k1-outline k1-w-full k1-border k1-relative k1-p-4 k1-border-black k1-bg-white k1-flex k1-gap-2 k1-items-center">
      {children}
    </FieldPrimitive>
  );
}

export { Field };
