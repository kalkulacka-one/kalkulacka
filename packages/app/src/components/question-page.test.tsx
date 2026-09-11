import type { Answer } from "@kalkulacka-one/schema";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AnswersStoreContext, CalculatorStoreContext, createAnswersStore, createCalculatorStore } from "@/client/stores";
import type { CalculatorData } from "@/data-fetching";
import { csMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { QuestionPage } from "./question-page";

const questionIds = ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222", "33333333-3333-4333-8333-333333333333"] as const;
const [q1, q2] = questionIds;

const calculatorData: CalculatorData = {
  data: {
    calculator: {
      id: "00000000-0000-4000-8000-000000000000",
      createdAt: new Date(0).toISOString(),
      key: "kalkulacka",
      shortTitle: "Sněmovní 2025",
    },
    questions: questionIds.map((id, index) => ({ id, title: `Otázka ${index + 1}`, statement: `Tvrzení ${index + 1}`, tags: [`Téma ${index + 1}`] })),
    candidates: [{ id: "44444444-4444-4444-8444-444444444444", references: [{ id: "55555555-5555-4555-8555-555555555555", type: "organization" }] }],
    candidatesAnswers: {},
  },
  baseUrl: "https://data.kalkulacka.one/kalkulacka",
};

type RenderOptions = {
  answers?: Answer[];
  props?: Partial<QuestionPage>;
};

function renderPage({ answers = [], props = {} }: RenderOptions = {}) {
  const onPositionChange = vi.fn();
  const onFinish = vi.fn();
  const onBackToGuide = vi.fn();
  const answersStore = createAnswersStore();
  answersStore.getState().setAnswers(answers);

  const result = render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <CalculatorStoreContext.Provider value={createCalculatorStore(calculatorData)}>
        <AnswersStoreContext.Provider value={answersStore}>
          <QuestionPage
            appTitle="Volební kalkulačka"
            electionName="Sněmovní volby 2025"
            calculatorName="Volební kalkulačka"
            initialPosition={1}
            onPositionChange={onPositionChange}
            onFinish={onFinish}
            onBackToGuide={onBackToGuide}
            {...props}
          />
        </AnswersStoreContext.Provider>
      </CalculatorStoreContext.Provider>
    </LocaleProvider>,
  );

  const stored = (questionId: string) => answersStore.getState().answers.find((answer) => answer.questionId === questionId);

  return { ...result, answersStore, stored, onPositionChange, onFinish, onBackToGuide };
}

const yes = (questionId: string): Answer => ({ questionId, answer: true });

/* The card being answered — the only one with a heading; the stacked cards are inert. */
const heading = () => screen.getByRole("heading", { level: 1 });
const button = (name: string) => screen.getByRole("button", { name });
const forward = () => screen.getByRole("navigation").querySelector("button:last-of-type");

/* The page's own live region — the deck has one of its own for the committed answer. */
const landedRegion = () => screen.getAllByRole("status").find((region) => !region.closest(".ko-deck"));

/* The app bar, found from its wordmark. */
const appHeader = () => screen.getByText("Volební kalkulačka", { selector: "p" }).closest("header");

const filled = "ko:bg-neutral-ink";

