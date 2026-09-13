import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LocaleProvider } from "@/components/providers";
import { enMessages } from "@/locales";

import { AppHeader } from "./app-header";

describe("AppHeader", () => {
  it("renders the heading title when there is no calculator", () => {
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <AppHeader heading={{ title: "Komunální 2026" }} />
      </LocaleProvider>,
    );

    expect(screen.getByText("Komunální 2026")).toBeInTheDocument();
  });
});
