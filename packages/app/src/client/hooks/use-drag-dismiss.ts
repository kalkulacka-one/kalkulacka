"use client";

// Ported from kalkulacka-2026/apps/web/lib/use-drag-dismiss.ts
import { type PointerEvent as ReactPointerEvent, type RefObject, useCallback, useEffect, useRef, useState } from "react";

/** How far down the sheet has to travel before letting go closes it. */
export const DISMISS_DISTANCE = 110;
/** …or how fast it has to be moving, in px/ms, so a quick flick also closes it. */
export const DISMISS_VELOCITY = 0.45;
/** Matches the exit transition in the CSS, so the state change lands as it finishes. */
export const EXIT_MS = 200;

/** Below this width the pane is a sheet; above it, it is a column and cannot be dragged. */
export const SHEET_QUERY = "(max-width: 63.99rem)";

export type DragDismiss = {
  /** Put on the sheet element itself — this is what moves. */
  sheetRef: RefObject<HTMLElement | null>;
  /** Spread onto the grab handle (and anything else draggable, e.g. the header). */
  handleProps: {
    onPointerDown: (event: ReactPointerEvent) => void;
    onPointerMove: (event: ReactPointerEvent) => void;
    onPointerUp: (event: ReactPointerEvent) => void;
    onPointerCancel: (event: ReactPointerEvent) => void;
  };
  /** True while a drag is in progress — the CSS uses it to drop the sheet's transition. */
  dragging: boolean;
};

/**
 * Drag a bottom sheet down to close it.
 *
 * Only the handle is draggable, not the sheet's body: the body scrolls 42
 * comparison rows, and a gesture that means "scroll" in one place and "dismiss"
 * in another — distinguished only by whether the list happens to be at its top —
 * is the kind of ambiguity that makes a sheet feel like it is fighting you.
 *
 * The transform is written straight to the node rather than held in React state.
 * A pointer move fires at the display's refresh rate and re-rendering the whole
 * comparison on each one would drop frames on exactly the phones this is for.
 */
export function useDragDismiss({ open, onDismiss, query = SHEET_QUERY }: { open: boolean; onDismiss: () => void; query?: string }): DragDismiss {
  const sheetRef = useRef<HTMLElement | null>(null);
  const drag = useRef<{ startY: number; dy: number; startedAt: number } | null>(null);
  const exitTimer = useRef<number | undefined>(undefined);

  const [enabled, setEnabled] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    // No `matchMedia` (jsdom, for one) means no way to tell — and a column
    // that cannot be dragged is the state that stays true when nothing can be
    // asked.
    if (typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(query);
    const sync = () => setEnabled(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);

  useEffect(() => {
    // While it is open the transform belongs to the entry animation, or to a
    // drag in progress. There is nothing to tidy up until it closes.
    if (open) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    // By the time `open` flips, the exit has already played out, so clearing is
    // safe — and necessary: this same node becomes the in-flow dashboard pane
    // once it is no longer a sheet, and a stray `translateY` would push that
    // down the page.
    sheet.style.transform = "";
    drag.current = null;
    setDragging(false);
  }, [open]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled || !sheetRef.current) return;

      drag.current = { startY: event.clientY, dy: 0, startedAt: event.timeStamp };
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [enabled],
  );

  const onPointerMove = useCallback((event: ReactPointerEvent) => {
    const current = drag.current;
    const sheet = sheetRef.current;
    if (!current || !sheet) return;

    // Downward only. Letting it travel up would lift the sheet off the top of
    // the screen, revealing the page behind it with no way to put it back.
    current.dy = Math.max(0, event.clientY - current.startY);
    sheet.style.transform = `translateY(${current.dy}px)`;
  }, []);

  const finish = useCallback(
    (event: ReactPointerEvent) => {
      const current = drag.current;
      const sheet = sheetRef.current;

      drag.current = null;
      setDragging(false);
      if (!current || !sheet) return;

      const velocity = current.dy / Math.max(1, event.timeStamp - current.startedAt);

      if (current.dy > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
        // Let it finish leaving before the state change unmounts the contents,
        // so the sheet is seen to go rather than blinking out under the finger.
        sheet.style.transform = "translateY(100%)";
        exitTimer.current = window.setTimeout(onDismiss, EXIT_MS);
        return;
      }

      sheet.style.transform = "";
    },
    [onDismiss],
  );

  return {
    sheetRef,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
    },
    dragging,
  };
}