describe("QuestionPage", () => {
  describe("the screen", () => {
    it("shows the statement as the heading, with the topic and title chips", () => {
      renderPage();
      expect(heading()).toHaveTextContent("Tvrzení 1");
      const card = heading().closest(".ko-deck-active");
      expect(card).toHaveTextContent("Téma 1");
      expect(card).toHaveTextContent("Otázka 1");
    });

    it("stacks the next questions behind the card, inert", () => {
      const { container } = renderPage();
      const next = container.querySelector(".ko-deck-next");
      expect(next).toHaveTextContent("Tvrzení 2");
      expect(next?.firstElementChild).toHaveAttribute("inert");
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });

    it("names the election and the calculator in the header", () => {
      renderPage();
      expect(appHeader()).toHaveTextContent("Sněmovní volby Volební kalkulačka 2025");
    });

    it("renders the header actions and the attribution link when given", () => {
      renderPage({ props: { headerActions: <button type="button">Zavřít</button>, attributionHref: "https://www.volebnikalkulacka.cz" } });
      expect(appHeader()).toContainElement(button("Zavřít"));
      expect(screen.getByRole("link")).toHaveAttribute("href", "https://www.volebnikalkulacka.cz");
    });

    it("starts at the position it was given", () => {
      renderPage({ props: { initialPosition: 2 } });
      expect(heading()).toHaveTextContent("Tvrzení 2");
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
      expect(screen.getByText("Otázka 2 z 3")).toBeInTheDocument();
    });

    it("clamps a position past the end to the last question", () => {
      renderPage({ props: { initialPosition: 9 } });
      expect(heading()).toHaveTextContent("Tvrzení 3");
    });

    it("draws the progress from the answers", () => {
      renderPage({ answers: [yes(q1), { questionId: q2, answer: false, isImportant: true }], props: { initialPosition: 3 } });
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-label", "Průběh vyplňování");
      expect(bar).toHaveAttribute("aria-valuemax", "3");
      const segments = Array.from(bar.children).map((segment) => segment.firstElementChild);
      expect(segments[0]).toHaveClass("ko:bg-agree");
      expect(segments[1]).toHaveClass("ko:bg-disagree");
      expect(bar.children[1]?.querySelector("span")).toHaveClass("ko:bg-disagree");
    });

    it("lists the keyboard shortcuts", () => {
      renderPage();
      expect(screen.getByText("Procházet bez odpovědi")).toBeInTheDocument();
      expect(screen.getByTitle("Šipka vlevo")).toBeInTheDocument();
      expect(screen.getByTitle("Tečka")).toBeInTheDocument();
    });
  });

  describe("arriving", () => {
    it("records the question as visited without a position", () => {
      const { stored } = renderPage();
      expect(stored(q1)).toEqual({ questionId: q1 });
    });

    it("leaves an existing answer alone", () => {
      const { stored } = renderPage({ answers: [{ questionId: q1, answer: false, isImportant: true }] });
      expect(stored(q1)).toEqual({ questionId: q1, answer: false, isImportant: true });
    });

    it("offers to skip, unfilled, and to go back to the guide", () => {
      renderPage();
      expect(button("Přeskočit")).not.toHaveClass(filled);
      expect(button("Návod")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Další" })).toBeNull();
    });

    it("is silent about the card it opened on", () => {
      renderPage();
      expect(landedRegion()).toHaveTextContent("");
      expect(landedRegion()).toHaveAttribute("aria-live", "polite");
    });

    it("does not report a position it was given", () => {
      const { onPositionChange } = renderPage({ props: { initialPosition: 2 } });
      expect(onPositionChange).not.toHaveBeenCalled();
    });
  });

  describe("answering", () => {
    it("writes the answer and moves to the next question", async () => {
      const user = userEvent.setup();
      const { stored, onPositionChange } = renderPage();

      await user.click(button("Ano"));
      expect(stored(q1)).toEqual({ questionId: q1, answer: true, isImportant: false });
      expect(heading()).toHaveTextContent("Tvrzení 2");
      expect(onPositionChange).toHaveBeenCalledWith(2);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    });

    it("announces the card it landed on", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(button("Ne"));
      expect(landedRegion()).toHaveTextContent("Otázka 2 z 3: Tvrzení 2");
    });

    it("answers with the arrow keys", () => {
      const { stored } = renderPage();
      fireEvent.keyDown(window, { key: "ArrowRight" });
      expect(stored(q1)).toEqual({ questionId: q1, answer: false, isImportant: false });
      expect(heading()).toHaveTextContent("Tvrzení 2");
    });

    it("carries a star pressed before the answer into it", async () => {
      const user = userEvent.setup();
      const { stored } = renderPage();

      await user.click(button("Pro mě důležité"));
      expect(stored(q1)).toEqual({ questionId: q1, isImportant: true });
      expect(button("Pro mě důležité")).toHaveAttribute("aria-pressed", "true");

      await user.click(button("Ne"));
      expect(stored(q1)).toEqual({ questionId: q1, answer: false, isImportant: true });
      expect(heading()).toHaveTextContent("Tvrzení 2");
    });

    it("clears an answer chosen a second time and stays, nudging toward Přeskočit", async () => {
      const user = userEvent.setup();
      const { stored, onPositionChange } = renderPage({ answers: [yes(q1)] });
      expect(button("Ano")).toHaveAttribute("aria-pressed", "true");

      await user.click(button("Ano"));
      expect(stored(q1)).toEqual({ questionId: q1, answer: undefined });
      expect(heading()).toHaveTextContent("Tvrzení 1");
      expect(onPositionChange).not.toHaveBeenCalled();
      expect(button("Ano")).toHaveAttribute("aria-pressed", "false");
      expect(button("Přeskočit")).toHaveClass(filled);
    });

    it("drops the nudge on the next move", async () => {
      const user = userEvent.setup();
      renderPage({ answers: [yes(q1)] });

      await user.click(button("Ano"));
      await user.click(button("Přeskočit"));
      expect(heading()).toHaveTextContent("Tvrzení 2");
      expect(button("Přeskočit")).not.toHaveClass(filled);
    });

    it("reads Další once answered and moves on without rewriting the answer", async () => {
      const user = userEvent.setup();
      const { stored } = renderPage({ answers: [yes(q1)] });
      expect(screen.queryByRole("button", { name: "Přeskočit" })).toBeNull();

      await user.click(button("Další"));
      expect(heading()).toHaveTextContent("Tvrzení 2");
      expect(stored(q1)).toEqual({ questionId: q1, answer: true });
    });

    it("hands over to the recap after the last question, once", async () => {
      const user = userEvent.setup();
      const { onFinish, onPositionChange } = renderPage({ props: { initialPosition: 3 } });

      await user.click(button("Ano"));
      expect(onFinish).toHaveBeenCalledTimes(1);
      expect(onPositionChange).not.toHaveBeenCalled();

      // The deck is finished: no live card to answer again while the navigation is on its way.
      expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "." });
      expect(onFinish).toHaveBeenCalledTimes(1);
    });
  });

  describe("skipping", () => {
    it("moves on with the nav, leaving the question visited without a position", async () => {
      const user = userEvent.setup();
      const { stored, onPositionChange } = renderPage();

      await user.click(button("Přeskočit"));
      expect(stored(q1)).toEqual({ questionId: q1, answer: undefined, isImportant: false });
      expect(heading()).toHaveTextContent("Tvrzení 2");
      expect(onPositionChange).toHaveBeenCalledWith(2);
    });

    it("drops a star armed before the skip", () => {
      const { stored } = renderPage();
      fireEvent.keyDown(window, { key: "ArrowUp" });
      fireEvent.keyDown(window, { key: "ArrowDown" });
      expect(stored(q1)).toEqual({ questionId: q1, answer: undefined, isImportant: false });
      expect(heading()).toHaveTextContent("Tvrzení 2");
    });

    it("fills Přeskočit when coming back to a question explicitly skipped", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(button("Přeskočit"));
      await user.click(button("Předchozí"));
      expect(heading()).toHaveTextContent("Tvrzení 1");
      expect(button("Přeskočit")).toHaveClass(filled);
    });

    it("fills Přeskočit for a question an earlier session left without a position", () => {
      renderPage({ answers: [{ questionId: q1 }] });
      expect(button("Přeskočit")).toHaveClass(filled);
    });

    it("does not fill Přeskočit for a question only browsed past", () => {
      renderPage();
      fireEvent.keyDown(window, { key: "." });
      fireEvent.keyDown(window, { key: "," });
      expect(heading()).toHaveTextContent("Tvrzení 1");
      expect(button("Přeskočit")).not.toHaveClass(filled);

      fireEvent.keyDown(window, { key: "." });
      expect(heading()).toHaveTextContent("Tvrzení 2");
      expect(button("Přeskočit")).not.toHaveClass(filled);
    });

    it("forgets the skip once the question gets an answer", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(button("Přeskočit"));
      await user.click(button("Předchozí"));
      await user.click(button("Ne"));
      await user.click(button("Předchozí"));
      expect(heading()).toHaveTextContent("Tvrzení 1");
      expect(button("Další")).toBeInTheDocument();

      // Clearing the answer fills the control again, but only as the nudge:
      // it does not survive a move, and the old skip is not remembered either.
      await user.click(button("Ne"));
      expect(button("Přeskočit")).toHaveClass(filled);
      fireEvent.keyDown(window, { key: "." });
      fireEvent.keyDown(window, { key: "," });
      expect(heading()).toHaveTextContent("Tvrzení 1");
      expect(button("Přeskočit")).not.toHaveClass(filled);
    });

    it("hands over to the recap when the last question is skipped", async () => {
      const user = userEvent.setup();
      const { onFinish } = renderPage({ props: { initialPosition: 3 } });

      await user.click(button("Přeskočit"));
      expect(onFinish).toHaveBeenCalledTimes(1);
    });
  });

  describe("going back", () => {
    it("returns to the previous question", async () => {
      const user = userEvent.setup();
      const { onPositionChange, onBackToGuide } = renderPage({ props: { initialPosition: 2 } });

      await user.click(button("Předchozí"));
      expect(heading()).toHaveTextContent("Tvrzení 1");
      expect(onPositionChange).toHaveBeenCalledWith(1);
      expect(onBackToGuide).not.toHaveBeenCalled();
    });

    it("goes back to the guide from the first question", async () => {
      const user = userEvent.setup();
      const { onBackToGuide, onPositionChange } = renderPage();

      await user.click(button("Návod"));
      expect(onBackToGuide).toHaveBeenCalledTimes(1);
      expect(onPositionChange).not.toHaveBeenCalled();
    });
  });

  describe("browsing with , and .", () => {
    it("moves without recording an answer", () => {
      const { answersStore, onPositionChange } = renderPage({ props: { initialPosition: 2 } });

      fireEvent.keyDown(window, { key: "." });
      expect(heading()).toHaveTextContent("Tvrzení 3");
      fireEvent.keyDown(window, { key: "," });
      expect(heading()).toHaveTextContent("Tvrzení 2");

      expect(onPositionChange.mock.calls).toEqual([[3], [2]]);
      expect(answersStore.getState().answers.every((answer) => answer.answer === undefined && !answer.isImportant)).toBe(true);
    });

    it("announces each card landed on", () => {
      renderPage({ props: { initialPosition: 2 } });
      fireEvent.keyDown(window, { key: "." });
      expect(landedRegion()).toHaveTextContent("Otázka 3 z 3: Tvrzení 3");
    });

    it("leaves the flow at either end", () => {
      const { onBackToGuide, onFinish } = renderPage({ props: { initialPosition: 3 } });
      fireEvent.keyDown(window, { key: "." });
      expect(onFinish).toHaveBeenCalledTimes(1);

      const second = renderPage();
      fireEvent.keyDown(window, { key: "," });
      expect(second.onBackToGuide).toHaveBeenCalledTimes(1);
      expect(onBackToGuide).not.toHaveBeenCalled();
    });

    it("ignores the keys with a modifier or inside a form field", () => {
      const { onPositionChange } = renderPage({ props: { initialPosition: 2 } });
      fireEvent.keyDown(window, { key: ".", metaKey: true });
      fireEvent.keyDown(window, { key: ",", ctrlKey: true });
      fireEvent.keyDown(window, { key: ".", altKey: true });

      const input = document.createElement("input");
      document.body.appendChild(input);
      fireEvent.keyDown(input, { key: "." });
      input.remove();

      expect(heading()).toHaveTextContent("Tvrzení 2");
      expect(onPositionChange).not.toHaveBeenCalled();
    });
  });

  it("keeps the forward control at the nav's far end", () => {
    renderPage();
    expect(forward()).toHaveTextContent("Přeskočit");
  });
});
