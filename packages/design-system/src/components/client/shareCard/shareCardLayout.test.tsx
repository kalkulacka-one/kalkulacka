import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ShareCardLayout } from "./shareCardLayout";
import type { CardColorSet } from "./themeColors";

const light: CardColorSet = {
  page: [248, 250, 252],
  surface: [255, 255, 255],
  surfaceSunken: [241, 245, 249],
  text: [30, 41, 59],
  textMuted: [100, 116, 139],
  border: [226, 232, 240],
  agree: [37, 99, 235],
  disagree: [220, 38, 38],
  neutralRaw: [51, 65, 85],
  focus: [37, 99, 235],
};

const content = {
  brand: "Volební kalkulačka",
  electionName: "Komunální volby 2022",
  calculatorName: "Pardubice",
  title: "Moje shoda",
  winnerLabel: "Největší shoda",
  entries: [
    { rank: 1, name: "SPOLU", percentLabel: "87 %", matchPercentage: 87, avatarUrl: "/api/assets/kalkulacka/images/spolu.png" },
    { rank: 2, name: "Piráti a Starostové", percentLabel: "74 %", matchPercentage: 74 },
    { rank: 3, name: "SPD", noAnswerLabel: "Neodpověděli" },
  ],
  url: "volebnikalkulacka.cz",
};

/** The text a sighted reader sees — the avatar's initials are `aria-hidden`, and so is the picture over them. */
function visibleText(node: Node): string {
  if (node instanceof HTMLElement && node.getAttribute("aria-hidden") === "true") return "";
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  return Array.from(node.childNodes).map(visibleText).join("");
}

function renderLayout(props: Partial<React.ComponentProps<typeof ShareCardLayout>> = {}) {
  const { container } = render(<ShareCardLayout content={content} colors={light} theme="light" format="story" {...props} />);
  const card = container.firstElementChild;
  if (!(card instanceof HTMLElement)) throw new Error("No card rendered");
  return card;
}

describe("ShareCardLayout", () => {
  it("is laid out at the format's true export pixels, in its own colour scope", () => {
    const card = renderLayout();
    expect(card.style.width).toBe("1080px");
    expect(card.style.height).toBe("1920px");
    expect(card.dataset.format).toBe("story");
    expect(card.hasAttribute("data-ko-theme-scope")).toBe(true);
    expect(card.style.colorScheme).toBe("light");
    expect(card.style.getPropertyValue("--ko-color-page")).toBe("rgb(248 250 252)");

    expect(renderLayout({ format: "landscape" }).style.width).toBe("1920px");
  });

  it("sets the brand cards in dark ink whatever the document's own mode", () => {
    expect(renderLayout({ theme: "agree" }).style.colorScheme).toBe("dark");
    expect(renderLayout({ theme: "dark" }).style.colorScheme).toBe("dark");
  });

  it("prints the app's own header lockup, the headline and the site", () => {
    renderLayout();
    expect(screen.getByText("Volební kalkulačka", { selector: "p" }).closest("header")).toHaveTextContent("Komunální volby Pardubice 2022");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Moje shoda");
    expect(screen.getByText("volebnikalkulacka.cz")).toBeInTheDocument();
  });

  it("lists the ranking as inert rows, the winner captioned and a silent party labelled", () => {
    renderLayout();
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(rows.map(visibleText)).toEqual(["Největší shoda1.SPOLU87 %", "2.Piráti a Starostové74 %", "3.SPDNeodpověděli"]);
    for (const row of rows) expect(within(row).getByRole("button")).toHaveAttribute("aria-pressed", "false");
    expect(rows[0]?.querySelector("img")).toHaveAttribute("src", "/api/assets/kalkulacka/images/spolu.png");
  });

  it("leaves the site line off when there is none to type in", () => {
    renderLayout({ content: { ...content, url: undefined } });
    expect(screen.queryByText("volebnikalkulacka.cz")).toBeNull();
  });
});
