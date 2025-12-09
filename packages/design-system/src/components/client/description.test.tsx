import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Description } from "./description";
import { Field } from "./field";

describe("Description", () => {
  it("should render children", () => {
    render(
      // Description requires a relevant parent (https://github.com/tailwindlabs/headlessui)
      <Field>
        <Description>Description</Description>,
      </Field>,
    );
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
