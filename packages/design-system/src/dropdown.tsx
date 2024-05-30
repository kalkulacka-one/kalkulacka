import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export const Dropdown = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <Popover>{children}</Popover>;
};

export const DropdownTrigger = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <PopoverButton>{children}</PopoverButton>;
};

export const DropdownPanel = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <PopoverPanel>{children}</PopoverPanel>;
};

export default Dropdown;
