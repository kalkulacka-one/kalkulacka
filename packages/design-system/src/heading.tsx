import React from "react";

type Props = {
  children: React.ReactNode;
};

const Heading = ({ children }: Props): JSX.Element => {
  return <h1 className="text-primary-50">{children}</h1>;
};

export { Heading };
