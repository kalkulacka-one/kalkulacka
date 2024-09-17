import React, { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react";
import {
  CloseButton,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import cn from "classnames";

const Accordion = forwardRef<
  ElementRef<typeof Disclosure>,
  ComponentPropsWithoutRef<typeof Disclosure>
>(({ className, ...props }, ref) => (
  <Disclosure ref={ref} className={(cn("k1-border-b"), className)} {...props} />
));
Accordion.displayName = "Accordion";

const AccordionButton = forwardRef<
  ElementRef<typeof DisclosureButton>,
  ComponentPropsWithoutRef<typeof DisclosureButton>
>(({ className, ...props }, ref) => (
  <DisclosureButton ref={ref} className={(cn(""), className)} {...props} />
));
AccordionButton.displayName = "AccordionButton";

const AccordionPanel = forwardRef<
  ElementRef<typeof DisclosurePanel>,
  ComponentPropsWithoutRef<typeof DisclosurePanel>
>(({ className, ...props }, ref) => (
  <DisclosurePanel ref={ref} className={(cn(""), className)} {...props} />
));
AccordionButton.displayName = "AccordionPanel";

const AccordionCloseButton = forwardRef<
  ElementRef<typeof CloseButton>,
  ComponentPropsWithoutRef<typeof CloseButton>
>(({ className, ...props }, ref) => (
  <CloseButton ref={ref} className={(cn(""), className)} {...props} />
));
AccordionCloseButton.displayName = "AccordionCloseButton";

export { Accordion, AccordionButton, AccordionPanel, AccordionCloseButton };
