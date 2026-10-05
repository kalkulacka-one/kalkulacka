import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { DialogBackdrop, Dialog as DialogHeadless, DialogPanel, DialogTitle } from "@headlessui/react";
import { mdiClose } from "@mdi/js";
import type * as React from "react";

import { Button } from "./button";
import { Icon } from "./icon";

export type Dialog = {
  open: boolean;
  /** Called for every dismissal: the close button, Escape, or a click outside the panel. */
  onClose: () => void;
  /** The dialog's name, rendered as its heading. */
  title: React.ReactNode;
  /** Optional content above the title, such as chips. */
  eyebrow?: React.ReactNode;
  /** Accessible label of the close button; the caller owns the translation. */
  closeLabel: string;
  children?: React.ReactNode;
  className?: string;
};

/**
 * A modal. Headless UI does the hard part: it moves focus in, traps it, closes on Escape, locks the page scroll,
 * makes the page behind inert and returns focus to what opened it. This adds the 2026 look: a dimmed backdrop and a
 * card panel that settles up from the bottom edge on a phone and fades in centred from `sm` up. Open and close use
 * the motion tokens, so `prefers-reduced-motion` turns them into a plain swap.
 */
export function Dialog({ open, onClose, title, eyebrow, closeLabel, children, className }: Dialog) {
  return (
    <DialogHeadless open={open} onClose={onClose} transition className="ko:relative ko:z-60 ko:transition ko:duration-base ko:data-closed:opacity-0">
      <DialogBackdrop transition className="ko:fixed ko:inset-0 ko:bg-text-strong/40 ko:backdrop-blur-[2px] ko:transition ko:duration-base ko:data-closed:opacity-0" />
      <div className="ko:fixed ko:inset-0 ko:flex ko:items-end ko:justify-center ko:p-3 ko:sm:items-center ko:sm:p-6">
        <DialogPanel
          transition
          className={twMerge(
            "ko:flex ko:max-h-full ko:w-full ko:max-w-xl ko:flex-col ko:gap-4 ko:overflow-y-auto ko:overscroll-contain ko:rounded-card ko:border ko:border-border ko:bg-surface ko:p-5 ko:shadow-card-lifted ko:sm:p-7",
            "ko:transition ko:duration-base ko:ease-spring ko:data-closed:translate-y-4 ko:data-closed:opacity-0 ko:data-closed:sm:translate-y-2 ko:data-closed:sm:scale-[0.98]",
            className,
          )}
        >
          <div className="ko:flex ko:items-start ko:gap-3">
            <div className="ko:flex ko:min-w-0 ko:flex-1 ko:flex-col ko:gap-3">
              {eyebrow}
              <DialogTitle as="h2" className="ko:font-sans ko:text-2xl ko:font-bold ko:leading-[1.22] ko:tracking-[-0.03em] ko:text-text ko:break-words ko:sm:text-3xl">
                {title}
              </DialogTitle>
            </div>
            <Button variant="round" color="neutral" size="small" aria-label={closeLabel} onClick={onClose}>
              <Icon icon={mdiClose} size="medium" decorative />
            </Button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </DialogHeadless>
  );
}
