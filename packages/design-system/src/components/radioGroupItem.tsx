import { Field, Label, Radio } from '@repo/design-system/components';
import { cn } from '@repo/design-system/utils';
import { Fragment } from 'react';

type Props = {
  value: string;
  children?: React.ReactNode;
  className?: string;
};

export function RadioGroupItem({ value, children, className }: Props) {
  return (
    <Field key={value}>
      <Label className="ko:group ko:flex ko:cursor-pointer ko:items-center ko:border-b ko:border-[#d7dad8] ko:px-4 ko:py-3">
        <Radio as={Fragment} value={value}>
          {({ checked }) => (
            <div className="ko:group ko:flex">
              <span
                className={cn('ko:flex ko:size-6 ko:items-center ko:justify-center ko:rounded-full ko:border-2 ko:border-[#565252] ko:group-hover:border-[#ADA6A6] ko:bg-white', className, {
                  'ko:border-[#565252] ko:after:size-3 ko:after:bg-[#565252] ko:after:rounded-full ko:group-hover:after:bg-[#ADA6A6]': checked,
                })}
              />
              <span className="ko:ml-4 ko:text-[#565252]">{children}</span>
            </div>
          )}
        </Radio>
      </Label>
    </Field>
  );
}
