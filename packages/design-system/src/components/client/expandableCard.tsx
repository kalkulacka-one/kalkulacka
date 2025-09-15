import { Disclosure, DisclosureButton, DisclosurePanel, type DisclosureProps } from "@headlessui/react";
import { mdiChevronDown } from "@mdi/js";
import { Card } from "@repo/design-system/server";
import { twMerge } from "@repo/design-system/utils";
import * as React from "react";

import { Icon } from "./icon";

export type ExpandableCard = Omit<DisclosureProps<typeof Card>, "as">;

function ExpandableCardComponent(props: ExpandableCard, ref: React.Ref<HTMLDivElement>) {
  const { className, ...rest } = props;
  const cardProps = {
    ...rest,
    interactive: true,
    className: twMerge("ko:grid ko:grid-flow-row", typeof className === "string" ? className : undefined),
  };
  return (
    <Disclosure {...cardProps} as={Card} ref={ref}>
      {(renderProps) => <>{typeof props.children === "function" ? props.children(renderProps) : props.children}</>}
    </Disclosure>
  );
}

type ExpandableCardContentProps = {
  children: React.ReactNode;
  className?: string;
};

type ExpandableCardHiddenContentProps = {
  children: React.ReactNode;
  className?: string;
};

type ExpandableCardChevronProps = {
  className?: string;
  open?: boolean;
};

function ExpandableCardContent({ children, className }: ExpandableCardContentProps) {
  return <DisclosureButton className={className}>{children}</DisclosureButton>;
}

function ExpandableCardHiddenContent({ children, className }: ExpandableCardHiddenContentProps) {
  return <DisclosurePanel className={twMerge("ko:overflow-hidden", className)}>{children}</DisclosurePanel>;
}

function ExpandableCardChevron({ className, open = false }: ExpandableCardChevronProps) {
  return <Icon icon={mdiChevronDown} className={twMerge(open ? "ko:rotate-180" : "", className)} size="medium" decorative />;
}

export const ExpandableCard = Object.assign(React.forwardRef(ExpandableCardComponent), {
  Content: ExpandableCardContent,
  HiddenContent: ExpandableCardHiddenContent,
  Chevron: ExpandableCardChevron,
});
