import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ScrollMode } from "./scrollMode";

const root = document.documentElement;

function scrollWindowTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true, writable: true });
  window.dispatchEvent(new Event("scroll"));
}

describe("ScrollMode", () => {
  afterEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
    delete root.dataset.koScroll;
    delete root.dataset.koHeaderSurface;
  });

  it("writes the mode on <html>", () => {
    const { rerender } = render(<ScrollMode mode="pinned" />);
    expect(root.dataset.koScroll).toBe("pinned");

    rerender(<ScrollMode mode="document" />);
    expect(root.dataset.koScroll).toBe("document");
  });

  it("removes the attribute on unmount, so a page without a shell has none", () => {
    const { unmount } = render(<ScrollMode mode="document" />);
    expect(root.hasAttribute("data-ko-scroll")).toBe(true);

    unmount();
    expect(root.hasAttribute("data-ko-scroll")).toBe(false);
  });

  it("renders nothing", () => {
    const { container } = render(<ScrollMode mode="pinned" />);
    expect(container).toBeEmptyDOMElement();
  });

  describe("in document mode", () => {
    it("marks the header surface only once the page has scrolled past the dead zone", () => {
      render(<ScrollMode mode="document" />);
      expect(root.hasAttribute("data-ko-header-surface")).toBe(false);

      scrollWindowTo(4);
      expect(root.hasAttribute("data-ko-header-surface")).toBe(false);

      scrollWindowTo(5);
      expect(root.hasAttribute("data-ko-header-surface")).toBe(true);

      scrollWindowTo(0);
      expect(root.hasAttribute("data-ko-header-surface")).toBe(false);
    });

    it("clears the header surface and stops listening on unmount", () => {
      const { unmount } = render(<ScrollMode mode="document" />);
      scrollWindowTo(40);
      expect(root.hasAttribute("data-ko-header-surface")).toBe(true);

      unmount();
      expect(root.hasAttribute("data-ko-header-surface")).toBe(false);

      scrollWindowTo(80);
      expect(root.hasAttribute("data-ko-header-surface")).toBe(false);
    });
  });

  describe("in pinned mode", () => {
    it("never marks the header surface", () => {
      render(<ScrollMode mode="pinned" />);
      scrollWindowTo(40);
      expect(root.hasAttribute("data-ko-header-surface")).toBe(false);
    });
  });
});
