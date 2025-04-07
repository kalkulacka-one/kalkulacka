import { RadioLabel, Radio } from "@repo/design-system/ui";

type RadioItemProps = {
  value: string;
  children: string;
};

export function RadioItem({ value, children }: RadioItemProps) {
  return (
    <RadioLabel htmlFor={value}>
      <Radio id={value} value={value}>
        <span className="k1-invisible k1-absolute k1-size-[0.6rem] k1-rounded-full k1-bg-[#565252] group-hover:k1-bg-[#ADA6A6] group-data-[checked]:k1-visible" />
      </Radio>
      <span className="k1-ml-4 k1-text-neutral">{children}</span>
    </RadioLabel>
  );
}
