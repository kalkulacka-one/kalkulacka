import React from "react";
import { Switch } from "@headlessui/react";
import { useState, Fragment } from "react";

type Props = {
  children: (checked: boolean) => React.ReactNode;
};

const Toggle = ({ children }: Props): JSX.Element => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch checked={enabled} onChange={setEnabled} as={Fragment}>
      {({ checked }) => {
        return children(checked);
      }}
    </Switch>
  );
};

export { Toggle };
