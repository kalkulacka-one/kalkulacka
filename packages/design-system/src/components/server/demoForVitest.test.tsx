import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DemoForVitest } from "./demoForVitest";

describe("Demo component", () => {
  it("Renders demo component with h1 tag", () => {
    render(<DemoForVitest />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/demo/i);
  });
});
