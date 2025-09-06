import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Candidate } from "../../../../../../packages/schema/schemas/candidate.schema";
import { MatchCard } from "./match-card";

describe("MatchCard", () => {
  const mockCandidate: Candidate = {
    id: "1",
    references: [],
    displayName: "Občanská demokratická strana",
    number: 1,
  };

  const props = {
    candidate: mockCandidate,
    order: 1,
    match: 85,
  };

  it("renders candidate information", () => {
    render(<MatchCard {...props} />);

    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText(mockCandidate.displayName ?? "")).toBeInTheDocument();
    expect(screen.getByText("85 %")).toBeInTheDocument();
  });
});
