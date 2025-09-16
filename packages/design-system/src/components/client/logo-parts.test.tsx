import { LogoCheck, LogoCross, LogoPercent, LogoPercentDenominator, LogoPercentNumerator, LogoPercentSlash, LogoSlash } from "@repo/design-system/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("LogoCheck", () => {
  it("renders the SVG as an image", () => {
    render(<LogoCheck />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("renders with default title", () => {
    render(<LogoCheck />);
    const title = screen.getByTitle("Check");
    expect(title).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<LogoCheck className="custom-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("custom-class");
  });
});

describe("LogoSlash", () => {
  it("renders the SVG as an image", () => {
    render(<LogoSlash />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("renders with default title", () => {
    render(<LogoSlash />);
    const title = screen.getByTitle("Slash");
    expect(title).toBeInTheDocument();
  });
});

describe("LogoCross", () => {
  it("renders the SVG as an image", () => {
    render(<LogoCross />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("renders with default title", () => {
    render(<LogoCross />);
    const title = screen.getByTitle("Cross");
    expect(title).toBeInTheDocument();
  });
});

describe("LogoPercent", () => {
  it("renders the SVG as an image", () => {
    render(<LogoPercent />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("renders with default aria-label", () => {
    render(<LogoPercent />);
    const element = screen.getByLabelText("Percent");
    expect(element).toBeInTheDocument();
  });
});

describe("LogoPercentNumerator", () => {
  it("renders the SVG as an image", () => {
    render(<LogoPercentNumerator />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("renders with default title", () => {
    render(<LogoPercentNumerator />);
    const title = screen.getByTitle("Percent numerator");
    expect(title).toBeInTheDocument();
  });
});

describe("LogoPercentSlash", () => {
  it("renders the SVG as an image", () => {
    render(<LogoPercentSlash />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("renders with default title", () => {
    render(<LogoPercentSlash />);
    const title = screen.getByTitle("Percent slash");
    expect(title).toBeInTheDocument();
  });
});

describe("LogoPercentDenominator", () => {
  it("renders the SVG as an image", () => {
    render(<LogoPercentDenominator />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("renders with default title", () => {
    render(<LogoPercentDenominator />);
    const title = screen.getByTitle("Percent denominator");
    expect(title).toBeInTheDocument();
  });
});
