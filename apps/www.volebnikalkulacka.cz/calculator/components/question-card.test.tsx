import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { QuestionCard } from "./question-card";

describe("QuestionCard", () => {
  const questionCurrent = 1;
  const questionTotal = 10;
  it("should render the question card with required props", () => {
    const mockQuestion: Question = {
      id: "1",
      title: "Test Question Title",
      statement: "Test Question Statement",
    };

    render(<QuestionCard question={mockQuestion} questionCurrent={questionCurrent} questionTotal={questionTotal} />);

    expect(screen.getByText(`${questionCurrent}/${questionTotal}`)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.statement)).toBeInTheDocument();
  });
  it("should render the question card with all props", () => {
    const mockQuestion: Question = {
      id: "1",
      title: "Test Question Title",
      statement: "Test Question Statement",
      detail: "Test Question Detail",
      tags: ["Test tag"],
    };

    render(<QuestionCard question={mockQuestion} questionCurrent={questionCurrent} questionTotal={questionTotal} />);

    expect(screen.getByText(`${questionCurrent}/${questionTotal}`)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.statement)).toBeInTheDocument();
    expect(screen.queryByText(mockQuestion.detail ?? "")).toBeInTheDocument();
    if (mockQuestion.tags) {
      expect(screen.queryByText(mockQuestion.tags.join(""))).toBeInTheDocument();
    }
  });
});
