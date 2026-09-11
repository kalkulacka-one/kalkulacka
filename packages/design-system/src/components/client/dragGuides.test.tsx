import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { icons } from "../icons";
import { DRAG_DIRECTIONS, DragGuides } from "./dragGuides";

const labels = {
  agree: "Ano",
  disagree: "Ne",
  important: "Pro mě důležité",
  skip: "Přeskočit",
};

function pills(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-direction]"));
}

function pill(container: HTMLElement, direction: string) {
  const element = container.querySelector<HTMLElement>(`[data-direction="${direction}"]`);
  if (!element) throw new Error(`No pill for ${direction}`);
  return element;
}

function paths(element: HTMLElement) {
  return Array.from(element.querySelectorAll("path")).map((path) => path.getAttribute("d"));
}

describe("DragGuides", () => {
  it("draws one pill per direction, in compass order, hidden from assistive tech", () => {
    const { container } = render(<DragGuides labels={labels} />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("ko:absolute", "ko:pointer-events-none", "ko:z-1");
    expect(pills(container).map((element) => element.dataset.direction)).toEqual([...DRAG_DIRECTIONS]);
    expect(DRAG_DIRECTIONS).toEqual(["nw", "w", "ne", "e", "s"]);
  });

  it("places the diagonals along the top edge and the answers along the bottom", () => {
    const { container } = render(<DragGuides labels={labels} />);
    expect(pill(container, "nw")).toHaveClass("ko:top-0", "ko:left-0");
    expect(pill(container, "ne")).toHaveClass("ko:top-0", "ko:right-0");
    expect(pill(container, "w")).toHaveClass("ko:bottom-0", "ko:left-0");
    expect(pill(container, "e")).toHaveClass("ko:bottom-0", "ko:right-0");
    expect(pill(container, "s")).toHaveClass("ko:bottom-0", "ko:left-1/2", "ko:-translate-x-1/2");
  });

  describe("touch (the default)", () => {
    it("is icon-only", () => {
      const { container } = render(<DragGuides labels={labels} />);
      expect(container).not.toHaveTextContent("Ano");
      expect(container).not.toHaveTextContent("Přeskočit");
      expect(container).not.toHaveTextContent("Pro mě důležité");
    });

    it("draws each diagonal as one rotated arrow plus a star", () => {
      const { container } = render(<DragGuides labels={labels} />);
      const nw = pill(container, "nw");
      expect(paths(nw)).toEqual([...icons.arrowLeft.paths, ...icons.starThin.paths]);
      expect(nw.querySelector("svg")).toHaveClass("ko:rotate-45");

      const ne = pill(container, "ne");
      expect(paths(ne)).toEqual([...icons.arrowLeft.paths, ...icons.starThin.paths]);
      expect(ne.querySelector("svg")).toHaveClass("ko:rotate-[135deg]");
    });

    it("draws the straight directions as a single arrow", () => {
      const { container } = render(<DragGuides labels={labels} />);
      expect(paths(pill(container, "w"))).toEqual([...icons.arrowLeft.paths]);
      expect(paths(pill(container, "e"))).toEqual([...icons.arrowRight.paths]);
      expect(paths(pill(container, "s"))).toEqual([...icons.arrowDown.paths]);
    });
  });

  describe("split (a mouse)", () => {
    it("spells every direction out", () => {
      const { container } = render(<DragGuides labels={labels} split />);
      expect(pill(container, "w")).toHaveTextContent("Ano");
      expect(pill(container, "e")).toHaveTextContent("Ne");
      expect(pill(container, "s")).toHaveTextContent("Přeskočit");
      expect(pill(container, "nw")).toHaveTextContent("Pro mě důležité");
      expect(pill(container, "ne")).toHaveTextContent("Pro mě důležité");
    });

    it("decomposes the diagonals into an up arrow and the answer's own arrow", () => {
      const { container } = render(<DragGuides labels={labels} split />);
      expect(paths(pill(container, "nw"))).toEqual([...icons.arrowUp.paths, ...icons.arrowLeft.paths]);
      expect(paths(pill(container, "ne"))).toEqual([...icons.arrowUp.paths, ...icons.arrowRight.paths]);
      expect(pill(container, "nw").querySelector("svg")).not.toHaveClass("ko:rotate-45");
    });
  });

  it("fades the directions already practised", () => {
    const { container } = render(<DragGuides labels={labels} practised={new Set(["w", "s"] as const)} />);
    expect(pill(container, "w")).toHaveClass("ko:opacity-45");
    expect(pill(container, "s")).toHaveClass("ko:opacity-45");
    expect(pill(container, "e")).not.toHaveClass("ko:opacity-45");
    expect(pill(container, "nw")).not.toHaveClass("ko:opacity-45");
  });

  it("lights the direction the drag is pointing at as a filled neutral pill", () => {
    const { container } = render(<DragGuides labels={labels} active="ne" />);
    const ne = pill(container, "ne");
    expect(ne).toHaveClass("ko:bg-neutral-ink", "ko:text-on-neutral-ink", "ko:scale-[1.08]", "ko:motion-reduce:scale-100");
    expect(ne).not.toHaveClass("ko:bg-surface", "ko:text-text-muted");

    const w = pill(container, "w");
    expect(w).toHaveClass("ko:bg-surface", "ko:text-text-muted");
    expect(w).not.toHaveClass("ko:bg-neutral-ink");
  });

  it("lets an active pill outrank its practised fade", () => {
    const { container } = render(<DragGuides labels={labels} practised={new Set(["w"] as const)} active="w" />);
    const w = pill(container, "w");
    expect(w).toHaveClass("ko:opacity-100", "ko:bg-neutral-ink");
    expect(w).not.toHaveClass("ko:opacity-45");
  });
});
