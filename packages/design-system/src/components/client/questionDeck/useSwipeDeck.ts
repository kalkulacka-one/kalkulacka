// Ported from kalkulacka-2026/packages/ui/src/question-deck/use-swipe-deck.ts
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { type CommitSpeed, PHYSICS, STACK_BACK, STACK_NEXT, STACK_TRAVEL, type SwipeZone, shouldCommit, speedFor, springBackDuration, stackTransform, transform, zoneForOffset } from "./swipePhysics";

export type SwipeIntent = { zone: SwipeZone; important: boolean };

export type UseSwipeDeckOptions = {
  /**
   * Called when a drag travelled far enough to count as an answer.
   *
   * `fromTransform` is where the card was at release — the caller hands it to
   * the fly-out so the exit animation continues from the drag rather than
   * jumping back to centre first.
   */
  onCommit: (intent: SwipeIntent, fromTransform: string) => void;
  /** Zone under the finger right now, for the drag hint. `null` when unclear. */
  onIntentChange?: (intent: SwipeIntent | null) => void;
  disabled?: boolean;
};

/**
 * Pointer-driven card dragging, ported from the prototype.
 *
 * Transforms are written straight to the DOM rather than held in React state:
 * a drag produces a pointermove every frame, and re-rendering three stacked
 * cards at that rate is exactly the kind of jank this interaction cannot
 * afford. React still owns *what* is on each card — only the moment-to-moment
 * position is imperative.
 */
