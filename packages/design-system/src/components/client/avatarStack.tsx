"use client";

// Ported from kalkulacka-2026/packages/ui/src/avatar-stack/avatar-stack.tsx and avatar-stack.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { icons } from "../icons";
import { Avatar } from "../server/avatar";
import { VisuallyHidden } from "../server/visuallyHidden";
import { IconButton } from "./icon-button";

export type AvatarStackItem = {
  id: string;
  name: string;
  src?: string;
  /** The candidate's accent — the ring around their face. See `Avatar`. */
  accent?: string;
};

export type AvatarStackSize = "small" | "medium";

export type AvatarStack = {
  items: AvatarStackItem[];
  /** How many faces are drawn before the rest collapse into a "+n" disc. */
  max?: number;
  size?: AvatarStackSize;
  /** Names the whole group for a screen reader, e.g. "Strany, které s vámi souhlasí". */
  label: string;
  /**
   * When provided, the stack becomes a trigger for a popover that captions
   * every face: hovering shows it on a mouse, tapping toggles it elsewhere,
   * and `closeLabel` names the popover's own X. Without it the stack stays
   * the inert row it always was.
   */
  popover?: { closeLabel: string };
};

/*
 * The overlap, per size. The stack's left padding is paired with the negative
 * margin on every item: the two cancel on the first face of each line, so a
 * stack that wraps starts both of its lines on the card's own left edge.
 * Hanging the margin off `.item + .item` instead would pull every wrapped
 * line half an avatar to the left. Each avatar carries its own hairline ring
 * and an opaque background, which is what keeps a dozen of these reading as
 * separate faces rather than one smear; no extra ring is drawn here.
 */
const stackClasses = "ko:flex ko:flex-wrap ko:items-center ko:gap-y-1 ko:m-0 ko:list-none";

const stackSizeClasses: Record<AvatarStackSize, string> = {
  small: "ko:pl-2",
  medium: "ko:pl-3",
};

/* Faces later in the list sit on top of earlier ones — DOM order does this on
   its own; the stacking context is only here so a hover/focus ring inside an
   avatar isn't clipped under the next face. */
const itemClasses = "ko:inline-flex ko:flex-none ko:relative ko:rounded-pill ko:hover:z-1 ko:focus-within:z-1";

const itemSizeClasses: Record<AvatarStackSize, string> = {
  small: "ko:-ml-2",
  medium: "ko:-ml-3",
};

const overflowDiscClasses =
  "ko:inline-flex ko:items-center ko:justify-center ko:rounded-pill ko:bg-surface ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)] ko:font-sans ko:font-semibold ko:text-text-muted ko:tabular-nums";

const overflowDiscSizeClasses: Record<AvatarStackSize, string> = {
  small: "ko:size-8 ko:text-[0.6875rem]",
  medium: "ko:size-11 ko:text-xs",
};

/*
 * The expandable variant: the stack becomes a real button and the popover
 * hangs off this wrapper. `inline-flex` so the trigger takes only the room the
 * faces do — the whole point of a stack is being narrow. While the popover is
 * open, the whole trigger+panel unit rises above its surroundings (the toast's
 * layer, 6): the panel's own z-index is not enough on its own, because in a
 * list of cards each carrying a stack, the cards are siblings in one stacking
 * context, so a *later* card's content would paint over an earlier card's open
 * panel purely by DOM order.
 */
const rootClasses = "ko:relative ko:inline-flex";
const rootOpenClasses = "ko:z-6";

const triggerClasses = "ko:border-0 ko:bg-transparent ko:py-0 ko:cursor-pointer ko:rounded-pill ko:focus-visible:outline-3 ko:focus-visible:outline-offset-2 ko:focus-visible:outline-focus/55";

const panelClasses = [
  "ko:absolute ko:top-[calc(100%_+_0.5rem)] ko:left-0 ko:z-6",
  "ko:min-w-56 ko:max-w-72 ko:pt-2 ko:px-3 ko:pb-3",
  "ko:rounded-[calc(var(--ko-radius-chip)_*_1.5_+_0.5rem)] ko:bg-surface ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border),var(--ko-shadow-card-lifted)]",
  "ko:origin-top-left ko:animate-stack-panel-in ko:motion-reduce:animate-none",
].join(" ");

const panelHeadClasses = "ko:flex ko:items-center ko:justify-between ko:gap-2";
const panelTitleClasses = "ko:font-sans ko:text-[0.8125rem] ko:font-semibold ko:text-text-muted";
const panelListClasses = "ko:flex ko:flex-col ko:gap-2 ko:mt-1 ko:mb-0 ko:p-0 ko:list-none ko:max-h-64 ko:overflow-y-auto";
const panelRowClasses = "ko:flex ko:items-center ko:gap-2";
const panelNameClasses = "ko:font-sans ko:text-[0.8125rem] ko:text-text-strong ko:min-w-0";

