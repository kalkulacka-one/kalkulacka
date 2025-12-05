import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { QuestionViewModel } from "@/calculator";

import { ComparisonQuestionCard } from "./comparison-question-card";

describe("ComparisonQuestionCard", () => {
  const mockQuestion: QuestionViewModel = {
    id: "1",
    title: "Test Question Title",
    statement: "Test Question Statement",
    detail: "Test Question Detail",
    tags: ["Test tag", "Another tag"],
  };

  const props = {
    current: 1,
    total: 10,
    question: mockQuestion,
  };

  it("should render the comparison question card", () => {
    render(<ComparisonQuestionCard {...props} />);

    expect(screen.getByText(props.current.toString())).toBeInTheDocument();
    expect(screen.getByText(props.total.toString())).toBeInTheDocument();
    expect(screen.getByText(props.question.title)).toBeInTheDocument();
    expect(screen.getByText(props.question.statement)).toBeInTheDocument();
  });
});
