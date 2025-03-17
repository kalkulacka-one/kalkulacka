import type React from 'react';

type Props = {
  children: React.ReactNode;
};

const Heading = ({ children }: Props): JSX.Element => {
  return <h1 className="ko:text-primary ko:px-md ko:h-xl">{children}</h1>;
};

export { Heading };
