import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideComponent } from ".";

describe("GuideComponent", () => {
  it("renders guide text", () => {
    render(<GuideComponent />);

    expect(screen.getByText(/Odpovídejte ANO\/NE nebo otázku přeskočte/)).toBeInTheDocument();
  });

  it("renders scoring explanation cards", () => {
    render(<GuideComponent />);

    expect(screen.getByText("✔✔ Při shodě s Vaší odpovědí strana nebo politik dostane bod")).toBeInTheDocument();
    expect(screen.getByText("✔✘ Při neshodě bod naopak ztratí")).toBeInTheDocument();
    expect(screen.getByText("⭐ Pro vás důležitá témata označte hvězdičkou. Odpověď pak bude mít ve výpočtu shody dvojnásobnou váhu.")).toBeInTheDocument();
  });
});
