"use client";

// Ported from kalkulacka-2026/apps/web/lib/color-mode.ts
import { useCallback, useEffect, useState } from "react";

import { COLOR_MODE_STORAGE_KEY, type ColorMode } from "@/color-mode";

const DARK_SCHEME = "(prefers-color-scheme: dark)";

function systemMode(): ColorMode {
  // No `matchMedia` (jsdom, for one) means no way to ask — and light is what
  // the server guessed too, so nothing visible changes its mind.
  if (typeof window.matchMedia !== "function") return "light";
  return window.matchMedia(DARK_SCHEME).matches ? "dark" : "light";
}

function storedMode(): ColorMode | null {
  try {
    const value = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // Storage can be walled off (a private window with it disabled); then
    // there is simply no override to apply.
    return null;
  }
}

/**
 * The page colour as the page has actually resolved it, or `null` where it
 * has none yet.
 *
 * Read off a throwaway element rather than `<html>`: the design system paints
 * the root only once the shell's scroll mode has landed, and the
 * `--ko-color-page` token is a `light-dark()` expression that only becomes a
 * colour by passing through an element's `color-scheme` — which is also what
 * makes this honour an explicit `data-mode` and a partner theme's single-mode
 * pin alike. A `visibility: hidden`, zero-sized probe takes part in style
 * resolution without ever being seen or moving anything.
 */
export function resolvePageColor(): string | null {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden;background-color:var(--ko-color-page)";
  document.body.append(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color && color !== "rgba(0, 0, 0, 0)" ? color : null;
}

/**
 * Repaints the browser's own chrome to match the page.
 *
 * `theme-color` is normally written once, in the app layout, and Next's usual
 * shape for it is a pair of tags gated on `prefers-color-scheme` — which is
 * the OS preference, and therefore wrong the moment someone overrides the
 * mode in this app. So the served HTML carries exactly one, un-gated tag (see
 * the layout's `viewport` export) and this is what keeps it current: read the
 * colour the page has actually resolved to and hand Safari that.
 *
 * Every matching tag, not the first: React hoists its own copy of the metadata
 * into `<head>` on hydration, so the document can briefly hold two. A browser
 * applies whichever it finds first, and writing both means it does not matter
 * which that is.
 */
export function syncBrowserThemeColor() {
  const color = resolvePageColor();
  if (!color) return;

  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", color);
  }
}

/**
 * The resolved light/dark mode, plus a setter that persists an explicit
 * override.
 *
 * Until someone toggles it, there is no override: the design system's
 * `[data-mode]` rules are absent, `color-scheme: light dark` stands, and the
 * page already tracks the OS pick on its own — this hook only has to layer
 * persistence and the `<html data-mode>` write on top for the one moment
 * someone actually switches it. `bootstrapColorMode` (in `color-mode.ts`,
 * inlined by the app layout) is what keeps that write from flashing the
 * wrong mode on load.
 */
export function useColorMode(): [ColorMode, () => void] {
  // Two pieces of state rather than one, because "dark because the OS says so"
  // and "dark because someone asked for it" are not the same fact: only the
  // second is persisted, and only the second writes `data-mode`. Both start at
  // their server-safe guess and are corrected in the effect below (which runs
  // before anything visible — the menu this feeds is closed by default), so a
  // same-frame mismatch is never seen.
  const [override, setOverride] = useState<ColorMode | null>(null);
  const [system, setSystem] = useState<ColorMode>("light");
  const mode = override ?? system;

  useEffect(() => {
    setOverride(storedMode());
    setSystem(systemMode());

    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(DARK_SCHEME);
    const handleChange = () => setSystem(systemMode());
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (override === null) return;
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, override);
    } catch {
      // Nothing to do: the choice still applies for this page, it just will
      // not survive it.
    }
    document.documentElement.dataset.mode = override;
  }, [override]);

  // Declared after the write above so it reads the DOM in its new mode, and
  // keyed on the resolved `mode` so an OS switch repaints the chrome too — not
  // just an in-app toggle.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `mode` is the trigger; the colour itself is read from the DOM.
  useEffect(() => {
    syncBrowserThemeColor();
  }, [mode]);

  const toggle = useCallback(() => {
    setOverride(mode === "dark" ? "light" : "dark");
  }, [mode]);

  return [mode, toggle];
}
