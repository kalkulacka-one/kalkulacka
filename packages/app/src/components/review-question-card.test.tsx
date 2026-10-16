import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { enMessages } from "@/locales";
import type { AnswerViewModel, QuestionViewModel } from "@/view-models";

import { LocaleProvider } from "./providers";
import { ReviewQuestionCard } from "./review-question-card";

describe("ReviewQuestionCard", () => {
  const mockQuestion: QuestionViewModel = {
    id: "1",
    title: "Test Question Title",
    statement: "Test Question Statement",
    detail: "Test Question Detail",
    tags: ["Test tag"],
  };

  const mockAnswer: AnswerViewModel = {
    answer: {
      questionId: "1",
      answer: true,
      isImportant: true,
    },
    setAnswer: vi.fn(),
  };

  const props = {
    question: mockQuestion,
    answer: mockAnswer,
    onAgreeChange: vi.fn(),
    onDisagreeChange: vi.fn(),
    onImportantChange: vi.fn(),
  };

  const renderCard = (overrides: Partial<typeof props> = {}) =>
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ReviewQuestionCard {...props} {...overrides} />
      </LocaleProvider>,
    );

  it("shows only the title and how it was answered, not the statement or the controls", () => {
    renderCard();

    expect(screen.getByRole("button", { name: /Test Question Title/ })).toHaveAccessibleName(/Yes/);
    expect(screen.queryByText(props.question.statement)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("No")).not.toBeInTheDocument();
  });

  it("reads a skipped question as secondary and keeps its star off", () => {
    renderCard({ answer: { answer: { questionId: "1", answer: undefined }, setAnswer: vi.fn() } });

    expect(screen.getByLabelText("Important to me")).toBeDisabled();
  });

  it("opens the whole question and the answer controls in a dialog", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: /Test Question Title/ }));

    expect(screen.getByRole("dialog", { name: props.question.statement })).toBeInTheDocument();
    expect(screen.getByText(props.question.detail ?? "")).toBeInTheDocument();
    const dialog = within(screen.getByRole("dialog"));
    expect(dialog.getByLabelText("Yes")).toBeInTheDocument();
    expect(dialog.getByLabelText("No")).toBeInTheDocument();
    expect(dialog.getByLabelText("Important to me")).toBeInTheDocument();
  });

  it("closes the dialog from the close button", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: /Test Question Title/ }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  describe("interactions", () => {
    it("calls onAgreeChange when agree button is clicked", async () => {
      const mockHandler = vi.fn();
      const user = userEvent.setup();
      renderCard({ onAgreeChange: mockHandler });
      await user.click(screen.getByRole("button", { name: /Test Question Title/ }));

      await user.click(within(screen.getByRole("dialog")).getByLabelText("Yes"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onDisagreeChange when disagree button is clicked", async () => {
      const mockHandler = vi.fn();
      const user = userEvent.setup();
      renderCard({ onDisagreeChange: mockHandler });
      await user.click(screen.getByRole("button", { name: /Test Question Title/ }));

      await user.click(within(screen.getByRole("dialog")).getByLabelText("No"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("toggles the star right in the row, without opening the question", async () => {
      const mockHandler = vi.fn();
      const user = userEvent.setup();
      renderCard({ onImportantChange: mockHandler });

      await user.click(screen.getByLabelText("Important to me"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
