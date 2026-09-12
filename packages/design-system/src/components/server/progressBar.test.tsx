// Ported from kalkulacka-2026/packages/ui/src/meter/meter.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Meter, MeterFillVariants, MeterTrackVariants, ProgressBar } from "./progressBar";

function fillOf(container: HTMLElement): HTMLElement {
  return container.querySelector("[style]") as HTMLElement;
}

describe("Meter", () => {
  it("is decorative (aria-hidden) without a label", () => {
    const { container } = render(<Meter value={72} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
  });

  it("exposes itself as a meter with rounded aria-valuenow when labelled", () => {
    render(<Meter value={63.4} label="Shoda 63 %" />);
    const meter = screen.getByRole("meter", { name: "Shoda 63 %" });
    expect(meter).toHaveAttribute("aria-valuenow", "63");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps values above 100", () => {
    const { container } = render(<Meter value={140} />);
    expect(fillOf(container).style.width).toBe("100%");
  });

  it("clamps values below 0", () => {
    const { container } = render(<Meter value={-20} />);
    expect(fillOf(container).style.width).toBe("0%");
  });

  it("is an agree-toned medium bar by default", () => {
    const { container } = render(<Meter value={50} />);
    expect(container.firstElementChild).toHaveClass("ko:h-2", "ko:rounded-pill", "ko:bg-surface-sunken");
    expect(fillOf(container)).toHaveClass("ko:bg-agree", "ko:animate-meter-grow", "ko:motion-reduce:animate-none");
  });

  it("takes the neutral ink and the small height", () => {
    const { container } = render(<Meter value={50} tone="neutral" size="small" />);
    expect(container.firstElementChild).toHaveClass("ko:h-[0.3125rem]");
    expect(fillOf(container)).toHaveClass("ko:bg-neutral-ink");
    expect(MeterFillVariants({ tone: "neutral" }).split(" ")).not.toContain("ko:bg-agree");
  });

  describe("delay", () => {
    it("staggers the entrance through the animation delay", () => {
      const { container } = render(<Meter value={50} delay={0.6} />);
      expect(fillOf(container).style.animationDelay).toBe("0.6s");
    });

    it("sets no delay at zero", () => {
      const { container } = render(<Meter value={50} />);
      expect(fillOf(container).style.animationDelay).toBe("");
    });

    it("passes a negative delay through, which is an entrance already over", () => {
      const { container } = render(<Meter value={50} delay={-1} />);
      expect(fillOf(container).style.animationDelay).toBe("-1s");
    });
  });

  it("paints an accent over the tone's ink", () => {
    const { container } = render(<Meter value={50} accent="light-dark(#2563eb, #3b82f6)" />);
    // jsdom serialises the hex pair back as rgb(); the light-dark() wrapper is what matters.
    expect(fillOf(container).style.backgroundColor).toMatch(/^light-dark\(rgb\(37, 99, 235\), rgb\(59, 130, 246\)\)$/);
  });

  it("merges a class onto the track", () => {
    const { container } = render(<Meter value={50} className="ko:rounded-none ko:bg-border" />);
    expect(container.firstElementChild).toHaveClass("ko:rounded-none", "ko:bg-border");
    expect(container.firstElementChild).not.toHaveClass("ko:rounded-pill", "ko:bg-surface-sunken");
  });

  describe("legacy aliases", () => {
    it("is exported as ProgressBar too", () => {
      expect(ProgressBar).toBe(Meter);
    });

    it("maps color=primary to the agree tone", () => {
      const { container } = render(<ProgressBar value={50} color="primary" corner="sharp" />);
      expect(fillOf(container)).toHaveClass("ko:bg-agree");
    });

    it("maps color=neutral to the neutral tone", () => {
      const { container } = render(<ProgressBar value={50} color="neutral" />);
      expect(fillOf(container)).toHaveClass("ko:bg-neutral-ink");
    });

    it("lets tone win over color", () => {
      const { container } = render(<ProgressBar value={50} color="primary" tone="neutral" />);
      expect(fillOf(container)).toHaveClass("ko:bg-neutral-ink");
    });

    it("ignores corner — the track is always a pill", () => {
      const { container } = render(<ProgressBar value={50} corner="sharp" />);
      expect(container.firstElementChild).toHaveClass("ko:rounded-pill");
      expect(MeterTrackVariants().split(" ")).toContain("ko:rounded-pill");
    });
  });
});
