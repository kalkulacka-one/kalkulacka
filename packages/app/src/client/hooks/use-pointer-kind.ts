"use client";

// Ported from kalkulacka-2026/apps/web/lib/use-pointer-kind.ts
import { useEffect, useState } from "react";

/**
 * What the reader is holding, as far as the tutorial needs to care.
 *
 * `touch` covers phones and tablets — anything whose primary input is a finger,
 * where the thing to teach is the gesture ("táhněte", "tapněte"). `mouse` is a
 * desktop pointer, where dragging still works but the shortcut worth teaching
 * is the keyboard, and the verb is "klikněte".
 */
export type PointerKind = "touch" | "mouse";

/** Fine, hovering pointer — a mouse or trackpad, not a finger or a pen. */
const DESKTOP_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * Deliberately not `useSyncExternalStore`: this is rendered inside a statically
 * prerendered page, where the server has no media queries to consult, and a
 * client snapshot that disagreed with the server's HTML would be a hydration
 * mismatch on visible text. So the first paint is always the touch wording —
 * mobile-first, and the wording that stays true if the query never resolves —
 * and the effect corrects it before anyone has read a word.
 */
export function usePointerKind(): PointerKind {
  const [kind, setKind] = useState<PointerKind>("touch");

  useEffect(() => {
    // No `matchMedia` (jsdom, for one) means no way to tell — and the touch
    // wording is the one that stays true when nothing can be asked.
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia(DESKTOP_POINTER);
    const apply = () => setKind(query.matches ? "mouse" : "touch");

    apply();
    // A convertible tablet can change its mind mid-session.
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return kind;
}
