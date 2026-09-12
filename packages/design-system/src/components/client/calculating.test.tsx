import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Calculating, TAPE } from "./calculating";
import { PERCENT_MARK_PATHS } from "./logo";

describe("Calculating", () => {
  it("is a status region that announces the label and nothing else", () => {
    render(<Calculating label="Počítáme vaši shodu" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Počítáme vaši shodu");
    expect(screen.getByText("Počítáme vaši shodu").tagName).toBe("P");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("runs a fixed 24-frame tape of unlabelled marks through a hidden gate", () => {
    const { container } = render(<Calculating label="Počítáme vaši shodu" />);
    expect(TAPE).toHaveLength(24);
    const gate = container.querySelector(".ko-calculating-gate") as HTMLElement;
    expect(gate).toHaveAttribute("aria-hidden", "true");
    const tape = gate.querySelector(".ko-calculating-tape") as HTMLElement;
    expect(tape.children).toHaveLength(24);
    for (const mark of Array.from(tape.children)) expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(tape.children[0]).toHaveClass("ko:bg-agree");
    expect(tape.children[7]).toHaveClass("ko:border-dashed");
  });

  it("perforates the strip top and bottom, one hole per frame, on the tape's own keyframes", () => {
    const { container } = render(<Calculating label="Počítáme vaši shodu" />);
    const sprockets = container.querySelectorAll(".ko-calculating-sprockets");
    expect(sprockets).toHaveLength(2);
    expect(sprockets[0]).toHaveClass("ko:top-2");
    expect(sprockets[1]).toHaveClass("ko:bottom-2");
    expect(sprockets[0]?.children).toHaveLength(24);
  });

  it("counts a ring of the agree ink round a sunken track", () => {
    const { container } = render(<Calculating label="Počítáme vaši shodu" />);
    const circles = container.querySelectorAll("svg circle");
    expect(circles).toHaveLength(2);
    expect(circles[0]).toHaveClass("ko:stroke-surface-sunken");
    expect(circles[1]).toHaveClass("ko-calculating-ring-fill", "ko:stroke-agree");
    expect(circles[1]).toHaveAttribute("stroke-linecap", "round");
  });

  it("resolves onto the logo's own percent mark", () => {
    const { container } = render(<Calculating label="Počítáme vaši shodu" />);
    const mark = container.querySelector(".ko-calculating-percent") as SVGSVGElement;
    expect(mark).toHaveAttribute("height", "34");
    expect(Array.from(mark.querySelectorAll("path")).map((path) => path.getAttribute("d"))).toEqual([...PERCENT_MARK_PATHS]);
  });
});
