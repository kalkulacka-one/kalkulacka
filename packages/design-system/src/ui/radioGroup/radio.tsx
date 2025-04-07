import {
  Radio as HeadlessRadio,
  type RadioProps as HeadlessRadioProps,
} from "@headlessui/react";

type RadioProps = {
  children: React.ReactNode;
} & HeadlessRadioProps;

export function Radio({ children, ...props }: RadioProps) {
  return (
    <HeadlessRadio
      className="k1-group k1-relative k1-flex k1-size-6 k1-items-center k1-justify-center k1-rounded-full k1-border-2 k1-border-neutral-strong k1-bg-white group-hover:k1-border-[#ADA6A6]"
      {...props}
    >
      {children}
    </HeadlessRadio>
  );
}
