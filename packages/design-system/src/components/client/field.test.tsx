import { Field } from "@repo/design-system/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Field", () => {
  it("should render children", () => {
    render(<Field>Field</Field>);
    expect(screen.getByText("Field")).toBeInTheDocument();
  });
});
