import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { QuestionCard, QuestionCardActionVariants, QuestionCardVariants } from "./questionCard";

const content = {
  id: "q1",
  topic: "Energetika",
  title: "Omezení vánoční výzdoby",
  statement: "Město by mělo kvůli rostoucím cenám energie omezit veřejné slavnostní osvětlení v době Vánoc.",
  detail: "K podobnému kroku přistoupila například rakouská Vídeň.",
};

const labels = {
  agree: "Ano",
  disagree: "Ne",
  important: "Pro mě důležité",
};

const none = { agree: false, disagree: false, important: false };

function card(container: HTMLElement) {
  const root = container.firstElementChild;
  if (!(root instanceof HTMLDivElement)) {
    throw new Error("The card did not render a root div");
  }
  return root;
}

describe("QuestionCard", () => {
  it("renders the topic as a filled chip and the title as an outlined one", () => {
    render(<QuestionCard content={content} selection={none} labels={labels} />);
    expect(screen.getByText("Energetika")).toHaveClass("ko:bg-surface-sunken");
    expect(screen.getByText("Omezení vánoční výzdoby")).toHaveClass("ko:shadow-[inset_0_0_0_1px_var(--ko-color-border)]");
  });

  it("renders the statement and the detail", () => {
    render(<QuestionCard content={content} selection={none} labels={labels} />);
    const statement = screen.getByText(content.statement);
    expect(statement.tagName).toBe("P");
    expect(statement).toHaveClass("ko:font-question", "ko:text-fluid-question", "ko:font-bold", "ko:text-text");
    expect(screen.getByText(content.detail)).toHaveClass("ko:text-fluid-gist", "ko:text-text-muted", "ko:mt-[1.125rem]");
  });

  it("skips the chips row when there is neither topic nor title", () => {
    const { container } = render(<QuestionCard content={{ id: "practice", detail: "Zkuste kartu přetáhnout." }} selection={none} labels={labels} />);
    expect(container.querySelector(".ko\\:flex-wrap")).toBeNull();
  });

  it("centres a detail that stands alone", () => {
    render(<QuestionCard content={{ id: "practice", detail: "Zkuste kartu přetáhnout." }} selection={none} labels={labels} />);
    const detail = screen.getByText("Zkuste kartu přetáhnout.");
    expect(detail).toHaveClass("ko:mt-0", "ko:text-center", "ko:text-balance");
    expect(detail).not.toHaveClass("ko:mt-[1.125rem]");
  });

  describe("statementAs", () => {
    it("draws the statement as a heading when asked", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} statementAs="h1" />);
      expect(screen.getByRole("heading", { level: 1, name: content.statement })).toBeInTheDocument();
    });

    it("keeps the same look on either element", () => {
      const { unmount } = render(<QuestionCard content={content} selection={none} labels={labels} />);
      const paragraphClasses = screen.getByText(content.statement).className;
      unmount();
      render(<QuestionCard content={content} selection={none} labels={labels} statementAs="h2" />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveClass(paragraphClasses);
    });
  });

  describe("the important toggle", () => {
    it("is a pressable button named by its label", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} />);
      const star = screen.getByRole("button", { name: "Pro mě důležité" });
      expect(star).toHaveAttribute("aria-pressed", "false");
      expect(star).toHaveClass(twMerge(QuestionCardActionVariants({ action: "important" })));
      expect(star.querySelector("svg")).toHaveAttribute("fill", "none");
    });

    it("is pressed with a filled star when important", () => {
      render(<QuestionCard content={content} selection={{ ...none, important: true }} labels={labels} />);
      const star = screen.getByRole("button", { name: "Pro mě důležité" });
      expect(star).toHaveAttribute("aria-pressed", "true");
      expect(star.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    });

    it("carries its label as a hidden tooltip", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} />);
      const tooltip = screen.getByRole("button", { name: "Pro mě důležité" }).querySelector(".ko-question-card-tooltip");
      expect(tooltip).toHaveTextContent("Pro mě důležité");
      expect(tooltip).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("the answer buttons", () => {
    it("read as unselected by default", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} />);
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "Ne" })).toHaveAttribute("aria-pressed", "false");
    });

    it("read as selected from the selection", () => {
      const { rerender } = render(<QuestionCard content={content} selection={{ ...none, agree: true }} labels={labels} />);
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Ne" })).toHaveAttribute("aria-pressed", "false");

      rerender(<QuestionCard content={content} selection={{ ...none, disagree: true }} labels={labels} />);
      expect(screen.getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: "Ne" })).toHaveAttribute("aria-pressed", "true");
    });

    it("wear the agree and disagree tones", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} />);
      expect(screen.getByRole("button", { name: "Ano" })).toHaveClass(twMerge(QuestionCardActionVariants({ action: "agree" })));
      expect(screen.getByRole("button", { name: "Ne" })).toHaveClass(twMerge(QuestionCardActionVariants({ action: "disagree" })));

      const agree = QuestionCardActionVariants({ action: "agree" }).split(" ");
      expect(agree).toEqual(
        expect.arrayContaining(["ko:flex-1", "ko:h-fluid-action", "ko:rounded-control", "ko:bg-surface", "ko:hover:bg-agree-wash", "ko:aria-pressed:bg-agree", "ko:aria-pressed:text-on-agree"]),
      );
      const disagree = QuestionCardActionVariants({ action: "disagree" }).split(" ");
      expect(disagree).toEqual(expect.arrayContaining(["ko:hover:bg-disagree-wash", "ko:aria-pressed:bg-disagree", "ko:aria-pressed:text-on-disagree"]));
    });

    it("show their text labels only once the card is wide enough", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} />);
      const label = screen.getByText("Ano");
      expect(label).toHaveClass("ko:hidden", "ko:@[37.5rem]/card:inline");
      expect(screen.getByText("Ne")).toHaveClass("ko:hidden", "ko:@[37.5rem]/card:inline");
    });
  });

  describe("callbacks", () => {
    it("calls onAgree, onDisagree and onToggleImportant", () => {
      const onAgree = vi.fn();
      const onDisagree = vi.fn();
      const onToggleImportant = vi.fn();
      render(<QuestionCard content={content} selection={none} labels={labels} onAgree={onAgree} onDisagree={onDisagree} onToggleImportant={onToggleImportant} />);

      fireEvent.click(screen.getByRole("button", { name: "Ano" }));
      expect(onAgree).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole("button", { name: "Ne" }));
      expect(onDisagree).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole("button", { name: "Pro mě důležité" }));
      expect(onToggleImportant).toHaveBeenCalledTimes(1);
    });

    it("passes a pointer-down on the card itself to onPointerDown", () => {
      const onPointerDown = vi.fn();
      render(<QuestionCard content={content} selection={none} labels={labels} onPointerDown={onPointerDown} />);
      fireEvent.pointerDown(screen.getByText(content.statement));
      expect(onPointerDown).toHaveBeenCalledTimes(1);
    });

    it("does not let a pointer-down on a button start a drag", () => {
      const onPointerDown = vi.fn();
      render(<QuestionCard content={content} selection={none} labels={labels} onPointerDown={onPointerDown} close={{ label: "Zavřít", onClose: () => {} }} />);
      fireEvent.pointerDown(screen.getByRole("button", { name: "Ano" }));
      fireEvent.pointerDown(screen.getByRole("button", { name: "Ne" }));
      fireEvent.pointerDown(screen.getByRole("button", { name: "Pro mě důležité" }));
      fireEvent.pointerDown(screen.getByRole("button", { name: "Zavřít" }));
      expect(onPointerDown).not.toHaveBeenCalled();
    });
  });

  describe("the grab cursor", () => {
    it("appears only on a card that can actually be dragged", () => {
      const { container, rerender } = render(<QuestionCard content={content} selection={none} labels={labels} onAgree={() => {}} />);
      expect(card(container)).not.toHaveClass("ko:cursor-grab");

      rerender(<QuestionCard content={content} selection={none} labels={labels} onPointerDown={() => {}} />);
      expect(card(container)).toHaveClass("ko:cursor-grab", "ko:touch-none", "ko:select-none");

      rerender(<QuestionCard content={content} selection={none} labels={labels} onPointerDown={() => {}} inert />);
      expect(card(container)).not.toHaveClass("ko:cursor-grab");
    });
  });

  describe("when inert", () => {
    it("leaves the accessibility tree and the tab order", () => {
      const { container } = render(<QuestionCard content={content} selection={none} labels={labels} close={{ label: "Zavřít", onClose: () => {} }} inert />);
      const root = card(container);
      expect(root).toHaveAttribute("inert");
      expect(root).toHaveAttribute("aria-hidden", "true");
      for (const button of container.querySelectorAll("button")) {
        expect(button).toHaveAttribute("tabindex", "-1");
      }
    });

    it("stays in the tree otherwise", () => {
      const { container } = render(<QuestionCard content={content} selection={none} labels={labels} />);
      const root = card(container);
      expect(root).not.toHaveAttribute("inert");
      expect(root).not.toHaveAttribute("aria-hidden");
      for (const button of container.querySelectorAll("button")) {
        expect(button).not.toHaveAttribute("tabindex");
      }
    });
  });

  describe("the close button", () => {
    it("is absent unless asked for", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} />);
      expect(screen.queryByRole("button", { name: "Zavřít" })).toBeNull();
    });

    it("is named by its label and calls onClose", () => {
      const onClose = vi.fn();
      render(<QuestionCard content={content} selection={none} labels={labels} close={{ label: "Zavřít", onClose }} />);
      const button = screen.getByRole("button", { name: "Zavřít" });
      expect(button).toHaveAttribute("title", "Zavřít");
      expect(button).toHaveClass("ko:absolute", "ko:top-fluid-card-pad-top", "ko:right-fluid-card-pad-side", "ko:size-8", "ko:rounded-pill");
      fireEvent.click(button);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("reserves room for itself in the chips row", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} close={{ label: "Zavřít", onClose: () => {} }} />);
      expect(screen.getByText("Energetika").parentElement).toHaveClass("ko:pr-10");
    });
  });

  describe("the guides slot", () => {
    it("renders the guides inside the card and holds the text clear of them", () => {
      const { container } = render(<QuestionCard content={content} selection={none} labels={labels} guides={<div data-testid="guides" />} />);
      expect(card(container)).toContainElement(screen.getByTestId("guides"));
      expect(screen.getByText(content.statement).parentElement).toHaveClass("ko:py-11");
      expect(screen.getByText(content.statement).parentElement).not.toHaveClass("ko:py-2");
    });

    it("keeps the body's own padding without them", () => {
      render(<QuestionCard content={content} selection={none} labels={labels} />);
      expect(screen.getByText(content.statement).parentElement).toHaveClass("ko:py-2");
    });
  });

  describe("elevation", () => {
    it("is the active shadow by default", () => {
      const { container } = render(<QuestionCard content={content} selection={none} labels={labels} />);
      expect(card(container)).toHaveClass(twMerge(QuestionCardVariants()));
      expect(card(container)).toHaveClass("ko:shadow-card");
    });

    it("maps each step to its shadow", () => {
      expect(QuestionCardVariants({ elevation: "active" }).split(" ")).toContain("ko:shadow-card");
      expect(QuestionCardVariants({ elevation: "next" }).split(" ")).toContain("ko:shadow-card-next");
      expect(QuestionCardVariants({ elevation: "back" }).split(" ")).toContain("ko:shadow-card-back");
      expect(QuestionCardVariants({ elevation: "lifted" }).split(" ")).toContain("ko:shadow-card-lifted");
      expect(QuestionCardVariants({ elevation: "lifted" }).split(" ")).not.toContain("ko:shadow-card");
    });

    it("fills its stage as a container named card", () => {
      expect(QuestionCardVariants().split(" ")).toEqual(
        expect.arrayContaining([
          "ko:absolute",
          "ko:inset-0",
          "ko:bg-surface",
          "ko:rounded-card",
          "ko:@container/card",
          "ko:pt-fluid-card-pad-top",
          "ko:px-fluid-card-pad-side",
          "ko:pb-fluid-card-pad-bottom",
        ]),
      );
    });
  });

  it("forwards a ref to the root element and merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<QuestionCard content={content} selection={none} labels={labels} ref={ref} className="ko:shadow-none" />);
    expect(ref.current).toBe(card(container));
    expect(ref.current).toHaveClass("ko:shadow-none");
    expect(ref.current).not.toHaveClass("ko:shadow-card");
  });
});
