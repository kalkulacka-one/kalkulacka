import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { bootstrapColorMode, COLOR_MODE_STORAGE_KEY } from "@/color-mode";

import { syncBrowserThemeColor, useColorMode } from "./use-color-mode";

type Listener = (event: MediaQueryListEvent) => void;

/* jsdom has no `matchMedia`; this stands in for the one query the hook asks. */
function mockScheme(dark: boolean) {
  const listeners = new Set<Listener>();
  const query = {
    matches: dark,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
  };
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: vi.fn(() => query) });

  return {
    change(next: boolean) {
      query.matches = next;
      for (const listener of listeners) listener({ matches: next } as MediaQueryListEvent);
    },
  };
}

/*
 * jsdom resolves no custom properties, so the probe the sync reads would come
 * back empty. This answers `getComputedStyle` for the probe alone — an element
 * carrying the page-colour declaration — with the colour a browser would have
 * resolved, and leaves every other element to jsdom.
 */
function mockPageColor(color: string) {
  const original = window.getComputedStyle;
  Object.defineProperty(window, "getComputedStyle", {
    configurable: true,
    writable: true,
    value: (element: Element) => {
      if (element instanceof HTMLElement && element.style.backgroundColor.includes("--ko-color-page")) {
        return { backgroundColor: color } as CSSStyleDeclaration;
      }
      return original.call(window, element);
    },
  });
  return () => Object.defineProperty(window, "getComputedStyle", { configurable: true, writable: true, value: original });
}

function addThemeColorMeta(content: string) {
  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("content", content);
  document.head.append(meta);
  return meta;
}

describe("useColorMode", () => {
  let restoreComputedStyle = () => {};

  beforeEach(() => {
    restoreComputedStyle = mockPageColor("rgb(248, 250, 252)");
  });

  afterEach(() => {
    restoreComputedStyle();
    Reflect.deleteProperty(window, "matchMedia");
    localStorage.clear();
    delete document.documentElement.dataset.mode;
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.remove();
  });

  it("follows the OS preference while nothing is stored", () => {
    mockScheme(true);
    const { result } = renderHook(() => useColorMode());
    expect(result.current[0]).toBe("dark");
    expect(document.documentElement.dataset.mode).toBeUndefined();
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBeNull();
  });

  it("assumes light where the OS cannot be asked", () => {
    const { result } = renderHook(() => useColorMode());
    expect(result.current[0]).toBe("light");
  });

  it("lets a stored override outrank the OS", () => {
    mockScheme(true);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, "light");
    const { result } = renderHook(() => useColorMode());
    expect(result.current[0]).toBe("light");
    expect(document.documentElement.dataset.mode).toBe("light");
  });

  it("ignores a stored value that is not a mode", () => {
    mockScheme(false);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, "sepia");
    const { result } = renderHook(() => useColorMode());
    expect(result.current[0]).toBe("light");
    expect(document.documentElement.dataset.mode).toBeUndefined();
  });

  it("toggling persists the override and writes it on the root", () => {
    mockScheme(false);
    const { result } = renderHook(() => useColorMode());

    act(() => result.current[1]());
    expect(result.current[0]).toBe("dark");
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.mode).toBe("dark");

    act(() => result.current[1]());
    expect(result.current[0]).toBe("light");
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.dataset.mode).toBe("light");
  });

  it("follows an OS switch until someone overrides it", () => {
    const scheme = mockScheme(false);
    const { result } = renderHook(() => useColorMode());
    expect(result.current[0]).toBe("light");

    act(() => scheme.change(true));
    expect(result.current[0]).toBe("dark");

    act(() => result.current[1]());
    expect(result.current[0]).toBe("light");
    act(() => scheme.change(false));
    expect(result.current[0]).toBe("light");
  });

  it("repaints every theme-color tag with the resolved page colour, and again on a switch", () => {
    mockScheme(false);
    const served = addThemeColorMeta("#f8fafc");
    const hoisted = addThemeColorMeta("#f8fafc");
    const { result } = renderHook(() => useColorMode());
    expect(served).toHaveAttribute("content", "rgb(248, 250, 252)");
    expect(hoisted).toHaveAttribute("content", "rgb(248, 250, 252)");

    restoreComputedStyle();
    restoreComputedStyle = mockPageColor("rgb(11, 18, 32)");
    act(() => result.current[1]());
    expect(served).toHaveAttribute("content", "rgb(11, 18, 32)");
    expect(hoisted).toHaveAttribute("content", "rgb(11, 18, 32)");
  });

  it("leaves the tags alone when the page has no colour to give", () => {
    restoreComputedStyle();
    restoreComputedStyle = mockPageColor("rgba(0, 0, 0, 0)");
    const meta = addThemeColorMeta("#f8fafc");
    syncBrowserThemeColor();
    expect(meta).toHaveAttribute("content", "#f8fafc");
    expect(document.body.querySelector("div")).toBeNull();
  });
});

/* The inline script is a string; this runs it the way the browser would, against the same document. */
describe("bootstrapColorMode", () => {
  let restoreComputedStyle = () => {};

  beforeEach(() => {
    restoreComputedStyle = mockPageColor("rgb(11, 18, 32)");
  });

  afterEach(() => {
    restoreComputedStyle();
    localStorage.clear();
    delete document.documentElement.dataset.mode;
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.remove();
  });

  const run = () => new Function(bootstrapColorMode)();

  it("applies a stored override to the root before anything renders", () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, "dark");
    run();
    expect(document.documentElement.dataset.mode).toBe("dark");
  });

  it("writes nothing on the root without a valid override", () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, "sepia");
    run();
    expect(document.documentElement.dataset.mode).toBeUndefined();
  });

  it("corrects the served theme-color to the resolved page colour and cleans up its probe", () => {
    const meta = addThemeColorMeta("#f8fafc");
    run();
    expect(meta).toHaveAttribute("content", "rgb(11, 18, 32)");
    expect(document.body.querySelector("div")).toBeNull();
  });

  it("reads the colour again once the document is parsed, for a page that pins its scheme from inside the body", () => {
    const meta = addThemeColorMeta("#f8fafc");
    run();
    expect(meta).toHaveAttribute("content", "rgb(11, 18, 32)");

    restoreComputedStyle();
    restoreComputedStyle = mockPageColor("rgb(248, 250, 252)");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    expect(meta).toHaveAttribute("content", "rgb(248, 250, 252)");
    expect(document.body.querySelector("div")).toBeNull();
  });

  it("never throws, whatever the page has to offer", () => {
    restoreComputedStyle();
    restoreComputedStyle = mockPageColor("");
    expect(() => run()).not.toThrow();
  });
});
