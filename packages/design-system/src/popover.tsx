import React, { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react";
import * as PopoverPrimitive from "@headlessui/react";
import cn from "classnames";

const Popover = forwardRef<
  ElementRef<typeof PopoverPrimitive.Popover>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Popover>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Popover
    ref={ref}
    className={(cn(""), className)}
    {...props}
  />
));
PopoverPrimitive.Popover.displayName = "Popover";

const PopoverBackdrop = forwardRef<
  ElementRef<typeof PopoverPrimitive.PopoverBackdrop>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.PopoverBackdrop>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.PopoverBackdrop
    ref={ref}
    className={(cn(""), className)}
    {...props}
  />
));
PopoverPrimitive.PopoverBackdrop.displayName = "PopoverBackdrop";

const PopoverPanel = forwardRef<
  ElementRef<typeof PopoverPrimitive.PopoverPanel>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.PopoverPanel>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.PopoverPanel
    ref={ref}
    className={(cn(""), className)}
    {...props}
  />
));
PopoverPrimitive.PopoverPanel.displayName = "PopoverPanel";

const PopoverButton = forwardRef<
  ElementRef<typeof PopoverPrimitive.PopoverButton>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.PopoverButton>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.PopoverButton
    ref={ref}
    className={(cn(""), className)}
    {...props}
  />
));
PopoverPrimitive.PopoverButton.displayName = "PopoverButton";

const PopoverGroup = forwardRef<
  ElementRef<typeof PopoverPrimitive.PopoverGroup>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.PopoverGroup>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.PopoverGroup
    ref={ref}
    className={(cn(""), className)}
    {...props}
  />
));
PopoverPrimitive.PopoverGroup.displayName = "PopoverGroup";

const CloseButton = forwardRef<
  ElementRef<typeof PopoverPrimitive.CloseButton>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.CloseButton>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.CloseButton
    ref={ref}
    className={(cn(""), className)}
    {...props}
  />
));
PopoverPrimitive.CloseButton.displayName = "CloseButton";

export {
  Popover,
  PopoverPanel,
  PopoverBackdrop,
  PopoverButton,
  PopoverGroup,
  CloseButton,
};
