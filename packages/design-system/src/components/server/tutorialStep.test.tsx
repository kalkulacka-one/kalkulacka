import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { icons } from "../icons";
import { TutorialStep } from "./tutorialStep";

function renderStep(children?: React.ReactNode) {
  return render(
    <ul>
      <TutorialStep icon={icons.starThin} title="Pro mě důležité" description="Otázku, na které vám obzvlášť záleží, můžete označit jako důležitou.">
        {children}
      </TutorialStep>
    </ul>,
  );
}

describe("TutorialStep", () => {
  it("renders as a list item with the title and description", () => {
    renderStep();
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("ko:flex", "ko:items-start", "ko:gap-4", "ko:list-none");
    expect(item).toContainElement(screen.getByText("Pro mě důležité"));
    expect(item).toContainElement(screen.getByText("Otázku, na které vám obzvlášť záleží, můžete označit jako důležitou."));
  });

  it("sets the title strong and the description muted", () => {
    renderStep();
    expect(screen.getByText("Pro mě důležité").tagName).toBe("P");
    expect(screen.getByText("Pro mě důležité")).toHaveClass("ko:font-bold", "ko:text-text-strong");
    expect(screen.getByText("Otázku, na které vám obzvlášť záleží, můžete označit jako důležitou.")).toHaveClass("ko:text-text-muted");
  });

  it("draws the icon as decoration inside a round badge", () => {
    const { container } = renderStep();
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.parentElement?.tagName).toBe("SPAN");
    expect(svg?.parentElement).toHaveClass("ko:rounded-pill", "ko:bg-surface", "ko:size-11", "ko:text-text-muted");
  });

  it("renders a demonstration after the description", () => {
    renderStep(<button type="button">Vyzkoušet</button>);
    const demo = screen.getByRole("button", { name: "Vyzkoušet" });
    expect(demo.previousElementSibling).toHaveTextContent("Otázku, na které vám obzvlášť záleží, můžete označit jako důležitou.");
  });
});
