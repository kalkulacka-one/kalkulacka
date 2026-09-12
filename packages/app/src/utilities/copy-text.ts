// Ported from kalkulacka-2026/apps/web/lib/clipboard.ts

/**
 * Copy text to the clipboard, on the phones this actually runs on.
 *
 * `navigator.clipboard` exists only in a secure context. `localhost` counts, so
 * this works on a laptop — but a phone opening the same dev server over
 * `http://192.168.x.x` gets no `navigator.clipboard` at all, and the property
 * access throws before any promise is created. That is why "Sdílet" and
 * "Kopírovat" did nothing on a real device while working on the desktop.
 *
 * The fallback is the old `execCommand` path, which has no secure-context
 * requirement. It stays worth keeping past the dev server: the clipboard
 * permission is refusable, and a copy button that silently does nothing is
 * worse than one that takes an unfashionable route.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Refused, or the document wasn't focused. Fall through and try the
      // selection-based route rather than reporting failure.
    }
  }

  return copyBySelection(text);
}

function copyBySelection(text: string): boolean {
  if (typeof document === "undefined") return false;

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  /*
   * Off-screen but still rendered and focusable: `display: none` or
   * `visibility: hidden` can't be selected, and iOS refuses to copy from an
   * element it considers invisible. `position: fixed` with a zero-size box
   * keeps it out of the layout without scrolling the page when it takes focus.
   */
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "0";
  area.style.width = "1px";
  area.style.height = "1px";
  area.style.padding = "0";
  area.style.border = "none";
  area.style.opacity = "0";

  document.body.appendChild(area);

  const selection = document.getSelection();
  const previous = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : undefined;

  area.focus();
  area.select();
  // iOS ignores `select()` on a readonly field; an explicit range is what
  // actually puts the text on the clipboard there.
  area.setSelectionRange(0, text.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(area);

  // Put back whatever the reader had selected before pressing the button.
  if (previous && selection) {
    selection.removeAllRanges();
    selection.addRange(previous);
  }

  return copied;
}
