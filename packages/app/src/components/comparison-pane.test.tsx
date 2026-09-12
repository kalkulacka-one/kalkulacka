import type { Answer, CandidatesAnswers } from "@kalkulacka-one/schema";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EXIT_MS, SHEET_QUERY } from "@/client/hooks";
import { AnswersStoreContext, CalculatorStoreContext, createAnswersStore, createCalculatorStore } from "@/client/stores";
import { useCalculatedMatches, useResult } from "@/client/view-models";
import type { CalculatorData } from "@/data-fetching";
import { csMessages } from "@/locales";

import { CLOSE_MS, ComparisonPane } from "./comparison-pane";
import { LocaleProvider } from "./providers";

const questionIds = ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222", "33333333-3333-4333-8333-333333333333", "44444444-4444-4444-8444-444444444444"] as const;
const [q1, q2, q3, q4] = questionIds;

const ids = {
  alfa: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  beta: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  gama: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  delta: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
} as const;

type CandidateAnswers = CandidatesAnswers[string];

const answersFor = (entries: Partial<Record<(typeof questionIds)[number], { answer: boolean | null; comment?: string }>>): CandidateAnswers =>
  Object.entries(entries).map(([questionId, { answer, comment }]) => ({ questionId, answer, ...(comment ? { comment } : {}) }));

/*
 * Against the reader's answers below (yes, no starred, skipped, "nevím"):
 *
 *   alfa   yes (with a comment), yes, no, yes → q1 match, q2 mismatch, q4 none
 *   beta   nevím, no, –, nevím               → q1 none, q2 match, q4 none — no mismatch to filter by
 *   gama   no, yes, –, –                      → q1 mismatch, q2 mismatch, q4 none — no match to filter by
 *   delta  nevím on everything                → nothing to filter by at all
 */
const candidatesAnswers: CandidatesAnswers = {
  [ids.alfa]: answersFor({ [q1]: { answer: true, comment: "Souhlasíme, i když s výhradami." }, [q2]: { answer: true }, [q3]: { answer: false }, [q4]: { answer: true } }),
  [ids.beta]: answersFor({ [q1]: { answer: null }, [q2]: { answer: false }, [q4]: { answer: null } }),
  [ids.gama]: answersFor({ [q1]: { answer: false }, [q2]: { answer: true } }),
  [ids.delta]: answersFor({ [q1]: { answer: null }, [q2]: { answer: null }, [q4]: { answer: null } }),
};

const calculatorData: CalculatorData = {
  data: {
    calculator: { id: "00000000-0000-4000-8000-000000000000", createdAt: new Date(0).toISOString(), key: "kalkulacka", shortTitle: "Sněmovní 2025" },
    questions: questionIds.map((id, index) => ({ id, title: `Otázka ${index + 1}`, statement: `Tvrzení ${index + 1}` })),
    candidates: [
      { id: ids.alfa, displayName: "Alfa", references: [] },
      { id: ids.beta, displayName: "Beta", references: [] },
      { id: ids.gama, displayName: "Gama", references: [] },
      { id: ids.delta, displayName: "Delta", references: [] },
    ],
    candidatesAnswers,
  },
  baseUrl: "https://data.kalkulacka.one/kalkulacka",
};

const userAnswers: Answer[] = [{ questionId: q1, answer: true }, { questionId: q2, answer: false, isImportant: true }, { questionId: q3 }, { questionId: q4, answer: null }];

/** The same answers with nothing starred — for the case where no filter would leave anything. */
const unstarredAnswers: Answer[] = userAnswers.map((answer) => ({ ...answer, isImportant: undefined }));

const percent = (value: number) => `${Math.round(value)} %`;

/** Stands in for the result page: owns `selectedId`, and hands the pane the same ranked list the page does. */
function Harness({ initialId }: { initialId?: string }) {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);
  const { matches } = useResult(useCalculatedMatches());

  return (
    <>
      {(["alfa", "beta", "gama", "delta"] as const).map((key) => (
        <button key={key} type="button" onClick={() => setSelectedId(ids[key])}>
          Otevřít {key}
        </button>
      ))}
      <ComparisonPane matches={matches} selectedId={selectedId} onClose={() => setSelectedId(undefined)} formatPercent={percent}>
        <p>Přehled</p>
      </ComparisonPane>
    </>
  );
}

