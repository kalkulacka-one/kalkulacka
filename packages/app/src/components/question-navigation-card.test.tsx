import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { QuestionNavigationCard } from "./question-navigation-card";

describe("QuestionNavigationCard", () => {
  const defaultProps = {
    current: 5,
    total: 40,
    isAnswered: false,
    onPreviousClick: vi.fn(),
    onNextClick: vi.fn(),
  };

  const renderNav = (props: Partial<typeof defaultProps> = {}) =>
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <QuestionNavigationCard {...defaultProps} {...props} />
      </LocaleProvider>,
    );

  describe("rendering", () => {
    it("renders the question counter", () => {
      renderNav();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("/40")).toBeInTheDocument();
    });

    it("renders 'Předchozí' and 'Přeskočit' when unanswered", () => {
      renderNav();
      expect(screen.getByText("Předchozí")).toBeInTheDocument();
      expect(screen.getByText("Přeskočit")).toBeInTheDocument();
    });

    it("shows 'Další' when the question is answered", () => {
      renderNav({ isAnswered: true });
      expect(screen.getByText("Další")).toBeInTheDocument();
    });

    it("shows 'Návod' instead of 'Předchozí' for the first question", () => {
      renderNav({ current: 1 });
      expect(screen.getByText("Návod")).toBeInTheDocument();
      expect(screen.queryByText("Předchozí")).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    let user: ReturnType<typeof userEvent.setup>;
    let mockHandler: ReturnType<typeof vi.fn<() => void>>;

    beforeEach(() => {
      user = userEvent.setup();
      mockHandler = vi.fn<() => void>();
    });

    it("calls onPreviousClick when 'Předchozí' is clicked", async () => {
      renderNav({ onPreviousClick: mockHandler });
      await user.click(screen.getByText("Předchozí"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onPreviousClick when 'Návod' is clicked on the first question", async () => {
      renderNav({ current: 1, onPreviousClick: mockHandler });
      await user.click(screen.getByText("Návod"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onNextClick when 'Přeskočit' is clicked", async () => {
      renderNav({ onNextClick: mockHandler });
      await user.click(screen.getByText("Přeskočit"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onNextClick when 'Další' is clicked", async () => {
      renderNav({ isAnswered: true, onNextClick: mockHandler });
      await user.click(screen.getByText("Další"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });
});
