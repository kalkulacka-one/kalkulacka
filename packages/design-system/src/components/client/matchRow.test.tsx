import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { partyColor } from "../../utilities/partyColor";
import { MatchRow } from "./matchRow";

/** jsdom serialises a `light-dark(#hex, #hex)` it was given back as `rgb()` pairs; compare like with like. */
function cssColor(value: string): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  return probe.style.backgroundColor;
}

const base = {
  rank: 2,
  name: "Žijeme Pardubice",
  matchPercentage: 74,
  /* The caller formats the label; the no-break space is what keeps "74 %" on one line. */
  percentLabel: "74\u00a0%",
  noAnswerLabel: "Neodpověděli",
  onSelect: () => {},
};

function renderRow(props: Partial<React.ComponentProps<typeof MatchRow>> = {}) {
  const result = render(
    <ul>
      <MatchRow {...base} {...props} />
    </ul>,
  );
  const item = screen.getByRole("listitem");
  const button = screen.getByRole("button");
  return { ...result, item, button };
}

describe("MatchRow", () => {
  it("is a pressable list item wrapping one button", () => {
    const { item, button } = renderRow();
    expect(item).toHaveClass("ko-pressable", "ko:animate-match-row-rise", "ko:motion-reduce:animate-none");
    expect(item.firstElementChild).toBe(button);
    expect(button).not.toBeDisabled();
  });

  it("writes the rank as an ordinal before the name", () => {
    renderRow();
    expect(screen.getByText("2.")).toHaveClass("ko:tabular-nums");
    expect(screen.getByText("Žijeme Pardubice")).toHaveClass("ko:line-clamp-2");
  });

  it("shows the pre-formatted percentage as given", () => {
    renderRow();
    // The default normaliser folds the no-break space into a plain one; the DOM still carries U+00A0.
    expect(screen.getByText("74 %")).toHaveClass("ko:font-display", "ko:whitespace-nowrap");
    expect(screen.getByText("74 %").textContent).toBe("74\u00a0%");
  });

  it("draws the match as a small Meter along the top edge in the candidate's accent", () => {
    const { button } = renderRow();
    const meter = button.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(meter).toHaveClass("ko:absolute", "ko:top-0", "ko:rounded-none", "ko:bg-border", "ko:h-[0.3125rem]");
    const fill = meter.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe("74%");
    expect(fill.style.backgroundColor).toBe(cssColor(partyColor("Žijeme Pardubice")));
    expect(button).toHaveClass("ko:pt-[calc(1rem_+_0.3125rem)]");
  });

  it("takes the data colour over the seeded palette", () => {
    const { button } = renderRow({ color: "#ff0000" });
    expect(button.style.getPropertyValue("--row-accent")).toBe(partyColor("Žijeme Pardubice", "#ff0000"));
    const avatar = button.querySelector("[style*='--avatar-ring']") as HTMLElement;
    expect(avatar.style.getPropertyValue("--avatar-ring")).toContain(partyColor("Žijeme Pardubice", "#ff0000"));
  });

  it("calls onSelect when pressed", () => {
    const onSelect = vi.fn();
    const { button } = renderRow({ onSelect });
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  describe("selected", () => {
    it("presses the button and floats the whole card", () => {
      const { item, button } = renderRow({ selected: true });
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(item).toHaveAttribute("data-open", "");
    });

    it("is neither pressed nor open at rest", () => {
      const { item, button } = renderRow();
      expect(button).toHaveAttribute("aria-pressed", "false");
      expect(item).not.toHaveAttribute("data-open");
    });
  });

  describe("winner", () => {
    it("is the same row one step up, captioned with a tag", () => {
      const { button } = renderRow({ rank: 1, winner: true, winnerLabel: "Největší shoda", matchPercentage: 81, percentLabel: "81\u00a0%" });
      expect(screen.getByText("Největší shoda")).toHaveClass("ko:rounded-pill");
      expect(screen.getByText("Žijeme Pardubice")).toHaveClass("ko:text-base");
      expect(screen.getByText("81 %")).toHaveClass("ko:text-2xl");
      expect(button).toHaveClass("ko:py-6", "ko:pt-[calc(1.5rem_+_0.3125rem)]", "ko:lg:pt-[calc(2rem_+_0.3125rem)]");
    });

    it("gets the large avatar", () => {
      const { button } = renderRow({ winner: true });
      expect(button.querySelector(".ko\\:size-16")).toBeInTheDocument();
    });

    it("is not captioned without a label", () => {
      renderRow({ winner: true });
      expect(screen.queryByText("Největší shoda")).not.toBeInTheDocument();
    });
  });

  describe("a candidate who never answered", () => {
    it("has no bar, no percentage, no ordinal, and says so instead", () => {
      const { item, button } = renderRow({ rank: undefined, matchPercentage: undefined, percentLabel: undefined, name: "Komunistická strana Čech a Moravy" });
      expect(button).toBeDisabled();
      expect(button.querySelector('[aria-hidden="true"].ko\\:absolute')).not.toBeInTheDocument();
      expect(screen.getByText("Neodpověděli")).toHaveClass("ko:text-text-subtle");
      expect(screen.queryByText(/^\d+\.$/)).not.toBeInTheDocument();
      expect(screen.queryByText("74 %")).not.toBeInTheDocument();
      expect(button).toHaveClass("ko:p-4");
      expect(button).not.toHaveClass("ko:pt-[calc(1rem_+_0.3125rem)]");
      expect(item).not.toHaveClass("ko-pressable");
    });

    it("never floats, even when marked selected", () => {
      const { item, button } = renderRow({ matchPercentage: undefined, selected: true });
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(item).not.toHaveAttribute("data-open");
    });
  });

  describe("delay", () => {
    it("staggers the row and its bar together", () => {
      const { item, button } = renderRow({ delay: 0.3 });
      expect(item.style.animationDelay).toBe("0.3s");
      const fill = button.querySelector('[aria-hidden="true"] > div') as HTMLElement;
      expect(fill.style.animationDelay).toBe("0.3s");
    });

    it("sets none at zero", () => {
      const { item } = renderRow();
      expect(item.getAttribute("style")).toBeNull();
    });

    it("passes -1 through as an entrance already over", () => {
      const { item } = renderRow({ delay: -1 });
      expect(item.style.animationDelay).toBe("-1s");
    });
  });

  it("renders the legacy responsive picture set", () => {
    const { button } = renderRow({ avatarImage: { original: "https://example.test/o.png", xs: "https://example.test/xs.png" } });
    expect(button.querySelector("img")).toHaveAttribute("srcset", "https://example.test/xs.png 100w");
  });

  describe("note", () => {
    it("captions the name with it, in the muted ink, on a row that can still be opened", () => {
      const { button } = renderRow({ note: "Postoje podle veřejných zdrojů, strana neodpověděla na zaslané otázky." });
      const note = screen.getByText("Postoje podle veřejných zdrojů, strana neodpověděla na zaslané otázky.");
      expect(note).toHaveClass("ko:text-text-muted");
      expect(note.parentElement).toContainElement(screen.getByText("Žijeme Pardubice"));
      expect(button).not.toBeDisabled();
    });

    it("draws nothing without one", () => {
      renderRow();
      const identity = screen.getByText("Žijeme Pardubice").parentElement?.parentElement as HTMLElement;
      expect(identity.querySelector(".ko\\:text-pretty")).not.toBeInTheDocument();
    });
  });
});