export function useSwipeDeck({ onCommit, onIntentChange, disabled = false }: UseSwipeDeckOptions) {
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const intentRef = useRef<SwipeIntent | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [intent, setIntent] = useState<SwipeIntent | null>(null);

  const publishIntent = useCallback(
    (next: SwipeIntent | null) => {
      const prev = intentRef.current;
      if (prev?.zone === next?.zone && prev?.important === next?.important) return;

      intentRef.current = next;
      setIntent(next);
      onIntentChange?.(next);
    },
    [onIntentChange],
  );

  /** Snap the stack back to its resting arrangement, without animating. */
  const resetStack = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transition = "none";
      card.style.transform = transform(0, 0, 0);
      card.style.opacity = "1";
    }

    const next = nextRef.current;
    if (next) {
      next.style.transition = "none";
      next.style.transform = stackTransform(STACK_NEXT.x, STACK_NEXT.y, STACK_NEXT.scale, STACK_NEXT.rotate);
      next.style.filter = `brightness(${STACK_NEXT.brightness})`;
      next.style.opacity = String(STACK_NEXT.opacity);
    }

    const back = backRef.current;
    if (back) {
      back.style.transition = "none";
      back.style.transform = stackTransform(STACK_BACK.x, STACK_BACK.y, STACK_BACK.scale, STACK_BACK.rotate);
      back.style.filter = `brightness(${STACK_BACK.brightness})`;
      back.style.opacity = String(STACK_BACK.opacity);
    }
  }, []);

  /** Animate the upcoming card rising and enlarging to the front on button/keyboard commit. */
  const animateStackRise = useCallback((speed: CommitSpeed = "normal") => {
    // Near-zero under reduced motion, so the next card is simply already at
    // the front rather than sliding and growing into it.
    const { fly } = speedFor(speed);
    const easing = `transform ${fly}s var(--ko-ease-spring), filter ${fly}s ease, opacity ${fly}s ease`;

    const card = cardRef.current;
    if (card) {
      card.style.transition = "none";
      card.style.transform = stackTransform(STACK_NEXT.x, STACK_NEXT.y, STACK_NEXT.scale, STACK_NEXT.rotate);
      card.style.filter = `brightness(${STACK_NEXT.brightness})`;
      card.style.opacity = "1";

      void card.offsetWidth;

      card.style.transition = easing;
      card.style.transform = transform(0, 0, 0);
      card.style.filter = "brightness(1)";
    }

    const next = nextRef.current;
    if (next) {
      next.style.transition = "none";
      next.style.transform = stackTransform(STACK_BACK.x, STACK_BACK.y, STACK_BACK.scale, STACK_BACK.rotate);
      next.style.filter = `brightness(${STACK_BACK.brightness})`;
      next.style.opacity = String(STACK_BACK.opacity);

      void next.offsetWidth;

      next.style.transition = easing;
      next.style.transform = stackTransform(STACK_NEXT.x, STACK_NEXT.y, STACK_NEXT.scale, STACK_NEXT.rotate);
      next.style.filter = `brightness(${STACK_NEXT.brightness})`;
    }

    const back = backRef.current;
    if (back) {
      back.style.transition = "none";
      back.style.transform = stackTransform(STACK_BACK.x, STACK_BACK.y, STACK_BACK.scale, STACK_BACK.rotate);
      back.style.filter = `brightness(${STACK_BACK.brightness})`;
      back.style.opacity = String(STACK_BACK.opacity);
    }
  }, []);

  const springBack = useCallback(() => {
    // The drag that got here was the reader's own hand and is never reduced;
    // this is the part that plays by itself once they let go, so it is.
    const settle = springBackDuration();
    const easing = `transform ${settle}s var(--ko-ease-spring), filter ${settle}s ease, opacity ${settle}s ease`;

    const card = cardRef.current;
    if (card) {
      card.style.transition = easing;
      card.style.transform = transform(0, 0, 0);
    }

    const next = nextRef.current;
    if (next) {
      next.style.transition = easing;
      next.style.transform = stackTransform(STACK_NEXT.x, STACK_NEXT.y, STACK_NEXT.scale, STACK_NEXT.rotate);
      next.style.filter = `brightness(${STACK_NEXT.brightness})`;
      next.style.opacity = String(STACK_NEXT.opacity);
    }

    const back = backRef.current;
    if (back) {
      back.style.transition = easing;
      back.style.transform = stackTransform(STACK_BACK.x, STACK_BACK.y, STACK_BACK.scale, STACK_BACK.rotate);
      back.style.filter = `brightness(${STACK_BACK.brightness})`;
      back.style.opacity = String(STACK_BACK.opacity);
    }
  }, []);

  // Listeners live on the window rather than the card so a fast drag that
  // outruns the pointer still tracks. They are attached synchronously from
  // `onPointerDown` itself — not from a `useEffect` keyed off `isDragging` —
  // because on touch devices a tap or flick can produce its pointermove/up
  // before React commits the state update and runs the effect, silently
  // dropping the gesture (and, since `handleUp` never runs, leaving
  // `dragging.current` stuck `true`). Attaching inline has no such gap.
  const attachListeners = useCallback(() => {
    const handleMove = (event: globalThis.PointerEvent) => {
      const dx = event.clientX - start.current.x;
      const dy = event.clientY - start.current.y;
      offset.current = { x: dx, y: dy };

      const card = cardRef.current;
      if (card) card.style.transform = transform(dx, dy, dx / PHYSICS.rotationDivisor);

      // The stack rises toward the front as the top card leaves.
      const progress = Math.min(1, Math.max(Math.abs(dx), Math.abs(dy)) / PHYSICS.stackProgressDistance);

      const next = nextRef.current;
      if (next) {
        next.style.transform = stackTransform(
          STACK_NEXT.x + STACK_TRAVEL.next.x * progress,
          STACK_NEXT.y + STACK_TRAVEL.next.y * progress,
          STACK_NEXT.scale + STACK_TRAVEL.next.scale * progress,
          STACK_NEXT.rotate + STACK_TRAVEL.next.rotate * progress,
        );
        next.style.filter = `brightness(${STACK_NEXT.brightness + STACK_TRAVEL.next.brightness * progress})`;
        next.style.opacity = String(STACK_NEXT.opacity + STACK_TRAVEL.next.opacity * progress);
      }

      const back = backRef.current;
      if (back) {
        back.style.transform = stackTransform(
          STACK_BACK.x + STACK_TRAVEL.back.x * progress,
          STACK_BACK.y + STACK_TRAVEL.back.y * progress,
          STACK_BACK.scale + STACK_TRAVEL.back.scale * progress,
          STACK_BACK.rotate + STACK_TRAVEL.back.rotate * progress,
        );
        back.style.filter = `brightness(${STACK_BACK.brightness + STACK_TRAVEL.back.brightness * progress})`;
        back.style.opacity = String(STACK_BACK.opacity + STACK_TRAVEL.back.opacity * progress);
      }

      publishIntent(zoneForOffset(dx, dy));
    };

    const detach = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };

    const handleUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
      detach();

      const { x: dx, y: dy } = offset.current;
      const settled = intentRef.current;

      if (settled && shouldCommit(settled.zone, dx, dy)) {
        const from = cardRef.current?.style.transform || transform(0, 0, 0);
        publishIntent(null);

        // An upward flick arms "important" even if the pointer drifted back
        // below the threshold before release.
        onCommit(
          {
            zone: settled.zone,
            important: settled.important || dy < PHYSICS.importantLiftY,
          },
          from,
        );

        // The card the user was holding has been cloned into the fly-out layer;
        // the real one goes straight back to centre showing the next question.
        resetStack();
        return;
      }

      publishIntent(null);
      springBack();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);

    return detach;
  }, [onCommit, publishIntent, springBack, resetStack]);

  // Runs the returned cleanup once the current drag ends, then forgets it —
  // `attachListeners` itself never depends on `isDragging`, so there is no
  // render in between "pointer went down" and "listeners are live".
  const detachRef = useRef<(() => void) | null>(null);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (event.currentTarget.setPointerCapture) {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Ignore capture failures (e.g. if element is detached)
        }
      }

      dragging.current = true;
      start.current = { x: event.clientX, y: event.clientY };
      offset.current = { x: 0, y: 0 };

      // Kill transitions so the card tracks the pointer exactly.
      for (const ref of [cardRef, nextRef, backRef]) {
        if (ref.current) ref.current.style.transition = "none";
      }

      setIsDragging(true);

      // Attached here, synchronously, rather than in a `useEffect` — see the
      // comment above `attachListeners`. `pointermove`/`pointerup` can arrive
      // (and on a quick touch tap, both can arrive) before React would
      // otherwise have committed `isDragging` and run the effect.
      detachRef.current?.();
      detachRef.current = attachListeners();
    },
    [disabled, attachListeners],
  );

  useEffect(() => () => detachRef.current?.(), []);

  // Ensure initial inline transforms match JS physics constants on mount and HMR updates.
  useLayoutEffect(() => {
    resetStack();
  }, [resetStack]);

  return {
    cardRef,
    nextRef,
    backRef,
    onPointerDown,
    /** True only while the pointer is down and moving the card. */
    isDragging,
    /** What the current drag would do if released now. */
    intent,
    resetStack,
    springBack,
    animateStackRise,
  };
}
