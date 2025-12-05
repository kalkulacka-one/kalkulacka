import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field } from "./field";

describe("Field", () => {
  it("should render children", () => {
    render(<Field>Field</Field>);
    expect(screen.getByText("Field")).toBeInTheDocument();
  });
});
