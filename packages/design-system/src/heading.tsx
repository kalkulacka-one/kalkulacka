import React from "react";

type Props = {
  children: React.ReactNode;
};

const Heading = ({ children }: Props): JSX.Element => {
  return <h1 className="k1-h-xl k1-px-md k1-text-primary">{children}</h1>;
};

export { Heading };
