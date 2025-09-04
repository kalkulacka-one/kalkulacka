import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReviewNavigationCard } from "./review-navigation-card";

describe("ReviewNavigationCard", () => {
  it("should render the review navigation card", () => {
    const mockOnClick = vi.fn();
    
    render(<ReviewNavigationCard onNextClick={mockOnClick} />);
    
    expect(screen.getByRole("button", { name: /začít odpovídat/i })).toBeInTheDocument();
  });

  it("should call onNextClick when button is clicked", () => {
    const mockOnClick = vi.fn();
    
    render(<ReviewNavigationCard onNextClick={mockOnClick} />);
    
    const button = screen.getByRole("button", { name: /začít odpovídat/i });
    button.click();
    
    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});