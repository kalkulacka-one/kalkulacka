import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { GuidePractice } from "./guide-practice";
import { LocaleProvider } from "./providers";

/* jsdom has no `matchMedia`; this stands in for the one query the pointer hook asks. */
function mockPointer(fine: boolean) {
  const query = { matches: fine, media: "(hover: hover) and (pointer: fine)", addEventListener: vi.fn(), removeEventListener: vi.fn() };
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: vi.fn(() => query) });
}

function renderPractice() {
  return render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <GuidePractice />
    </LocaleProvider>,
  );
}

const button = (name: string) => screen.getByRole("button", { name });

/* The status under the card — the deck has a live region of its own for the committed answer. */
const status = () => document.querySelector("div[aria-live='polite']");
/* The box the deck sits in, which carries the nudge. */
const stage = () => document.querySelector(".ko-deck")?.parentElement;
const compass = (direction: string) => document.querySelector(`[data-direction="${direction}"]`);

const nudging = "koa:animate-(--ko-animate-practice-nudge)";
const faded = "ko:opacity-45";

describe("GuidePractice", () => {
  afterEach(() => {
    Reflect.deleteProperty(window, "matchMedia");
  });

  describe("before the first gesture", () => {
    it("nudges the card and only counts", () => {
      renderPractice();
      expect(stage()).toHaveClass(nudging);
      expect(status()).toHaveTextContent(/^Vyzkoušeno 0 ze 4$/);
    });

    it("tells a finger how to use the card, with an icon-only compass and no keys", () => {
      renderPractice();
      expect(screen.getByText("Táhněte kartou do vyznačených směrů, nebo tapněte na jednu z možností.")).toBeInTheDocument();
      expect(compass("s")).toHaveTextContent("");
      expect(screen.queryByTitle("Šipka vlevo")).toBeNull();
    });

    it("tells a mouse to click, spells the compass out and lists the keys", () => {
      mockPointer(true);
      renderPractice();
      expect(screen.getByText("Táhněte kartou do vyznačených směrů, nebo klikněte na jednu z možností.")).toBeInTheDocument();
      expect(compass("s")).toHaveTextContent("Přeskočit");
      expect(screen.getByTitle("Šipka vlevo")).toBeInTheDocument();
      expect(screen.getByTitle("Šipka dolů")).toBeInTheDocument();
    });
  });

  describe("explaining a gesture", () => {
    it("names a keyboard answer, counts it and stops nudging", () => {
      renderPractice();
      fireEvent.keyDown(window, { key: "ArrowLeft" });

      expect(status()).toHaveTextContent("Ano — karta šla doleva.");
      expect(status()).toHaveTextContent("Vyzkoušeno 1 ze 4");
      expect(stage()).not.toHaveClass(nudging);
    });

    it("names a tapped answer and resets the card for the next try", async () => {
      const user = userEvent.setup();
      renderPractice();

      await user.click(button("Ne"));
      expect(status()).toHaveTextContent("Ne — karta šla doprava.");
      expect(button("Ne")).toHaveAttribute("aria-pressed", "false");
    });

    it("names the star", async () => {
      const user = userEvent.setup();
      renderPractice();

      await user.click(button("Pro mě důležité"));
      expect(status()).toHaveTextContent("Pro mě důležité — taková otázka má ve výsledku dvojnásobnou váhu.");
      expect(status()).toHaveTextContent("Vyzkoušeno 1 ze 4");
      expect(button("Pro mě důležité")).toHaveAttribute("aria-pressed", "true");
    });

    it("lifts the card away from the skip button and counts the skip", async () => {
      const user = userEvent.setup();
      const { container } = renderPractice();

      await user.click(button("Přeskočit"));
      expect(container.querySelector(".ko-deck-ghost")).not.toBeNull();
      expect(status()).toHaveTextContent("Přeskočeno — do výsledku se nezapočítá.");
      expect(status()).toHaveTextContent("Vyzkoušeno 1 ze 4");
    });

    it("says a repeated gesture again but counts it once", () => {
      renderPractice();
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowLeft" });

      expect(status()).toHaveTextContent("Ano — karta šla doleva.");
      expect(status()).toHaveTextContent("Vyzkoušeno 1 ze 4");
    });

    it("reports the answer when a starred card is answered, counting both", () => {
      renderPractice();
      fireEvent.keyDown(window, { key: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowRight" });

      expect(status()).toHaveTextContent("Ne — karta šla doprava.");
      expect(status()).toHaveTextContent("Vyzkoušeno 2 ze 4");
      expect(button("Pro mě důležité")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("the compass", () => {
    it("fades the directions already tried", () => {
      renderPractice();
      expect(compass("w")).not.toHaveClass(faded);

      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(compass("w")).toHaveClass(faded);
      expect(compass("e")).not.toHaveClass(faded);
    });

    it("counts both diagonals as the one star", () => {
      renderPractice();
      fireEvent.keyDown(window, { key: "ArrowUp" });
      expect(compass("nw")).toHaveClass(faded);
      expect(compass("ne")).toHaveClass(faded);
      expect(compass("s")).not.toHaveClass(faded);
    });
  });

  it("celebrates once all four are in, keeping the last feedback line", () => {
    renderPractice();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(status()).not.toHaveTextContent("Máte to v ruce");

    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(status()).toHaveTextContent("Přeskočeno — do výsledku se nezapočítá.");
    expect(status()).toHaveTextContent("Máte to v ruce. Můžeme začít doopravdy.");
    expect(status()).not.toHaveTextContent("Vyzkoušeno");
  });
});