function renderPane({ answers = userAnswers, initialId }: { answers?: Answer[]; initialId?: string } = {}) {
  const answersStore = createAnswersStore();
  answersStore.getState().setAnswers(answers);

  return render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <CalculatorStoreContext.Provider value={createCalculatorStore(calculatorData)}>
        <AnswersStoreContext.Provider value={answersStore}>
          <Harness initialId={initialId} />
        </AnswersStoreContext.Provider>
      </CalculatorStoreContext.Provider>
    </LocaleProvider>,
  );
}

const opener = (key: "alfa" | "beta" | "gama" | "delta") => screen.getByRole("button", { name: `Otevřít ${key}` });
const open = (key: "alfa" | "beta" | "gama" | "delta") => {
  // A real click focuses the button first; the pane remembers that as the way back.
  opener(key).focus();
  fireEvent.click(opener(key));
};
const pane = () => document.querySelector("section") as HTMLElement;
const heading = (name: string) => screen.getByRole("heading", { level: 2, name });
const closeButton = () => screen.getByRole("button", { name: "Zavřít porovnání" });
const chips = () => within(screen.getByRole("group", { name: "Filtrovat odpovědi" })).getAllByRole("button");
const rows = () => within(screen.getByRole("list")).getAllByRole("listitem");
const statements = () => rows().map((row) => within(row as HTMLElement).getByText(/^Tvrzení/).textContent);

const nestedIds = {
  koalice: "10101010-1010-4101-8101-101010101010",
  marie: "20202020-2020-4202-8202-202020202020",
  martin: "30303030-3030-4303-8303-303030303030",
  magda: "40404040-4040-4404-8404-404040404040",
} as const;

/** A party that voted nothing itself: on q1 two of its three councillors voted yes, on q2 they split evenly. */
const nestedCalculatorData: CalculatorData = {
  ...calculatorData,
  data: {
    ...calculatorData.data,
    candidates: [
      {
        id: nestedIds.koalice,
        displayName: "Koalice",
        references: [],
        nestedCandidates: [
          { id: nestedIds.marie, displayName: "Marie", references: [] },
          { id: nestedIds.martin, displayName: "Martin", references: [] },
          { id: nestedIds.magda, displayName: "Magda", references: [] },
        ],
      },
    ],
    candidatesAnswers: {
      [nestedIds.marie]: answersFor({ [q1]: { answer: true }, [q2]: { answer: true } }),
      [nestedIds.martin]: answersFor({ [q1]: { answer: true }, [q2]: { answer: false } }),
      [nestedIds.magda]: answersFor({ [q1]: { answer: false } }),
    },
  },
};

function NestedHarness() {
  const { matches } = useResult(useCalculatedMatches());
  return (
    <ComparisonPane matches={matches} selectedId={nestedIds.koalice} onClose={() => {}} formatPercent={percent}>
      <p>Přehled</p>
    </ComparisonPane>
  );
}

function renderNestedPane() {
  const answersStore = createAnswersStore();
  answersStore.getState().setAnswers(userAnswers);

  return render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <CalculatorStoreContext.Provider value={createCalculatorStore(nestedCalculatorData)}>
        <AnswersStoreContext.Provider value={answersStore}>
          <NestedHarness />
        </AnswersStoreContext.Provider>
      </CalculatorStoreContext.Provider>
    </LocaleProvider>,
  );
}

