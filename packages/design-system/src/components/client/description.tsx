import { Description as DescriptionHeadless, type DescriptionProps as DescriptionPropsHeadless } from "@headlessui/react";
import React from "react";

export type Description = DescriptionPropsHeadless;

function DescriptionComponent({ ...props }: Description, ref: React.Ref<HTMLElement>) {
  return <DescriptionHeadless {...props} ref={ref} />;
}

const Description = React.forwardRef<HTMLElement, Description>(DescriptionComponent);

export { Description };
