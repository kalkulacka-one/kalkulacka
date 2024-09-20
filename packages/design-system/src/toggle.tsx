import React from "react";
import { Switch } from "@headlessui/react";
import { useState, Fragment } from "react";

const Toggle = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch checked={enabled} onChange={setEnabled} as={Fragment}>
      {({ checked }) =>
        // Approach 1: (conditional styling of the children element)

        // <button className={checked ? "k1-bg-blue-600" : "k1-bg-gray-200"}>
        //   Toggle button
        // </button>

        // Approach 2: (crendering different children elements based on the checked state)

        checked ? (
          // toggle checked
          <button className="k1-bg-green-300">Button checked</button>
        ) : (
          // toggle checked
          <button className="k1-bg-red-400">Button not checked</button>
        )
      }
    </Switch>
  );
};

export { Toggle };
