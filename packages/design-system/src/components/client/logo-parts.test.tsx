import { 
  LogoCheck, 
  LogoSlash, 
  LogoCross, 
  LogoPercent, 
  LogoPercentNumerator, 
  LogoPercentSlash, 
  LogoPercentDenominator 
} from "@repo/design-system/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("LogoCheck", () => {
  it("renders the SVG as an image", () => {
    render(<LogoCheck />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("includes the correct <title> element inside SVG", () => {
    render(<LogoCheck title="Custom Check" />);
    const title = screen.getByTitle("Custom Check");
    expect(title).toBeInTheDocument();
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

  it("includes the correct <title> element inside SVG", () => {
    render(<LogoSlash title="Custom Slash" />);
    const title = screen.getByTitle("Custom Slash");
    expect(title).toBeInTheDocument();
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

  it("includes the correct <title> element inside SVG", () => {
    render(<LogoCross title="Custom Cross" />);
    const title = screen.getByTitle("Custom Cross");
    expect(title).toBeInTheDocument();
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

  it("includes the correct <title> element inside SVG", () => {
    render(<LogoPercent title="Custom Percent" />);
    const title = screen.getByTitle("Custom Percent");
    expect(title).toBeInTheDocument();
  });

  it("renders with default title", () => {
    render(<LogoPercent />);
    const title = screen.getByTitle("Percent");
    expect(title).toBeInTheDocument();
  });
});

describe("LogoPercentNumerator", () => {
  it("renders the SVG as an image", () => {
    render(<LogoPercentNumerator />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
  });

  it("includes the correct <title> element inside SVG", () => {
    render(<LogoPercentNumerator title="Custom Numerator" />);
    const title = screen.getByTitle("Custom Numerator");
    expect(title).toBeInTheDocument();
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

  it("includes the correct <title> element inside SVG", () => {
    render(<LogoPercentSlash title="Custom Percent Slash" />);
    const title = screen.getByTitle("Custom Percent Slash");
    expect(title).toBeInTheDocument();
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

  it("includes the correct <title> element inside SVG", () => {
    render(<LogoPercentDenominator title="Custom Denominator" />);
    const title = screen.getByTitle("Custom Denominator");
    expect(title).toBeInTheDocument();
  });

  it("renders with default title", () => {
    render(<LogoPercentDenominator />);
    const title = screen.getByTitle("Percent denominator");
    expect(title).toBeInTheDocument();
  });
});
