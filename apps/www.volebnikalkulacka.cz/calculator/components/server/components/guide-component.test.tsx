import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideComponent } from ".";

describe("GuideComponent", () => {
  it("renders", () => {
    render(<GuideComponent />);
    expect(screen.getByText("Shoda")).toBeInTheDocument();
  });
});
