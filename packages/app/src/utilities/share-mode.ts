// Ported from kalkulacka-2026/apps/web/lib/share-mode.ts
import type { PointerKind } from "@/client/hooks/use-pointer-kind";

/**
 * Which of the two share UIs the dialog offers.
 *
 * `sheet` is the OS share sheet — the one good way to hand a picture to
 * another app on a phone, where "another app" might be Messages, Instagram,
 * or AirDrop, and this code has no business knowing which. `desktop` is the
 * two-button pair (copy the image, download it) that replaces the sheet
 * everywhere else.
 */
export type ShareUiMode = "sheet" | "desktop";

/**
 * Decide which UI a reader gets.
 *
 * Two real-device bugs are baked into this, not just a capability check:
 *
 *  - A fine pointer always gets the desktop pair, even when `navigator.share`
 *    claims to support files. macOS Safari answers `canShare({ files: [...] })`
 *    with `true` and then opens a share sheet whose own "Copy" entry pastes the
 *    temp file's *path* as text — not the image — into whatever the reader
 *    pasted into. Chrome on the same machine can be equally unhelpful for a
 *    picture someone means to paste into a chat. Pointer kind is what tells a
 *    phone apart from a laptop that happens to expose the same API; capability
 *    alone cannot.
 *  - A touch pointer without file-sharing support (an old mobile browser, or
 *    running over a plain `http://` origin where `navigator.share` doesn't
 *    exist at all) falls back to the same desktop pair rather than a dead
 *    "Sdílet" button — downloading still works everywhere.
 */
export function chooseShareMode(pointerKind: PointerKind, canShareFiles: boolean): ShareUiMode {
  return pointerKind === "touch" && canShareFiles ? "sheet" : "desktop";
}
