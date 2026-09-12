import type { Answer } from "@kalkulacka-one/schema";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { AnswersStoreContext, CalculatorStoreContext, createAnswersStore, createCalculatorStore } from "@/client/stores";
import type { CalculatorData } from "@/data-fetching";
import { csMessages } from "@/locales";

import { IntroductionPage } from "./introduction-page";
import { LocaleProvider } from "./providers";

/* jsdom doesn't implement `<dialog>`'s `showModal()`/`close()` — the same minimum stub the design system's dialog tests use, for the restart confirmation. */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

const questionIds = ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222", "33333333-3333-4333-8333-333333333333"] as const;
const [q1, q2, q3] = questionIds;

const calculatorData: CalculatorData = {
  data: {
    calculator: {
      id: "00000000-0000-4000-8000-000000000000",
      createdAt: new Date(0).toISOString(),
      key: "kalkulacka",
      shortTitle: "Sněmovní 2025",
    },
    questions: questionIds.map((id, index) => ({ id, title: `Otázka ${index + 1}`, statement: `Tvrzení ${index + 1}` })),
    candidates: [{ id: "44444444-4444-4444-8444-444444444444", references: [{ id: "55555555-5555-4555-8555-555555555555", type: "organization" }] }],
    candidatesAnswers: {},
  },
  baseUrl: "https://data.kalkulacka.one/kalkulacka",
};

type RenderOptions = {
  answers?: Answer[];
  props?: Partial<IntroductionPage>;
};

function renderPage({ answers = [], props = {} }: RenderOptions = {}) {
  const onContinueClick = vi.fn();
  const onResumeClick = vi.fn();
  const onRestartClick = vi.fn();
  const answersStore = createAnswersStore();
  answersStore.getState().setAnswers(answers);

  const result = render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <CalculatorStoreContext.Provider value={createCalculatorStore(calculatorData)}>
        <AnswersStoreContext.Provider value={answersStore}>
          <IntroductionPage
            appTitle="Volební kalkulačka"
            electionName="Sněmovní volby 2025"
            calculatorName="Volební kalkulačka"
            candidateCount={26}
            onContinueClick={onContinueClick}
            onResumeClick={onResumeClick}
            onRestartClick={onRestartClick}
            {...props}
          />
        </AnswersStoreContext.Provider>
      </CalculatorStoreContext.Provider>
    </LocaleProvider>,
  );

  return { ...result, onContinueClick, onResumeClick, onRestartClick };
}

const yes = (questionId: string): Answer => ({ questionId, answer: true });
const skipped = (questionId: string): Answer => ({ questionId });

/* The app bar, found from its wordmark — the screen's own title block is a `<header>` too. */
const appHeader = () => screen.getByText("Volební kalkulačka", { selector: "p" }).closest("header");

