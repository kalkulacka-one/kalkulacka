"use client";

// Ported from kalkulacka-2026/packages/ui/src/menu/menu.tsx and menu.module.css
import type { IconDefinition } from "@kalkulacka-one/design-system/icons";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { icons } from "../icons";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export type MenuItem = {
  id: string;
  label: string;
  icon?: IconDefinition | string;
  /** A second line, for an action whose consequence is worth spelling out. */
  detail?: string;
  onSelect: () => void;
};

export type Menu = {
  /** Accessible name for the trigger. */
  label: string;
  items: MenuItem[];
  /** The trigger's glyph; the list icon by default. */
  icon?: IconDefinition | string;
};

const rootClasses = "ko:relative ko:flex-none";

/*
 * The popover hangs from the trigger's right edge and grows out of that corner
 * (`origin-top-right`), not from its own middle. Wide enough that the detail
 * lines sit on one line rather than wrapping. The radius is nested to match
 * the item's own corner (radius + the padding it sits in), so a hovered edge
 * item's rounded corner traces the container's corner instead of leaving a
 * gap between two mismatched curves. `z-6` is 2026's toast layer: above the
 * deck's lifted card (4) and a reading screen's sticky bar (4).
 */
const listClasses = [
  "ko:absolute ko:top-[calc(100%_+_0.5rem)] ko:right-0 ko:z-6",
  "ko:flex ko:flex-col ko:min-w-[17.5rem] ko:p-2",
  "ko:rounded-[calc(var(--ko-radius-chip)*1.5_+_0.5rem)] ko:bg-surface",
  "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border),var(--ko-shadow-card-lifted)]",
  "ko:origin-top-right ko:animate-menu-in ko:motion-reduce:animate-none",
].join(" ");

/* The focus ring is drawn inside the item, so it is never clipped by the list's own padding. */
const itemClasses = [
  "ko:flex ko:items-center ko:gap-3 ko:w-full ko:min-h-11 ko:p-3",
  "ko:border-0 ko:rounded-[calc(var(--ko-radius-chip)*1.5)] ko:bg-transparent ko:text-text",
  "ko:text-left ko:cursor-pointer",
  "ko:transition-[background-color] ko:duration-[var(--ko-duration-fast)] ko:ease-linear",
  "ko:hover:bg-surface-hover",
  "ko:focus-visible:outline-3 ko:focus-visible:-outline-offset-3 ko:focus-visible:outline-focus/55",
].join(" ");

const iconClasses = "ko:flex ko:flex-none ko:text-text-muted";

const textClasses = "ko:flex ko:flex-col ko:gap-0.5 ko:min-w-0";

const labelClasses = "ko:font-sans ko:text-[0.9375rem] ko:font-semibold ko:tracking-[-0.01em] ko:text-text-strong";

const detailClasses = "ko:font-sans ko:text-[0.8125rem] ko:leading-[1.4] ko:text-text-muted";

/**
 * The shell's overflow menu.
 *
 * Hand-rolled rather than built on the native popover API because aligning a
 * popover to its trigger still needs CSS anchor positioning, which only one
 * engine ships — and a menu that lands in the wrong corner on Safari is worse
 * than a few lines of positioning here.
 *
 * Selecting an item closes the menu *before* running the action, so an action
 * that opens a dialog does not have to fight this for focus — and it hands
 * focus back to the trigger on the way, which is what gives that dialog a live
 * element to restore to when it is dismissed.
 */
export function Menu({ label, items, icon = icons.list }: Menu) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Moving focus into the menu is what makes the arrow keys and Escape work
  // without a global key listener — the handlers below are all scoped to it.
  useEffect(() => {
    if (!open) return;
    const first = listRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    first?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      // A click that lands outside dismisses without stealing focus back —
      // whatever was clicked should get it instead.
      close(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, close]);

  const moveFocus = (delta: number) => {
    const nodes = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    if (nodes.length === 0) return;

    const active = document.activeElement;
    const current = active instanceof HTMLElement ? nodes.indexOf(active) : -1;
    const next = (current + delta + nodes.length) % nodes.length;
    nodes[next]?.focus();
  };

  return (
    <div className={rootClasses} ref={rootRef}>
      <IconButton
        ref={triggerRef}
        icon={icon}
        label={label}
        variant="surface"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      />

      {open ? (
        <div
          id={menuId}
          ref={listRef}
          className={listClasses}
          role="menu"
          aria-label={label}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close(true);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              moveFocus(1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              moveFocus(-1);
            } else if (event.key === "Tab") {
              // Tab means "done here" — let it move on, just don't leave an
              // orphaned menu open behind it.
              close(false);
            }
          }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={itemClasses}
              /*
               * Focus goes back to the trigger *before* the action runs, and
               * the order is the whole point. The item is about to be
               * unmounted, so leaving focus on it drops the caret to `<body>`
               * — and a `showModal()` that happens next records `<body>` as
               * the element to restore to, which is where a keyboard user
               * ended up after every dismissal of the help, restart or leave
               * sheet. Restoring first gives the modal a real trigger to hand
               * focus back to, and for an action that opens nothing (the
               * light/dark toggle) it is simply where focus belongs.
               */
              onClick={() => {
                close(true);
                item.onSelect();
              }}
            >
              {item.icon ? (
                <span className={iconClasses}>
                  <Icon icon={item.icon} size="regular" decorative />
                </span>
              ) : null}

              <span className={textClasses}>
                <span className={labelClasses}>{item.label}</span>
                {item.detail ? <span className={detailClasses}>{item.detail}</span> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
