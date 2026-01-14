import { render, screen } from "@testing-library/react";
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
    current: 5,
    total: 40,
    onAgreeChange: vi.fn(),
    onDisagreeChange: vi.fn(),
    onImportantChange: vi.fn(),
  };

  it("renders question information and answer buttons", () => {
    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <ReviewQuestionCard {...props} />
      </LocaleProvider>,
    );

    expect(screen.getByText(props.current.toString())).toBeInTheDocument();
    expect(screen.getByText(props.total.toString())).toBeInTheDocument();
    expect(screen.getByText(props.question.title)).toBeInTheDocument();
    expect(screen.getByText(props.question.statement)).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByLabelText("Important to me")).toBeInTheDocument();
  });

  describe("interactions", () => {
    it("calls onAgreeChange when agree button is clicked", async () => {
      const mockHandler = vi.fn();
      const user = userEvent.setup();
      render(
        <LocaleProvider locale="en" messages={enMessages}>
          <ReviewQuestionCard {...props} onAgreeChange={mockHandler} />
        </LocaleProvider>,
      );

      await user.click(screen.getByText("Yes"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onDisagreeChange when disagree button is clicked", async () => {
      const mockHandler = vi.fn();
      const user = userEvent.setup();
      render(
        <LocaleProvider locale="en" messages={enMessages}>
          <ReviewQuestionCard {...props} onDisagreeChange={mockHandler} />
        </LocaleProvider>,
      );

      await user.click(screen.getByText("No"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onImportantChange when important button is clicked", async () => {
      const mockHandler = vi.fn();
      const user = userEvent.setup();
      render(
        <LocaleProvider locale="en" messages={enMessages}>
          <ReviewQuestionCard {...props} onImportantChange={mockHandler} />
        </LocaleProvider>,
      );

      await user.click(screen.getByLabelText("Important to me"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });
});
