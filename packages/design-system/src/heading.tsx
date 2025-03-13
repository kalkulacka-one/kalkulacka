import type React from 'react';

type Props = {
  children: React.ReactNode;
};

const Heading = ({ children }: Props): JSX.Element => {
  return <h1 className="k:text-primary k:px-md k:h-xl">{children}</h1>;
};

export { Heading };
