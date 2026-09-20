"use client";

import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { mdiChevronRight } from "@mdi/js";
import { cva } from "class-variance-authority";
import { type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type Ref, useCallback, useImperativeHandle, useRef } from "react";

import { Icon } from "./icon";

export type OptionListHandle = {
  focusActive: () => void;
  scrollActiveIntoView: () => void;
};

export type OptionList = {
  children: ReactNode;
  className?: string;
  // The caller owns the roving slot: it has to mean something (Enter's target, Tab's stop) while focus is still in a search field.
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  "aria-label"?: string;
  ref?: Ref<OptionListHandle>;
};

const ROVING_KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);

// Deliberately not `role="listbox"`: every row is a real link or button, so native semantics stay honest instead of
// borrowing a widget role that promises single-selection state this list does not have. What a listbox gives for
// free (one Tab stop, arrows walking the rows) is built by hand: the caller marks one row `tabIndex={0}` and the rest
// `-1`, and this component moves that slot and real focus together.
//
// Arrows stop at the ends rather than wrapping: a search field sits right above the list, and looping from the last
// row back to the first would be a shorter trip than Shift+Tab back to where the user was typing.
export function OptionList({ children, className, activeIndex, onActiveIndexChange, "aria-label": ariaLabel, ref }: OptionList) {
  const containerRef = useRef<HTMLElement>(null);

  const rows = useCallback(() => Array.from(containerRef.current?.querySelectorAll<HTMLElement>('[data-option-row]:not([data-disabled="true"])') ?? []), []);

  useImperativeHandle(
    ref,
    () => ({
      focusActive: () => rows()[activeIndex]?.focus(),
      scrollActiveIntoView: () => rows()[activeIndex]?.scrollIntoView({ block: "nearest" }),
    }),
    [rows, activeIndex],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (!ROVING_KEYS.has(event.key)) return;

      const list = rows();
      if (list.length === 0) return;

      const current = list.indexOf(document.activeElement as HTMLElement);
      if (current === -1) return;

      let next = current;
      if (event.key === "ArrowDown") next = Math.min(current + 1, list.length - 1);
      else if (event.key === "ArrowUp") next = Math.max(current - 1, 0);
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = list.length - 1;

      event.preventDefault();
      list[next]?.focus();
      onActiveIndexChange(next);
    },
    [rows, onActiveIndexChange],
  );

  // A row focused any other way (a click, Shift+Tab back in from below) becomes the roving slot too.
  const handleFocus = useCallback(() => {
    const current = rows().indexOf(document.activeElement as HTMLElement);
    if (current !== -1) onActiveIndexChange(current);
  }, [rows, onActiveIndexChange]);

  return (
    <section ref={containerRef} className={className} onKeyDown={handleKeyDown} onFocus={handleFocus} aria-label={ariaLabel}>
      {children}
    </section>
  );
}

export type OptionListRow = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  // The row a shortcut elsewhere (a search field's Enter) would activate; focus stays in that field, so `:focus-visible` cannot show it.
  highlighted?: boolean;
  tabIndex?: number;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "onClick" | "className" | "tabIndex">;

const OptionListRowVariants = cva(
  [
    "ko:group ko:grid ko:grid-cols-[auto_minmax(0,1fr)_auto] ko:grid-rows-[auto_minmax(0,max-content)] ko:content-center ko:items-center ko:w-full ko:min-h-[3.25rem] ko:px-4 ko:py-3",
    "ko:rounded-[1.125rem]",
    "ko:text-left ko:no-underline ko:text-inherit",
  ],
  {
    variants: {
      interactive: {
        true: [
          "ko:cursor-pointer ko:border-[1.5px] ko:border-neutral/15 ko:bg-white ko:shadow-sm",
          "ko:hover:bg-neutral/8",
          "ko:focus-visible:outline-2 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-primary",
        ],
        false: ["ko:cursor-default ko:border-[1.5px] ko:border-neutral/15 ko:bg-neutral-disabled/55"],
      },
      highlighted: {
        true: "ko:ring-3 ko:ring-primary/55 ko:ring-offset-2",
        false: "",
      },
    },
    defaultVariants: {
      interactive: true,
      highlighted: false,
    },
  },
);

function OptionListBadge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={twMerge("ko:col-start-1 ko:row-span-2 ko:mr-3 ko:flex ko:items-center", className)}>{children}</span>;
}

function OptionListDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={twMerge("ko:col-start-2 ko:row-start-2 ko:truncate ko:text-s ko:text-neutral/70", className)}>{children}</span>;
}

// A disabled row stops being a control rather than staying one that rejects clicks: it drops its href, its click
// handler and any tabIndex a roving list passed it.
function OptionListRow({ children, href, onClick, disabled = false, highlighted = false, tabIndex, className, ...rest }: OptionListRow) {
  const classes = twMerge(OptionListRowVariants({ interactive: !disabled, highlighted }), className);
  const content = (
    <>
      {children}
      {disabled ? null : <Icon icon={mdiChevronRight} decorative size="small" className="ko:col-start-3 ko:row-span-2 ko:ml-3 ko:text-neutral/60" />}
    </>
  );

  if (disabled) {
    return (
      <div className={classes} aria-disabled="true" data-option-row data-disabled="true" {...rest}>
        {content}
      </div>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick} tabIndex={tabIndex} data-option-row {...rest}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} tabIndex={tabIndex} data-option-row {...rest}>
        {content}
      </button>
    );
  }

  return (
    <div className={classes} tabIndex={tabIndex} data-option-row {...rest}>
      {content}
    </div>
  );
}

function OptionListTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={twMerge("ko:col-start-2 ko:row-start-1 ko:truncate ko:text-[1.0625rem] ko:font-semibold ko:text-neutral ko:group-data-[disabled=true]:text-neutral/60", className)}>
      {children}
    </span>
  );
}

OptionList.Row = OptionListRow;
OptionList.Badge = OptionListBadge;
OptionList.Title = OptionListTitle;
OptionList.Description = OptionListDescription;
