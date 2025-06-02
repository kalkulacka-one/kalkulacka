import React from "react";

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<"form">;

export function FormComp({ children, ...props }: Props, ref: React.Ref<HTMLFormElement>) {
  return (
    <form ref={ref} {...props}>
      {children}
    </form>
  );
}

export const Form = React.forwardRef<HTMLFormElement, Props>(FormComp);
