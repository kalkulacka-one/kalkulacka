import React, { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react";
import {
  CloseButton,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { twMerge } from "tailwind-merge";

const Accordion = forwardRef<
  ElementRef<typeof Disclosure>,
  ComponentPropsWithoutRef<typeof Disclosure>
>(({ className, ...props }, ref) => (
  <div className={twMerge("k1-border-b", className)}>
    <Disclosure ref={ref} {...props} />
  </div>
));
Accordion.displayName = "Accordion";

const AccordionButton = forwardRef<
  ElementRef<typeof DisclosureButton>,
  ComponentPropsWithoutRef<typeof DisclosureButton>
>(({ className, ...props }, ref) => (
  <DisclosureButton ref={ref} className={(twMerge(""), className)} {...props} />
));
AccordionButton.displayName = "AccordionButton";

const AccordionPanel = forwardRef<
  ElementRef<typeof DisclosurePanel>,
  ComponentPropsWithoutRef<typeof DisclosurePanel>
>(({ className, ...props }, ref) => (
  <DisclosurePanel ref={ref} className={(twMerge(""), className)} {...props} />
));
AccordionButton.displayName = "AccordionPanel";

const AccordionCloseButton = forwardRef<
  ElementRef<typeof CloseButton>,
  ComponentPropsWithoutRef<typeof CloseButton>
>(({ className, ...props }, ref) => (
  <CloseButton ref={ref} className={(twMerge(""), className)} {...props} />
));
AccordionCloseButton.displayName = "AccordionCloseButton";

export { Accordion, AccordionButton, AccordionPanel, AccordionCloseButton };
