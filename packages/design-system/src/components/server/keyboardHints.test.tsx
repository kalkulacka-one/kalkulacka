// Ported from kalkulacka-2026/packages/ui/src/keyboard-hints/keyboard-hints.tsx (the 2026 package carried no tests for it)
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { icons } from "../icons";
import { type KeyboardHint, KeyboardHints } from "./keyboardHints";

/* The five hints the question flow shows. */
const hints: KeyboardHint[] = [
  { keys: [{ icon: icons.arrowLeft, label: "Šipka vlevo" }], label: "Ano" },
  { keys: [{ icon: icons.arrowRight, label: "Šipka vpravo" }], label: "Ne" },
  { keys: [{ icon: icons.arrowUp, label: "Šipka nahoru" }], label: "Důležité" },
  { keys: [{ icon: icons.arrowDown, label: "Šipka dolů" }], label: "Přeskočit" },
  { keys: [",", "."], label: "Procházet bez odpovědi" },
];

function caps(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("kbd"));
}

function paths(element: HTMLElement) {
  return Array.from(element.querySelectorAll("path")).map((path) => path.getAttribute("d"));
}

describe("KeyboardHints", () => {
  it("lists every hint with its label", () => {
    const { container } = render(<KeyboardHints hints={hints} />);
    expect(container.firstElementChild?.children).toHaveLength(hints.length);
    for (const hint of hints) {
      expect(container).toHaveTextContent(hint.label);
    }
  });

  it("draws one <kbd> cap per key, in order", () => {
    const { container } = render(<KeyboardHints hints={hints} />);
    expect(caps(container)).toHaveLength(6);
    const [comma, period] = caps(container).slice(-2);
    expect(comma).toHaveTextContent(",");
    expect(period).toHaveTextContent(".");
    expect(comma?.parentElement).toBe(period?.parentElement);
  });

  it("draws an icon key as the icon, named for a screen reader", () => {
    const { container } = render(<KeyboardHints hints={hints} />);
    const left = screen.getByRole("img", { name: "Šipka vlevo" });
    expect(left.closest("kbd")).not.toBeNull();
    expect(paths(left.closest("kbd") as HTMLElement)).toEqual([...icons.arrowLeft.paths]);
    expect(screen.getByRole("img", { name: "Šipka dolů" })).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });

  it("accepts a raw path as an icon key", () => {
    const { container } = render(<KeyboardHints hints={[{ keys: [{ icon: "M4 4 L20 20", label: "Enter" }], label: "Potvrdit" }]} />);
    expect(screen.getByRole("img", { name: "Enter" })).toBeInTheDocument();
    expect(paths(container)).toEqual(["M4 4 L20 20"]);
  });

  it("styles a cap as a small surface tile with a hairline inset border", () => {
    const { container } = render(<KeyboardHints hints={hints} />);
    for (const cap of caps(container)) {
      expect(cap).toHaveClass(
        "ko:inline-flex",
        "ko:min-w-6",
        "ko:h-6",
        "ko:rounded-chip",
        "ko:bg-surface",
        "ko:shadow-[inset_0_0_0_1px_var(--ko-color-border-strong)]",
        "ko:text-[0.8125rem]",
        "ko:font-medium",
        "ko:text-text",
      );
    }
  });

  it("is hidden below the desk breakpoint but stays in the accessibility tree", () => {
    const { container } = render(<KeyboardHints hints={hints} />);
    const root = container.firstElementChild;
    expect(root).toHaveClass("ko:hidden", "ko:desk:flex", "ko:text-text-muted", "ko:text-sm");
    expect(root).not.toHaveAttribute("aria-hidden");
    expect(container.querySelector("[aria-hidden='true']:not(svg)")).toBeNull();
  });

  it("holds nothing interactive", () => {
    render(<KeyboardHints hints={hints} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