/**
 * A row of candidate faces, overlapped.
 *
 * A count ("souhlasí 7 z 12 stran") says how much company you had; this says
 * *whose*. Overlapping rather than spacing them out is what keeps a dozen
 * parties inside a dashboard card's width, and the ring each avatar carries is
 * what stops the overlap reading as one smeared shape — it is drawn in the
 * card's own background, so a face is separated from the one it sits on by a
 * gap rather than by a line of some third colour.
 *
 * Order is the caller's. Overflow collapses into a "+n" disc at the end rather
 * than truncating silently: the faces are a sample, and the disc is what says
 * so. Every name is still announced, so nothing is lost when the disc appears.
 *
 * With `popover` set, the whole stack is one trigger for a list that captions
 * every face. One trigger rather than one per avatar: at this size the faces
 * are individually unhittable on a phone, and the question a reader has is
 * "who are all of these", not "who is the third one".
 */
export function AvatarStack({ items, max = 8, size = "small", label, popover }: AvatarStack) {
  /*
   * Two reasons to be open, tracked apart: a mouse hovering, and a tap or
   * Enter having toggled it. Separate so that a mouse wandering off doesn't
   * close a popover a click deliberately opened — and so that a tap (which
   * hovers nothing on a touch screen) has a state of its own.
   */
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const open = hovered || pinned;

  const close = useCallback(() => {
    setPinned(false);
    setHovered(false);
  }, []);

  // The tap-outside route out, same as the shell menu's. Registered only while
  // pinned: a hover-opened popover already closes itself on mouse leave.
  useEffect(() => {
    if (!pinned) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      setPinned(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [pinned]);

  if (items.length === 0) return null;

  /*
   * With exactly one over the limit, the "+1" disc costs the same room as the
   * face it replaces and says less — so the cut only happens once it buys
   * something.
   */
  const shown = items.length > max + 1 ? items.slice(0, max) : items;
  const hidden = items.length - shown.length;

  const itemClassName = twMerge(itemClasses, itemSizeClasses[size]);
  const overflowDiscClassName = twMerge(overflowDiscClasses, overflowDiscSizeClasses[size]);

  if (!popover) {
    return (
      <ul className={twMerge(stackClasses, stackSizeClasses[size])} aria-label={label}>
        {shown.map((item) => (
          <li key={item.id} className={itemClassName}>
            {/* `title` gives the pointer a way to read a face the layout has no
                room to caption; the hidden text is what carries it elsewhere. */}
            <span title={item.name}>
              <Avatar name={item.name} src={item.src} accent={item.accent} size={size} />
            </span>
            <VisuallyHidden>{item.name}</VisuallyHidden>
          </li>
        ))}

        {hidden > 0 ? (
          <li className={itemClassName}>
            <span className={overflowDiscClassName} aria-hidden="true">
              +{hidden}
            </span>
            <VisuallyHidden>
              {items
                .slice(shown.length)
                .map((item) => item.name)
                .join(", ")}
            </VisuallyHidden>
          </li>
        ) : null}
      </ul>
    );
  }

  return (
    <div
      ref={rootRef}
      className={twMerge(rootClasses, open && rootOpenClasses)}
      /* Gated to a real mouse: on a touch screen the emulated mouseenter and
         the click arrive together, and letting both act would open on the
         enter only to have the click toggle it shut again. */
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false);
      }}
    >
      <button
        type="button"
        className={twMerge(stackClasses, triggerClasses, stackSizeClasses[size])}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setPinned((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            close();
          }
        }}
      >
        {shown.map((item) => (
          <span key={item.id} className={itemClassName}>
            <Avatar name={item.name} src={item.src} accent={item.accent} size={size} />
          </span>
        ))}

        {hidden > 0 ? (
          <span className={itemClassName}>
            <span className={overflowDiscClassName} aria-hidden="true">
              +{hidden}
            </span>
          </span>
        ) : null}

        {/* The names live in the popover once there is one; the trigger only
            has to say what pressing it reveals. */}
        <VisuallyHidden>{label}</VisuallyHidden>
      </button>

      {open ? (
        <div id={panelId} className={panelClasses}>
          <div className={panelHeadClasses}>
            <span className={panelTitleClasses}>{label}</span>
            {/* The touch route out — a finger has no Escape and no hover to
                withdraw. */}
            <IconButton icon={icons.close} label={popover.closeLabel} onClick={close} />
          </div>

          <ul className={panelListClasses}>
            {items.map((item) => (
              <li key={item.id} className={panelRowClasses}>
                <Avatar name={item.name} src={item.src} accent={item.accent} size="small" />
                <span className={panelNameClasses}>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
