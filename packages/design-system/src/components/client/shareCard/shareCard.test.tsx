import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { cardSwatches, ShareCard } from "./shareCard";

const content = {
  brand: "Volební kalkulačka",
  title: "Moje shoda",
  entries: [{ rank: 1, name: "SPOLU", percentLabel: "87 %", matchPercentage: 87 }],
};

describe("ShareCard", () => {
  it("scales the true-size layout down to the preview width, keeping the format's aspect", () => {
    const { container } = render(<ShareCard content={content} theme="light" format="story" size={180} label="Náhled" />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.width).toBe("180px");
    expect(frame.style.height).toBe("320px");

    const scaled = frame.firstElementChild as HTMLElement;
    expect(scaled.style.width).toBe("1080px");
    expect(scaled.style.transform).toBe(`scale(${180 / 1080})`);
    // The card itself is rendered once the live theme has been read, after mount.
    expect(scaled.querySelector("[data-format='story']")).not.toBeNull();
  });

  it("hides the picture from assistive tech and announces the label instead", () => {
    render(<ShareCard content={content} theme="dark" format="landscape" label="Náhled sdíleného obrázku" />);
    expect(screen.queryByRole("listitem")).toBeNull();
    expect(screen.getByText("Náhled sdíleného obrázku")).toHaveClass("ko:sr-only");
  });
});

describe("cardSwatches", () => {
  it("samples one page-to-surface gradient per theme", () => {
    const swatches = cardSwatches();
    expect(Object.keys(swatches)).toEqual(["light", "dark", "agree", "disagree"]);
    expect(swatches.light).toBe("linear-gradient(135deg, rgb(248 250 252), rgb(255 255 255))");
    expect(swatches.agree).not.toBe(swatches.disagree);
  });
});
