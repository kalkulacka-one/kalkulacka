// Ported from kalkulacka-2026/packages/ui/src/flow-nav/flow-nav.tsx (the 2026 package carried no tests for it)
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { icons } from "../icons";
import { ButtonVariants } from "./button";
import { FlowNav, FlowNavButtonVariants, type FlowNavProps } from "./flowNav";

const base: FlowNavProps = {
  position: 3,
  total: 42,
  canGoBack: true,
  previousLabel: "Předchozí",
  forwardLabel: "Přeskočit",
  counterLabel: "Otázka 3 ze 42",
  onPrevious: () => {},
  onForward: () => {},
};

const filled = ["ko:bg-neutral-ink", "ko:text-on-neutral-ink", "ko:data-hover:bg-neutral-ink/90", "ko:data-active:bg-neutral-ink/80"];

const classesOf = (...args: Parameters<typeof FlowNavButtonVariants>) => twMerge(FlowNavButtonVariants(...args)).split(" ");

function previous() {
  return screen.getByRole("button", { name: "Předchozí" });
}

function forward(name = "Přeskočit") {
  return screen.getByRole("button", { name });
}

function paths(element: HTMLElement) {
  return Array.from(element.querySelectorAll("path")).map((path) => path.getAttribute("d"));
}

describe("FlowNav", () => {
  it("is a nav row at the fluid nav height with the counter in a centred middle column", () => {
    render(<FlowNav {...base} />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("ko:grid", "ko:grid-cols-[1fr_auto_1fr]", "ko:items-center", "ko:h-fluid-nav", "ko:flex-none");
    expect(nav.children).toHaveLength(3);
    expect(nav.children[1]).toHaveClass("ko:justify-self-center");
  });

  it("labels both controls and wires their callbacks", () => {
    const onPrevious = vi.fn();
    const onForward = vi.fn();
    render(<FlowNav {...base} onPrevious={onPrevious} onForward={onForward} />);

    fireEvent.click(previous());
    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onForward).not.toHaveBeenCalled();

    fireEvent.click(forward());
    expect(onForward).toHaveBeenCalledTimes(1);
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it("reads the forward control as whatever the caller says it does", () => {
    render(<FlowNav {...base} forwardLabel="Další" />);
    expect(forward("Další")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Přeskočit" })).toBeNull();
  });

  describe("the previous control", () => {
    it("is disabled, not hidden, when there is nowhere back to go", () => {
      const onPrevious = vi.fn();
      render(<FlowNav {...base} canGoBack={false} onPrevious={onPrevious} />);
      const button = previous();
      expect(button).toBeDisabled();
      expect(button).toBeVisible();
      fireEvent.click(button);
      expect(onPrevious).not.toHaveBeenCalled();
    });

    it("is enabled when it can go back", () => {
      render(<FlowNav {...base} />);
      expect(previous()).toBeEnabled();
    });

    it("carries the thin left chevron before its label, decoratively", () => {
      render(<FlowNav {...base} />);
      const button = previous();
      expect(paths(button)).toEqual([...icons.chevronLeftThin.paths]);
      const icon = button.querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon?.nextElementSibling).toHaveTextContent("Předchozí");
    });
  });

  describe("the forward control", () => {
    it("carries the thin right chevron after its label, decoratively", () => {
      render(<FlowNav {...base} />);
      const button = forward();
      expect(paths(button)).toEqual([...icons.chevronRightThin.paths]);
      const icon = button.querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon?.previousElementSibling).toHaveTextContent("Přeskočit");
    });

    it("rests as a ghost pill", () => {
      render(<FlowNav {...base} />);
      const button = forward();
      expect(button).toHaveClass("ko:bg-transparent", "ko:data-hover:bg-neutral-wash", "ko:rounded-pill", "ko:justify-self-end", "ko:-mr-3.5");
      expect(button).not.toHaveClass(...filled);
    });

    it("stays filled while the question is explicitly skipped", () => {
      render(<FlowNav {...base} isSkipped />);
      const button = forward();
      expect(button).toHaveClass(...filled);
      expect(button).not.toHaveClass("ko:bg-transparent", "ko:text-neutral-ink", "ko:data-hover:bg-neutral-wash");
      expect(previous()).not.toHaveClass(...filled);
    });

    it("fills like skipped when the answer was just cleared (2026 styles the two identically)", () => {
      render(<FlowNav {...base} attention />);
      const button = forward();
      expect(button).toHaveClass(...filled);
      expect(button).not.toHaveClass("ko:bg-transparent");
    });

    it("can be both skipped and nudged at once", () => {
      render(<FlowNav {...base} isSkipped attention />);
      expect(forward()).toHaveClass(...filled);
    });
  });

  describe("the counter", () => {
    it("speaks the caller's sentence and hides the digits", () => {
      render(<FlowNav {...base} />);
      const spoken = screen.getByText("Otázka 3 ze 42");
      expect(spoken).toHaveClass("ko:sr-only");
      expect(spoken).not.toHaveAttribute("aria-hidden");

      const digits = screen.getByText("3").parentElement;
      expect(digits).toHaveAttribute("aria-hidden", "true");
      expect(digits).toHaveTextContent("3/42");
    });

    it("emphasises the position in tabular figures", () => {
      render(<FlowNav {...base} position={12} total={42} />);
      const position = screen.getByText("12");
      expect(position.tagName).toBe("STRONG");
      expect(position).toHaveClass("ko:font-bold", "ko:text-text-strong");
      const counter = position.closest("p");
      expect(counter).toHaveClass("ko:tabular-nums", "ko:text-text-subtle", "ko:text-[1.0625rem]");
    });
  });

  describe("FlowNavButtonVariants", () => {
    it("starts from Button's small ghost pill", () => {
      const ghost = twMerge(ButtonVariants({ variant: "ghost", size: "small" })).split(" ");
      /* Everything the pill brings, minus what the nav overrides: its spacing, type, and the 45% disabled fade. */
      const kept = ghost.filter((cls) => !/^ko:(px|py|text|font)-/.test(cls) && cls !== "ko:data-disabled:opacity-45");
      expect(kept).toEqual(expect.arrayContaining(["ko:rounded-pill", "ko:bg-transparent", "ko:data-hover:bg-neutral-wash", "ko:data-active:scale-[0.97]", "ko:data-focus:outline-3"]));
      expect(classesOf({ placement: "forward" })).toEqual(expect.arrayContaining(kept));
    });

    it("takes the source's spacing and type over the pill's own", () => {
      const classes = classesOf({ placement: "previous" });
      expect(classes).toEqual(expect.arrayContaining(["ko:px-3.5", "ko:py-[0.4375rem]", "ko:text-[1.0625rem]", "ko:font-bold", "ko:text-neutral-ink", "ko:justify-self-start", "ko:-ml-3.5"]));
      expect(classes).not.toContain("ko:px-4");
      expect(classes).not.toContain("ko:py-2");
      expect(classes).not.toContain("ko:text-sm");
      expect(classes).not.toContain("ko:font-semibold");
      expect(classes).not.toContain("ko:text-text");
    });

    it("reads disabled in the subtle colour at full opacity", () => {
      const classes = classesOf({ placement: "previous" });
      expect(classes).toEqual(expect.arrayContaining(["ko:data-disabled:text-text-subtle", "ko:data-disabled:opacity-100", "ko:data-disabled:cursor-default"]));
      expect(classes).not.toContain("ko:data-disabled:opacity-45");
    });

    it("fills the skipped state with the solid neutral", () => {
      const classes = classesOf({ placement: "forward", skipped: true });
      expect(classes).toEqual(expect.arrayContaining(filled));
      expect(classes).not.toContain("ko:bg-transparent");
      expect(classes).not.toContain("ko:data-hover:bg-neutral-wash");
    });
  });
});