describe("IntroductionPage", () => {
  it("names the calculator in the heading and the header", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Volební kalkulačka");
    expect(appHeader()).toHaveTextContent("Sněmovní volby Volební kalkulačka 2025");
  });

  it("says how many questions there are, in the right plural", () => {
    renderPage();
    expect(screen.getByText("Odpovíte na 3 otázky a uvidíte, ke komu máte nejblíž.")).toBeInTheDocument();
  });

  it("says how many candidates are compared", () => {
    renderPage();
    expect(screen.getByText("Porovnáváme 26 kandidátů.")).toBeInTheDocument();
  });

  it("lists what answering does", () => {
    renderPage();
    const facts = screen.getAllByRole("listitem");
    expect(facts).toHaveLength(3);
    expect(facts[0]).toHaveTextContent("Pro mě důležité");
    expect(facts[1]).toHaveTextContent("Přeskočení");
    expect(facts[2]).toHaveTextContent("Rekapitulace");
  });

  it("renders the header actions and the attribution link when given", () => {
    renderPage({ props: { headerActions: <button type="button">Zavřít</button>, attributionHref: "https://www.volebnikalkulacka.cz" } });
    expect(appHeader()).toContainElement(screen.getByRole("button", { name: "Zavřít" }));
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://www.volebnikalkulacka.cz");
  });

  describe("for a fresh visitor", () => {
    it("offers to start and shows no progress", () => {
      renderPage();
      expect(screen.getByRole("button", { name: "Pokračovat" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Pokračovat v odpovídání" })).toBeNull();
      expect(screen.queryByText(/Máte odpovězeno/)).toBeNull();
    });

    it("starts on click", async () => {
      const user = userEvent.setup();
      const { onContinueClick, onResumeClick } = renderPage();

      await user.click(screen.getByRole("button", { name: "Pokračovat" }));
      expect(onContinueClick).toHaveBeenCalledTimes(1);
      expect(onResumeClick).not.toHaveBeenCalled();
    });

    it("has nothing to start over", () => {
      renderPage();
      expect(screen.queryByRole("button", { name: "Začít znovu" })).toBeNull();
    });
  });

  describe("for a returning visitor", () => {
    it("shows the progress and offers to continue", () => {
      renderPage({ answers: [yes(q1), yes(q2)] });
      expect(screen.getByText("Máte odpovězeno 2 z 3.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Pokračovat v odpovídání" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Pokračovat" })).toBeNull();
    });

    it("resumes at the first unvisited question", async () => {
      const user = userEvent.setup();
      const { onContinueClick, onResumeClick } = renderPage({ answers: [yes(q1), yes(q2)] });

      await user.click(screen.getByRole("button", { name: "Pokračovat v odpovídání" }));
      expect(onResumeClick).toHaveBeenCalledWith({ question: 3 });
      expect(onContinueClick).not.toHaveBeenCalled();
    });

    it("does not count a skipped question as answered", () => {
      renderPage({ answers: [yes(q1), skipped(q2)] });
      expect(screen.getByText("Máte odpovězeno 1 z 3.")).toBeInTheDocument();
    });

    it("resumes at the recap once every question was visited", async () => {
      const user = userEvent.setup();
      const { onResumeClick } = renderPage({ answers: [yes(q1), skipped(q2), yes(q3)] });

      await user.click(screen.getByRole("button", { name: "Pokračovat v odpovídání" }));
      expect(onResumeClick).toHaveBeenCalledWith({ review: true });
    });

    it("treats a visitor who only skipped as fresh", () => {
      renderPage({ answers: [skipped(q1)] });
      expect(screen.getByRole("button", { name: "Pokračovat" })).toBeInTheDocument();
      expect(screen.queryByText(/Máte odpovězeno/)).toBeNull();
    });

    it("offers to start over, as the secondary action before the primary one", () => {
      renderPage({ answers: [yes(q1)] });
      const restart = screen.getByRole("button", { name: "Začít znovu" });
      const resume = screen.getByRole("button", { name: "Pokračovat v odpovídání" });
      expect(restart).toHaveClass("ko:bg-surface/72");
      expect(restart.compareDocumentPosition(resume) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("asks before starting over, and restarts only on the confirming action", async () => {
      const user = userEvent.setup();
      const { onRestartClick, onResumeClick } = renderPage({ answers: [yes(q1)] });
      const dialog = () => screen.getByRole("dialog", { hidden: true });
      expect(dialog()).toHaveProperty("open", false);

      await user.click(screen.getByRole("button", { name: "Začít znovu" }));
      expect(dialog()).toHaveProperty("open", true);
      expect(dialog()).toHaveAccessibleName("Začít znovu?");

      await user.click(screen.getByRole("button", { name: "Zrušit" }));
      expect(dialog()).toHaveProperty("open", false);
      expect(onRestartClick).not.toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: "Začít znovu" }));
      await user.click(screen.getByRole("button", { name: "Smazat a začít znovu" }));
      expect(onRestartClick).toHaveBeenCalledTimes(1);
      expect(onResumeClick).not.toHaveBeenCalled();
      expect(dialog()).toHaveProperty("open", false);
    });
  });

  describe("editorial intro", () => {
    it("is absent by default", () => {
      const { container } = renderPage();
      expect(container.querySelector("strong")).toBeNull();
    });

    it("renders markdown with the allow-list and safe links", () => {
      renderPage({ props: { intro: ["Čeká vás **42 otázek**.", "# Nadpis pryč", "Více na [kalkulacka.one](https://www.kalkulacka.one)."].join("\n\n") } });
      expect(screen.getByText("42 otázek").tagName).toBe("STRONG");
      expect(screen.queryByText("Nadpis pryč")).toBeNull();
      const link = screen.getByRole("link", { name: "kalkulacka.one" });
      expect(link).toHaveAttribute("href", "https://www.kalkulacka.one");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
