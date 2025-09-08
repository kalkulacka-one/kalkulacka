import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AnswerViewModel } from "../../../view-models";
import { QuestionNavigationCard } from "./question-navigation-card";

describe("QuestionNavigationCard", () => {
  const mockAnswer: AnswerViewModel = {
    answer: {
      questionId: "550e8400-e29b-41d4-a716-446655440000",
      answer: true,
      isImportant: true,
    },
    setAnswer: vi.fn(),
  };

  const defaultProps = {
    current: 5,
    total: 40,
    onPreviousClick: vi.fn(),
    onNextClick: vi.fn(),
    onAgreeChange: vi.fn(),
    onDisagreeChange: vi.fn(),
    onImportantChange: vi.fn(),
    answer: mockAnswer,
  } as const;

  describe("rendering", () => {
    it("renders question counter", () => {
      render(<QuestionNavigationCard {...defaultProps} />);
      expect(screen.getByText("5/40")).toBeInTheDocument();
    });

    it("renders navigation buttons", () => {
      render(<QuestionNavigationCard {...defaultProps} />);

      expect(screen.getByText("Předchozí")).toBeInTheDocument();
      expect(screen.getByText("Další")).toBeInTheDocument();
    });

    it("renders answer buttons", () => {
      render(<QuestionNavigationCard {...defaultProps} />);

      expect(screen.getByText("Ano")).toBeInTheDocument();
      expect(screen.getByText("Ne")).toBeInTheDocument();
    });

    it("renders important button", () => {
      render(<QuestionNavigationCard {...defaultProps} />);
      expect(screen.getByLabelText("Pro mě důležité")).toBeInTheDocument();
    });

    it("shows correct state when answer is provided", () => {
      render(<QuestionNavigationCard {...defaultProps} answer={mockAnswer} />);

      expect(screen.getByText("Ano")).toBeChecked();
      expect(screen.getByText("Ne")).not.toBeChecked();
      expect(screen.getByLabelText("Pro mě důležité")).toBeChecked();
    });
  });

  describe("interactions", () => {
    let user: ReturnType<typeof userEvent.setup>;
    let mockHandler: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      user = userEvent.setup();
      mockHandler = vi.fn();
    });

    it("calls onPreviousClick when previous button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onPreviousClick={mockHandler} />);
      await user.click(screen.getByText("Předchozí"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onNextClick when next button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onNextClick={mockHandler} />);
      await user.click(screen.getByText("Další"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onAgreeChange when agree button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onAgreeChange={mockHandler} />);
      await user.click(screen.getByText("Ano"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onDisagreeChange when disagree button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onDisagreeChange={mockHandler} />);
      await user.click(screen.getByText("Ne"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onImportantChange when important button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onImportantChange={mockHandler} />);
      await user.click(screen.getByLabelText("Pro mě důležité"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });
});