describe("ComparisonPane", () => {
  describe("a candidate whose answers are its members'", () => {
    it("says once, at the top, that every mark is a majority", () => {
      renderNestedPane();
      expect(screen.getAllByText("Značka ukazuje, jak hlasovala většina zastupitelů za tuto stranu.")).toHaveLength(1);
    });

    it("marks the majority and counts it under the statement", () => {
      renderNestedPane();
      const q1Row = rows()[0] as HTMLElement;
      expect(within(q1Row).getByRole("img", { name: "Koalice: Ano, Shodně hlasovalo 2 z 3 zastupitelů" })).toBeInTheDocument();
      expect(within(q1Row).getByText("Shodně hlasovalo 2 z 3 zastupitelů")).toBeInTheDocument();
    });

    it("leaves an evenly split question unmarked, with no count to explain", () => {
      renderNestedPane();
      const q2Row = rows()[1] as HTMLElement;
      expect(within(q2Row).getByRole("img", { name: "Koalice: Bez odpovědi" })).toBeInTheDocument();
      expect(within(q2Row).queryByText(/Shodně hlasovalo/)).toBeNull();
    });

    it("says nothing about majorities for a candidate that answered for itself", () => {
      renderPane({ initialId: ids.alfa });
      expect(screen.queryByText(/Značka ukazuje/)).toBeNull();
      expect(screen.queryByText(/Shodně hlasovalo/)).toBeNull();
    });
  });

  describe("holding the dashboard", () => {
    it("shows the children in an unnamed, unstyled box while nothing is selected", () => {
      renderPane();
      expect(screen.getByText("Přehled")).toBeInTheDocument();
      expect(pane()).toHaveClass("ko-comparison-pane");
      expect(pane()).not.toHaveAttribute("data-open");
      expect(pane()).not.toHaveAttribute("aria-labelledby");
      expect(screen.queryByRole("region")).toBeNull();
    });
  });

  describe("opening", () => {
    it("names the region after the candidate, lands focus on that name, and shows the percent", () => {
      renderPane();
      open("alfa");

      const region = screen.getByRole("region", { name: "Alfa" });
      expect(region).toBe(pane());
      expect(region).toHaveAttribute("data-open");
      expect(heading("Alfa")).toHaveFocus();
      expect(heading("Alfa")).toHaveAttribute("tabindex", "-1");
      expect(within(region).getByText(/^\d+ %$/)).toBeInTheDocument();
      expect(screen.queryByText("Přehled")).toBeNull();
    });

    it("lists only the questions the reader answered, in question order, with both marks named", () => {
      renderPane();
      open("alfa");

      // q3 was skipped — it says nothing about either side, so it is not a row.
      // The starred one carries its off-screen marker in the same paragraph.
      expect(statements()).toEqual(["Tvrzení 1", "Tvrzení 2 (Pro mě důležité)", "Tvrzení 4"]);

      const [first, second, third] = rows() as HTMLElement[];
      expect(within(first as HTMLElement).getByRole("img", { name: "Alfa: Ano" })).toBeInTheDocument();
      expect(within(first as HTMLElement).getByRole("img", { name: "Vy: Ano" })).toBeInTheDocument();
      expect(within(first as HTMLElement).getByText("Souhlasíme, i když s výhradami.")).toBeInTheDocument();
      expect(within(second as HTMLElement).getByRole("img", { name: "Vy: Ne" })).toBeInTheDocument();
      expect(within(second as HTMLElement).getByText("(Pro mě důležité)")).toBeInTheDocument();
      // An explicit "nevím" is a real answer, drawn as one.
      expect(within(third as HTMLElement).getByRole("img", { name: "Vy: Nevím" })).toHaveClass("ko:bg-neutral-ink");
    });

    it("moves focus to the new name when another candidate is picked while one is open", () => {
      renderPane();
      open("alfa");
      fireEvent.click(opener("beta"));

      expect(screen.getByRole("region", { name: "Beta" })).toBeInTheDocument();
      expect(heading("Beta")).toHaveFocus();
      expect(pane()).not.toHaveAttribute("data-closing");
    });
  });

  describe("filters", () => {
    it("counts every filter, and narrows the rows to the one picked", () => {
      renderPane();
      open("alfa");

      expect(chips().map((chip) => chip.textContent)).toEqual(["Vše3", "Shody1", "Neshody1", "Důležité1"]);
      expect(chips()[0]).toHaveAttribute("aria-pressed", "true");

      fireEvent.click(screen.getByRole("button", { name: /Neshody/ }));
      expect(statements()).toEqual(["Tvrzení 2 (Pro mě důležité)"]);

      fireEvent.click(screen.getByRole("button", { name: /Shody/ }));
      expect(statements()).toEqual(["Tvrzení 1"]);

      fireEvent.click(screen.getByRole("button", { name: /Důležité/ }));
      expect(statements()).toEqual(["Tvrzení 2 (Pro mě důležité)"]);
    });

    it("offers a filter only where it would leave something", () => {
      renderPane();

      // A "nevím" on either side is neither a match nor a mismatch.
      open("beta");
      expect(chips().map((chip) => chip.textContent)).toEqual(["Vše3", "Shody1", "Důležité1"]);

      open("gama");
      expect(chips().map((chip) => chip.textContent)).toEqual(["Vše3", "Neshody2", "Důležité1"]);
    });

    it("shows no filter row at all when nothing could be filtered", () => {
      renderPane({ answers: unstarredAnswers });
      open("delta");

      expect(screen.queryByRole("group", { name: "Filtrovat odpovědi" })).toBeNull();
      expect(statements()).toEqual(["Tvrzení 1", "Tvrzení 2", "Tvrzení 4"]);
    });

    it("starts over on the filter when a different candidate opens", () => {
      renderPane();
      open("alfa");
      fireEvent.click(screen.getByRole("button", { name: /Neshody/ }));
      expect(statements()).toEqual(["Tvrzení 2 (Pro mě důležité)"]);

      fireEvent.click(opener("gama"));
      expect(screen.getByRole("button", { name: /Vše/ })).toHaveAttribute("aria-pressed", "true");
      expect(statements()).toEqual(["Tvrzení 1", "Tvrzení 2 (Pro mě důležité)", "Tvrzení 4"]);
    });
  });

  describe("closing", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("keeps the comparison rendered for the exit beat after the close button, then hands the box back", () => {
      renderPane();
      open("alfa");
      fireEvent.click(closeButton());

      // Told to close, but still on screen — this is what the exit animation
      // plays on. `data-open` stays too: the box still *holds* a comparison,
      // and the CSS lets the later `data-closing` rule take the animation.
      expect(pane()).toHaveAttribute("data-closing");
      expect(pane()).toHaveAttribute("data-open");
      expect(heading("Alfa")).toBeInTheDocument();
      expect(screen.queryByText("Přehled")).toBeNull();

      act(() => {
        vi.advanceTimersByTime(CLOSE_MS - 1);
      });
      expect(heading("Alfa")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
      expect(screen.getByText("Přehled")).toBeInTheDocument();
      expect(pane()).not.toHaveAttribute("data-closing");
      expect(pane()).not.toHaveAttribute("data-open");
      expect(pane()).not.toHaveAttribute("aria-labelledby");
    });

    it("returns focus to whatever opened it", () => {
      renderPane();
      open("alfa");
      expect(heading("Alfa")).toHaveFocus();

      fireEvent.click(closeButton());
      expect(opener("alfa")).toHaveFocus();
    });

    it("closes on Escape from anywhere on the page — but not while a dialog is up", () => {
      renderPane();
      open("alfa");

      const dialog = document.createElement("dialog");
      dialog.setAttribute("open", "");
      document.body.append(dialog);
      fireEvent.keyDown(window, { key: "Escape" });
      expect(pane()).toHaveAttribute("data-open");
      dialog.remove();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(pane()).toHaveAttribute("data-closing");
      expect(opener("alfa")).toHaveFocus();
    });

    it("remembers the way back only on the way in, so a switch mid-comparison does not reroute it", () => {
      renderPane();
      open("alfa");
      fireEvent.click(opener("beta"));
      expect(heading("Beta")).toHaveFocus();

      fireEvent.click(closeButton());
      expect(opener("alfa")).toHaveFocus();
    });

    it("cuts a running exit short when another candidate is picked", () => {
      renderPane();
      open("alfa");
      fireEvent.click(closeButton());
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(pane()).toHaveAttribute("data-closing");

      fireEvent.click(opener("beta"));
      expect(pane()).toHaveAttribute("data-open");
      expect(pane()).not.toHaveAttribute("data-closing");
      expect(heading("Beta")).toBeInTheDocument();

      // The old exit's timer landing changes nothing about the new comparison.
      act(() => {
        vi.advanceTimersByTime(CLOSE_MS);
      });
      expect(pane()).toHaveAttribute("data-open");
      expect(heading("Beta")).toBeInTheDocument();
    });
  });

  describe("as a bottom sheet", () => {
    const grip = () => pane().querySelector(".ko-comparison-pane-grip") as HTMLElement;

    /** jsdom has neither `matchMedia` nor pointer capture; the sheet needs both to be a sheet. */
    function pretendPhone(matches: boolean) {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: vi.fn((query: string) => ({ matches: matches && query === SHEET_QUERY, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
      });
      Object.defineProperty(Element.prototype, "setPointerCapture", { configurable: true, writable: true, value: vi.fn() });
    }

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      Reflect.deleteProperty(window, "matchMedia");
      Reflect.deleteProperty(Element.prototype, "setPointerCapture");
    });

    it("follows a finger down the grip, never up, and springs back from a short, slow drag", () => {
      pretendPhone(true);
      renderPane();
      open("alfa");
      expect(grip()).toHaveAttribute("aria-hidden", "true");

      fireEvent.pointerDown(grip(), { clientY: 100, pointerId: 1 });
      expect(pane()).toHaveAttribute("data-dragging");

      fireEvent.pointerMove(grip(), { clientY: 160, pointerId: 1 });
      expect(pane().style.transform).toBe("translateY(60px)");

      fireEvent.pointerMove(grip(), { clientY: 40, pointerId: 1 });
      expect(pane().style.transform).toBe("translateY(0px)");

      // Slow: the clock moves on before the finger lifts, so this is no flick.
      act(() => {
        vi.advanceTimersByTime(600);
      });
      fireEvent.pointerMove(grip(), { clientY: 160, pointerId: 1 });
      fireEvent.pointerUp(grip(), { clientY: 160, pointerId: 1 });
      expect(pane().style.transform).toBe("");
      expect(pane()).not.toHaveAttribute("data-dragging");
      expect(pane()).toHaveAttribute("data-open");
    });

    it("dismisses after a long drag, letting the sheet finish leaving before the state clears", () => {
      pretendPhone(true);
      renderPane();
      open("alfa");

      fireEvent.pointerDown(grip(), { clientY: 100, pointerId: 1 });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      fireEvent.pointerMove(grip(), { clientY: 260, pointerId: 1 });
      fireEvent.pointerUp(grip(), { clientY: 260, pointerId: 1 });

      // Sent off the bottom, but still open: the contents stay until it has gone.
      expect(pane().style.transform).toBe("translateY(100%)");
      expect(pane()).toHaveAttribute("data-open");

      act(() => {
        vi.advanceTimersByTime(EXIT_MS);
      });
      // No `closingId` beat on this route — the drag already animated the exit.
      expect(pane()).not.toHaveAttribute("data-open");
      expect(pane()).not.toHaveAttribute("data-closing");
      expect(screen.getByText("Přehled")).toBeInTheDocument();
      expect(pane().style.transform).toBe("");
    });

    it("dismisses on a quick flick, however short", () => {
      pretendPhone(true);
      renderPane();
      open("alfa");

      fireEvent.pointerDown(grip(), { clientY: 100, pointerId: 1 });
      fireEvent.pointerMove(grip(), { clientY: 140, pointerId: 1 });
      fireEvent.pointerUp(grip(), { clientY: 140, pointerId: 1 });
      expect(pane().style.transform).toBe("translateY(100%)");

      act(() => {
        vi.advanceTimersByTime(EXIT_MS);
      });
      expect(screen.getByText("Přehled")).toBeInTheDocument();
    });

    it("is not draggable as a desktop column", () => {
      pretendPhone(false);
      renderPane();
      open("alfa");

      fireEvent.pointerDown(grip(), { clientY: 100, pointerId: 1 });
      fireEvent.pointerMove(grip(), { clientY: 300, pointerId: 1 });
      expect(pane()).not.toHaveAttribute("data-dragging");
      expect(pane().style.transform).toBe("");
    });
  });
});
