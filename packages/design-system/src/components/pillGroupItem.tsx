import { Checkbox, Field, Label } from '@repo/design-system/components';
import { useEffect, useState } from 'react';

type PillGroupItemProps = {
  value: string;
  children: React.ReactNode;
  isChecked?: boolean;
  togglePill?: (tag: string | undefined) => void;
};

export function PillGroupItem({ value, children, isChecked, togglePill }: PillGroupItemProps) {
  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  function onToggleChange() {
    setChecked((prevValue) => !prevValue);
    // solve here
    togglePill(value);
  }

  const [checked, setChecked] = useState(isChecked);
  return (
    <Field>
      <Label>
        <Checkbox value={value} checked={checked} onChange={onToggleChange} className="ko:peer ko:hidden" />
        <span className="ko:whitespace-nowrap ko:peer-data-[checked]:bg-white ko:cursor-pointer ko:font-sans ko:select-none ko:rounded-[1rem] ko:border-[0.0625em] ko:border-black ko:bg-black ko:px-4 ko:py-2 ko:text-[0.625rem] ko:font-bold ko:uppercase ko:text-white ko:peer-checked:border-neutral ko:peer-checked:bg-neutral ko:peer-data-[checked]:text-black">
          {children}
        </span>
      </Label>
    </Field>
  );
}

// 1. ul/li
