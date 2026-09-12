"use client";

// Ported from kalkulacka-2026/packages/ui/src/dialog/dialog.tsx and dialog.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode, useEffect, useId, useRef } from "react";

import { icons } from "../icons";
import { IconButton } from "./icon-button";

export type DialogSize = NonNullable<VariantProps<typeof DialogPanelVariants>["size"]>;

export type DialogProps = {
  open: boolean;
  /** Called for every dismissal — the close button, Escape, or the backdrop. */
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Buttons for the bottom row. Put the confirming action last. */
  actions?: ReactNode;
  closeLabel: string;
  /** `wide` is for reading content (the help sheet); `compact` for a question. */
  size?: DialogSize;
};

/*
 * The element is the full-viewport click-catcher; the panel inside it is what
 * you see. That split is what lets a click on the surrounding area dismiss,
 * without a separate overlay div. The UA's own box — `fit-content`, auto
 * margins, a border, a background — is flattened for that.
 *
 * `display: flex` is scoped to `[open]` (`ko:open:flex`) on purpose. A closed
 * `<dialog>` is hidden by the UA's own `display: none`, so setting `display`
 * unconditionally would override that and leave every dialog in the tree
 * rendered inline, permanently open. `ko-dialog` is the hook for the
 * `::backdrop` and the open/close transition in `styles.css`.
 */
const dialogClasses = "ko-dialog ko:w-full ko:h-full ko:max-w-none ko:max-h-none ko:m-0 ko:p-4 ko:border-0 ko:bg-transparent ko:overflow-hidden ko:open:flex ko:items-center ko:justify-center";

/**
 * The panel: the signature asymmetric card shape, at dialog scale, ringed and
 * lifted the way the question card is. It scrolls on its own if the content is
 * taller than the viewport; the element around it never does.
 */
export const DialogPanelVariants = cva(
  [
    /* The hook for the panel's settle-in transition in `styles.css`. */
    "ko-dialog-panel",
    "ko:flex ko:flex-col ko:gap-4",
    "ko:w-full ko:max-h-full ko:overflow-y-auto ko:overscroll-contain",
    "ko:p-6",
    "ko:bg-surface ko:rounded-card ko:border ko:border-border ko:shadow-card-lifted",
  ],
  {
    variants: {
      size: {
        compact: "ko:max-w-[26rem]",
        wide: "ko:max-w-[34rem]",
      },
    },
    defaultVariants: {
      size: "compact",
    },
  },
);

const headClasses = "ko:flex ko:items-start ko:gap-3";

/* Optically lines the title up with the close icon, not just the button's box. */
const headingClasses = "ko:flex-1 ko:min-w-0 ko:flex ko:flex-col ko:gap-2 ko:pt-2";

const titleClasses = "ko:m-0 ko:font-sans ko:text-2xl ko:font-bold ko:tracking-[-0.02em] ko:leading-[1.15] ko:text-text-strong";

const descriptionClasses = "ko:m-0 ko:font-sans ko:text-[0.9375rem] ko:leading-[1.55] ko:text-text-muted";

const bodyClasses = "ko:min-w-0";

/* Full-width, stacked actions on a narrow screen — thumbs, not pointers. */
const actionsClasses = "ko:flex ko:flex-wrap ko:justify-end ko:gap-2 ko:max-[26rem]:flex-col-reverse ko:max-[26rem]:*:w-full";

/**
 * A modal, on the platform's own `<dialog>`.
 *
 * Using `showModal()` rather than a hand-built overlay means focus trapping,
 * Escape, `aria-modal`, inertness of the page behind, and the top layer (so no
 * z-index in this codebase can ever paint over it) are the browser's job. What
 * is left here is the styling and turning the native `close` event back into
 * the `open` prop's owner being told.
 *
 * Headless UI's `Dialog` — already a dependency here — was the alternative,
 * and was passed over: partly for parity with the source (one native element,
 * one route for every dismissal), and partly because `QuestionDialog` hosts a
 * card dragged with the deck's own physics inside the very same element, and
 * a portal with its own focus and scroll management between the pointer and
 * that card is exactly the layer the interaction cannot afford.
 */
export function Dialog({ open, onClose, title, description, children, actions, closeLabel, size = "compact" }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  /*
   * Per *instance*, not per component. This used to be derived from the CSS
   * module's own class name, which is one string shared by every Dialog ever
   * rendered — and this app keeps three or four of them mounted at once (the
   * shell menu alone holds help, restart and leave; the results screen adds
   * share). Four elements carrying the same `id` means the browser resolves
   * `aria-labelledby` to whichever came first in the document, so an open
   * dialog announced itself under a closed one's title.
   */
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    // `open` is the source of truth; the element is told to match it. Guarding
    // on the element's own state keeps `showModal()` from throwing when it is
    // already modal (React may re-run this after an unrelated prop change).
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    // Covers anything that closes the element without going through `onClose`
    // — `dialog.close()` called from elsewhere, or a browser that dismisses it
    // on its own. Telling the owner is safe when we were the ones who closed
    // it: it only sets `open` to the value it already has.
    //
    // With one exception. The native `close` event is queued, not fired
    // inline, so it can land *after* the owner has already reopened the
    // element — a dismissal and a reopen in quick succession, which the source
    // did not guard against — and then it would tell the owner to close a
    // dialog that is open again. An element that is open when its own `close`
    // event arrives can only be reporting a closing that has since been
    // undone, so that report is stale and dropped.
    const handleClose = () => {
      if (dialog.open) return;
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={dialogClasses}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      /*
       * The backdrop is part of the dialog's own box, so a click landing on the
       * element itself — rather than on the panel inside it — is a click
       * outside the content.
       */
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      /*
       * Escape is routed through React rather than left to the element.
       *
       * A modal `<dialog>` does dismiss itself on Escape, but that path only
       * reports back via the `close` event — and if that event does not arrive,
       * the element is shut while `open` still says true, so the same dialog can
       * never be opened again. Handling the key here makes the state the thing
       * that closes it, which is the same route every other dismissal takes.
       * `preventDefault` stops the native dismissal from racing it; the effect
       * above then closes the element for real.
       */
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        onClose();
      }}
    >
      <div className={twMerge(DialogPanelVariants({ size }))}>
        <div className={headClasses}>
          <div className={headingClasses}>
            <h2 id={titleId} className={titleClasses}>
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className={descriptionClasses}>
                {description}
              </p>
            ) : null}
          </div>

          <IconButton icon={icons.close} label={closeLabel} onClick={onClose} />
        </div>

        {children ? <div className={bodyClasses}>{children}</div> : null}
        {actions ? <div className={actionsClasses}>{actions}</div> : null}
      </div>
    </dialog>
  );
}
