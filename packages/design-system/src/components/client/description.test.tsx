import { Description, Field } from "@kalkulacka-one/design-system/client";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
