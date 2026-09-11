import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { GuideSteps } from "./guide-steps";
import { LocaleProvider } from "./providers";

type Listener = (event: MediaQueryListEvent) => void;

/* jsdom has no `matchMedia`; this stands in for the one query the pointer hook asks. */
function mockPointer(fine: boolean) {
  const listeners = new Set<Listener>();
  const query = {
    matches: fine,
    media: "(hover: hover) and (pointer: fine)",
    addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
  };
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: vi.fn(() => query) });

  return {
    change(next: boolean) {
      query.matches = next;
      for (const listener of listeners) listener({ matches: next } as MediaQueryListEvent);
    },
  };
}

function renderSteps() {
  return render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <GuideSteps />
    </LocaleProvider>,
  );
}

const titles = () => screen.getAllByRole("listitem").map((item) => item.querySelectorAll("p")[0]?.textContent);
const descriptions = () => screen.getAllByRole("listitem").map((item) => item.querySelectorAll("p")[1]?.textContent);

const touchWording = [
  "Táhněte kartu doleva, nebo tapněte na Ano.",
  "Táhněte kartu doprava, nebo tapněte na Ne.",
  "Táhněte kartu šikmo nahoru, nebo tapněte na hvězdičku. Otázka s hvězdičkou má ve výsledku dvojnásobnou váhu.",
  "Otázku, na kterou nechcete odpovídat, táhněte dolů — do výsledku se nezapočítá.",
  "Na konci uvidíte všechny otázky pohromadě a můžete odpovědi ještě změnit.",
];

const pointerWording = [
  "Táhněte kartu doleva, stiskněte šipku vlevo, nebo klikněte na Ano.",
  "Táhněte kartu doprava, stiskněte šipku vpravo, nebo klikněte na Ne.",
  "Táhněte kartu šikmo nahoru, stiskněte šipku nahoru, nebo klikněte na hvězdičku. Otázka s hvězdičkou má ve výsledku dvojnásobnou váhu.",
  "Otázku, na kterou nechcete odpovídat, táhněte dolů nebo stiskněte šipku dolů — do výsledku se nezapočítá.",
  "Na konci uvidíte všechny otázky pohromadě a můžete odpovědi ještě změnit.",
];

describe("GuideSteps", () => {
  afterEach(() => {
    Reflect.deleteProperty(window, "matchMedia");
  });

  it("lists the five steps in the flow's order", () => {
    renderSteps();
    expect(titles()).toEqual(["Ano", "Ne", "Pro mě důležité", "Přeskočit", "Rekapitulace"]);
  });

  it("tells a finger to drag and tap", () => {
    mockPointer(false);
    renderSteps();
    expect(descriptions()).toEqual(touchWording);
  });

  it("tells a mouse about the keys and to click", () => {
    mockPointer(true);
    renderSteps();
    expect(descriptions()).toEqual(pointerWording);
  });

  it("assumes a finger where the pointer cannot be asked", () => {
    renderSteps();
    expect(descriptions()).toEqual(touchWording);
  });

  it("follows a pointer that changes mid-session", () => {
    const pointer = mockPointer(false);
    renderSteps();
    expect(descriptions()).toEqual(touchWording);

    act(() => pointer.change(true));
    expect(descriptions()).toEqual(pointerWording);
  });
});
