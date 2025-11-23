import { Field } from "@kalkulacka-one/design-system/client";

import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Field", () => {
  it("should render children", () => {
    render(<Field>Field</Field>);
    expect(screen.getByText("Field")).toBeInTheDocument();
  });
});
