import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AnswerViewModel } from "@/calculator/view-models/server";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";
import { QuestionNavigationCard } from "./question-navigation-card";

describe("QuestionNavigationCard", () => {
  const mockAnswerWithResponse: AnswerViewModel = {
    answer: {
      questionId: "550e8400-e29b-41d4-a716-446655440000",
      answer: true,
      isImportant: true,
    },
    setAnswer: vi.fn() as (answer: Partial<Answer> & { questionId: string }) => void,
  };

  const mockAnswerNoResponse: AnswerViewModel = {
    answer: undefined,
    setAnswer: vi.fn() as (answer: Partial<Answer> & { questionId: string }) => void,
  };

  const defaultProps = {
    current: 5,
    total: 40,
    onPreviousClick: vi.fn() as () => void,
    onNextClick: vi.fn() as () => void,
    onAgreeChange: vi.fn() as (agree: boolean) => void,
    onDisagreeChange: vi.fn() as (disagree: boolean) => void,
    onImportantChange: vi.fn() as (isImportant: boolean) => void,
    answer: mockAnswerNoResponse,
  } as const;

  describe("rendering", () => {
    it("renders question counter", () => {
      render(<QuestionNavigationCard {...defaultProps} />);
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("/ 40")).toBeInTheDocument();
    });

    it("renders navigation buttons", () => {
      render(<QuestionNavigationCard {...defaultProps} />);

      expect(screen.getByText("Předchozí")).toBeInTheDocument();
      expect(screen.getByText("Přeskočit")).toBeInTheDocument();
    });

    it("shows 'Další' when answer is provided", () => {
      render(<QuestionNavigationCard {...defaultProps} answer={mockAnswerWithResponse} />);
      expect(screen.getByText("Další")).toBeInTheDocument();
    });

    it("shows 'Návod' for first question", () => {
      render(<QuestionNavigationCard {...defaultProps} current={1} />);
      expect(screen.getByText("Návod")).toBeInTheDocument();
      expect(screen.queryByText("Předchozí")).not.toBeInTheDocument();
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
      render(<QuestionNavigationCard {...defaultProps} answer={mockAnswerWithResponse} />);

      expect(screen.getByText("Ano")).toBeChecked();
      expect(screen.getByText("Ne")).not.toBeChecked();
      expect(screen.getByLabelText("Pro mě důležité")).toBeChecked();
    });
  });

  describe("interactions", () => {
    let user: ReturnType<typeof userEvent.setup>;
    let mockHandler: () => void;

    beforeEach(() => {
      user = userEvent.setup();
      mockHandler = vi.fn() as () => void;
    });

    it("calls onPreviousClick when previous button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onPreviousClick={mockHandler} />);
      await user.click(screen.getByText("Předchozí"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onPreviousClick when 'Návod' button is clicked on first question", async () => {
      render(<QuestionNavigationCard {...defaultProps} current={1} onPreviousClick={mockHandler} />);
      await user.click(screen.getByText("Návod"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onNextClick when next button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onNextClick={mockHandler} />);
      await user.click(screen.getByText("Přeskočit")); // No answer, so shows "Přeskočit"
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onNextClick when 'Další' button is clicked with answer", async () => {
      render(<QuestionNavigationCard {...defaultProps} answer={mockAnswerWithResponse} onNextClick={mockHandler} />);
      await user.click(screen.getByText("Další"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onAgreeChange when agree button is clicked", async () => {
      const mockAgreeHandler = vi.fn() as (agree: boolean) => void;
      render(<QuestionNavigationCard {...defaultProps} onAgreeChange={mockAgreeHandler} />);
      await user.click(screen.getByText("Ano"));
      expect(mockAgreeHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onDisagreeChange when disagree button is clicked", async () => {
      const mockDisagreeHandler = vi.fn() as (disagree: boolean) => void;
      render(<QuestionNavigationCard {...defaultProps} onDisagreeChange={mockDisagreeHandler} />);
      await user.click(screen.getByText("Ne"));
      expect(mockDisagreeHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onImportantChange when important button is clicked", async () => {
      const mockImportantHandler = vi.fn() as (isImportant: boolean) => void;
      render(<QuestionNavigationCard {...defaultProps} onImportantChange={mockImportantHandler} />);
      await user.click(screen.getByLabelText("Pro mě důležité"));
      expect(mockImportantHandler).toHaveBeenCalledTimes(1);
    });
  });
});
