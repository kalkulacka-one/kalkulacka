import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";
import type { Question } from "../../../../../../packages/schema/schemas/question.schema";
import { ReviewQuestionCard } from "./review-question-card";

describe("ReviewQuestionCard", () => {
  const mockQuestion: Question = {
    id: "1",
    title: "Test Question Title",
    statement: "Test Question Statement",
    detail: "Test Question Detail",
    tags: ["Test tag"],
  };

  const mockAnswer: Answer = {
    questionId: "1",
    answer: true,
    isImportant: true,
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
    render(<ReviewQuestionCard {...props} />);

    expect(screen.getByText(`${props.current}/${props.total}`)).toBeInTheDocument();
    expect(screen.getByText(props.question.title)).toBeInTheDocument();
    expect(screen.getByText(props.question.statement)).toBeInTheDocument();
    if (props.question.detail) {
      expect(screen.getByText(props.question.detail)).toBeInTheDocument();
    }
    if (props.question.tags) {
      for (const tag of props.question.tags) {
        expect(screen.getByText(tag)).toBeInTheDocument();
      }
    }
    expect(screen.getByText("Jsem pro")).toBeInTheDocument();
    expect(screen.getByText("Jsem proti")).toBeInTheDocument();
    expect(screen.getByText("Pro mě důležité")).toBeInTheDocument();
  });

  describe("interactions", () => {
    let user: ReturnType<typeof userEvent.setup>;
    let mockHandler: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      user = userEvent.setup();
      mockHandler = vi.fn();
    });

    it("calls onAgreeChange when agree button is clicked", async () => {
      render(<ReviewQuestionCard {...props} onAgreeChange={mockHandler} />);

      await user.click(screen.getByText("Jsem pro"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onDisagreeChange when disagree button is clicked", async () => {
      render(<ReviewQuestionCard {...props} onDisagreeChange={mockHandler} />);

      await user.click(screen.getByText("Jsem proti"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onImportantChange when important button is clicked", async () => {
      render(<ReviewQuestionCard {...props} onImportantChange={mockHandler} />);

      await user.click(screen.getByText("Pro mě důležité"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });
});
