import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field } from "./field";
import { Label } from "./label";

describe("Label", () => {
  it("should render children", () => {
    render(
      // Label requires a relevant parent (https://github.com/tailwindlabs/headlessui)
      <Field>
        <Label>Label</Label>,
      </Field>,
    );
    expect(screen.getByText("Label")).toBeInTheDocument();
  });
});
