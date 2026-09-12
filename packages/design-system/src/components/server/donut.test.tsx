import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CIRCUMFERENCE, Donut, type DonutSegment, GAP } from "./donut";

const segments: DonutSegment[] = [
  { tone: "agree", value: 24, label: "Souhlas" },
  { tone: "disagree", value: 12, label: "Nesouhlas" },
  { tone: "none", value: 6, label: "Bez odpovědi" },
];

function segmentsOf(container: HTMLElement): SVGCircleElement[] {
  // The first circle is the track.
  return Array.from(container.querySelectorAll("circle")).slice(1);
}

describe("Donut", () => {
  it("draws the centre figure and its caption", () => {
    render(<Donut segments={segments} centerValue="42" centerLabel="otázek" />);
    expect(screen.getByText("42")).toHaveClass("ko:font-display");
    expect(screen.getByText("otázek")).toBeInTheDocument();
  });

  it("hides the ring from assistive tech and sizes it in px", () => {
    const { container } = render(<Donut segments={segments} centerValue="42" centerLabel="otázek" size={100} />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("ko:-rotate-90");
    expect((svg.parentElement as HTMLElement).style.width).toBe("100px");
  });

  it("draws one segment per non-zero value, each shortened by the gap and offset by what came before", () => {
    const { container } = render(<Donut segments={segments} centerValue="42" centerLabel="otázek" />);
    const circles = segmentsOf(container);
    expect(circles).toHaveLength(3);

    const agreeArc = (24 / 42) * CIRCUMFERENCE;
    const disagreeArc = (12 / 42) * CIRCUMFERENCE;
    expect(circles[0]).toHaveAttribute("stroke-dasharray", `${agreeArc - GAP} ${CIRCUMFERENCE - (agreeArc - GAP)}`);
    expect(circles[0]).toHaveAttribute("stroke-dashoffset", "0");
    expect(circles[1]).toHaveAttribute("stroke-dashoffset", `${-agreeArc}`);
    expect(circles[2]).toHaveAttribute("stroke-dashoffset", `${-(agreeArc + disagreeArc)}`);
    expect(circles[0]).toHaveClass("ko:stroke-agree");
    expect(circles[1]).toHaveClass("ko:stroke-disagree");
    expect(circles[2]).toHaveClass("ko:stroke-text-muted/55");
    expect(circles[0]).toHaveAttribute("stroke-linecap", "butt");
  });

  it("drops zero-value segments rather than drawing stray dots", () => {
    const { container } = render(
      <Donut
        segments={[
          { tone: "agree", value: 30, label: "Souhlas" },
          { tone: "disagree", value: 0, label: "Nesouhlas" },
          { tone: "neutral", value: 0, label: "Nevím" },
          { tone: "none", value: 12, label: "Bez odpovědi" },
        ]}
        centerValue="42"
        centerLabel="otázek"
      />,
    );
    const circles = segmentsOf(container);
    expect(circles).toHaveLength(2);
    expect(circles[0]).toHaveClass("ko:stroke-agree");
    expect(circles[1]).toHaveClass("ko:stroke-text-muted/55");
  });

  it("gives a lone segment the full ring, without a gap", () => {
    const { container } = render(<Donut segments={[{ tone: "agree", value: 42, label: "Souhlas" }]} centerValue="42" centerLabel="otázek" />);
    const circles = segmentsOf(container);
    expect(circles).toHaveLength(1);
    expect(circles[0]).toHaveAttribute("stroke-dasharray", `${CIRCUMFERENCE} 0`);
  });

  it("draws only the track when nothing has a value", () => {
    const { container } = render(<Donut segments={[{ tone: "agree", value: 0, label: "Souhlas" }]} centerValue="0" centerLabel="otázek" />);
    expect(segmentsOf(container)).toHaveLength(0);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("lists the non-zero segments in a legend with their counts", () => {
    render(
      <Donut
        segments={[
          { tone: "agree", value: 18, label: "Souhlas" },
          { tone: "disagree", value: 0, label: "Nesouhlas" },
          { tone: "neutral", value: 7, label: "Nevím" },
        ]}
        centerValue="42"
        centerLabel="otázek"
      />,
    );
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Souhlas18");
    expect(items[1]).toHaveTextContent("Nevím7");
    expect(items[0]?.querySelector('[aria-hidden="true"]')).toHaveClass("ko:bg-agree");
    expect(items[1]?.querySelector('[aria-hidden="true"]')).toHaveClass("ko:bg-neutral-ink");
    expect(screen.queryByText("Nesouhlas")).not.toBeInTheDocument();
  });
});
