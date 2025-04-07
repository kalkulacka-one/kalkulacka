import {
  Label as HeadlessLabel,
  type LabelProps as HeadlessLabelProps,
} from "@headlessui/react";

type RadioLabelProps = {
  children: React.ReactNode;
} & HeadlessLabelProps;

export function RadioLabel({ children, ...props }: RadioLabelProps) {
  return (
    <HeadlessLabel
      className="k1-group k1-flex k1-cursor-pointer k1-items-center k1-border-b k1-border-neutral k1-px-4 k1-py-3"
      {...props}
    >
      {children}
    </HeadlessLabel>
  );
}
