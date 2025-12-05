import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AnswerViewModel, QuestionViewModel } from "@/calculator/view-models/server";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";
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
    setAnswer: vi.fn() as (answer: Partial<Answer> & { questionId: string }) => void,
  };

  const props = {
    question: mockQuestion,
    answer: mockAnswer,
    current: 5,
    total: 40,
    onAgreeChange: vi.fn() as (agree: boolean) => void,
    onDisagreeChange: vi.fn() as (disagree: boolean) => void,
    onImportantChange: vi.fn() as (isImportant: boolean) => void,
  };

  it("renders question information and answer buttons", () => {
    render(<ReviewQuestionCard {...props} />);

    expect(screen.getByText(props.current.toString())).toBeInTheDocument();
    expect(screen.getByText(props.total.toString())).toBeInTheDocument();
    expect(screen.getByText(props.question.title)).toBeInTheDocument();
    expect(screen.getByText(props.question.statement)).toBeInTheDocument();
    expect(screen.getByText("Ano")).toBeInTheDocument();
    expect(screen.getByText("Ne")).toBeInTheDocument();
    expect(screen.getByLabelText("Pro mě důležité")).toBeInTheDocument();
  });

  describe("interactions", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it("calls onAgreeChange when agree button is clicked", async () => {
      const mockAgreeHandler = vi.fn() as (agree: boolean) => void;
      render(<ReviewQuestionCard {...props} onAgreeChange={mockAgreeHandler} />);

      await user.click(screen.getByText("Ano"));
      expect(mockAgreeHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onDisagreeChange when disagree button is clicked", async () => {
      const mockDisagreeHandler = vi.fn() as (disagree: boolean) => void;
      render(<ReviewQuestionCard {...props} onDisagreeChange={mockDisagreeHandler} />);

      await user.click(screen.getByText("Ne"));
      expect(mockDisagreeHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onImportantChange when important button is clicked", async () => {
      const mockImportantHandler = vi.fn() as (isImportant: boolean) => void;
      render(<ReviewQuestionCard {...props} onImportantChange={mockImportantHandler} />);

      await user.click(screen.getByLabelText("Pro mě důležité"));
      expect(mockImportantHandler).toHaveBeenCalledTimes(1);
    });
  });
});
