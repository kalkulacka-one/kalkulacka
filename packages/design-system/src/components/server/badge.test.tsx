import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("should render children", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("should have default primary color style", () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText("Badge")).toHaveClass("ko:bg-primary/8", "ko:text-primary", "ko:border-transparent");
  });
});
