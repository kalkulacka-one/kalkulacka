import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AvatarStack, type AvatarStackItem } from "./avatarStack";

const PARTIES: AvatarStackItem[] = ["ANO 2011", "Piráti a Starostové", "ODS", "Společně pro Pardubice", "SPD", "KDU-ČSL", "TOP 09", "Zelení", "ČSSD", "Svobodní", "Volba pro město", "Nezávislí"].map(
  (name, index) => ({ id: `p${index}`, name }),
);

const label = "Strany, které s vámi souhlasí";

describe("AvatarStack", () => {
  it("renders nothing for an empty list", () => {
    const { container } = render(<AvatarStack items={[]} label={label} />);
    expect(container).toBeEmptyDOMElement();
  });

  describe("without a popover", () => {
    it("is an inert list named by the label, announcing every name", () => {
      render(<AvatarStack items={PARTIES.slice(0, 3)} label={label} />);
      const list = screen.getByRole("list", { name: label });
      expect(within(list).getAllByRole("listitem")).toHaveLength(3);
      expect(within(list).getByText("Piráti a Starostové")).toHaveClass("ko:sr-only");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("keeps a face for one over the limit — a +1 disc would cost the same room", () => {
      render(<AvatarStack items={PARTIES.slice(0, 9)} label={label} />);
      expect(screen.getAllByRole("listitem")).toHaveLength(9);
      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
    });

    it("collapses the overflow into a +n disc that still announces the hidden names", () => {
      render(<AvatarStack items={PARTIES} label={label} />);
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(9);
      const disc = screen.getByText("+4");
      expect(disc).toHaveAttribute("aria-hidden", "true");
      expect(within(items[8] as HTMLElement).getByText("ČSSD, Svobodní, Volba pro město, Nezávislí")).toHaveClass("ko:sr-only");
    });

    it("honours a custom max", () => {
      render(<AvatarStack items={PARTIES.slice(0, 6)} max={3} label={label} />);
      expect(screen.getAllByRole("listitem")).toHaveLength(4);
      expect(screen.getByText("+3")).toBeInTheDocument();
    });

    it("overlaps by size, with the first face back on the left edge", () => {
      const { container, rerender } = render(<AvatarStack items={PARTIES.slice(0, 2)} label={label} />);
      expect(container.firstElementChild).toHaveClass("ko:pl-2");
      expect(screen.getAllByRole("listitem")[0]).toHaveClass("ko:-ml-2");

      rerender(<AvatarStack items={PARTIES.slice(0, 2)} label={label} size="medium" />);
      expect(container.firstElementChild).toHaveClass("ko:pl-3");
      expect(screen.getAllByRole("listitem")[0]).toHaveClass("ko:-ml-3");
    });
  });

  describe("with a popover", () => {
    const popover = { closeLabel: "Zavřít" };

    it("is a collapsed trigger named by the label", () => {
      render(<AvatarStack items={PARTIES.slice(0, 3)} label={label} popover={popover} />);
      const trigger = screen.getByRole("button", { name: label });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("opens a captioned list of every face on tap and closes on a second tap", () => {
      render(<AvatarStack items={PARTIES} label={label} popover={popover} />);
      const trigger = screen.getByRole("button", { name: label });
      fireEvent.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      const panel = document.getElementById(trigger.getAttribute("aria-controls") ?? "") as HTMLElement;
      expect(panel).toBeInTheDocument();
      expect(within(panel).getAllByRole("listitem")).toHaveLength(12);
      expect(within(panel).getByText("Nezávislí")).toBeInTheDocument();
      expect(within(panel).getByText(label)).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("closes from its own X", () => {
      render(<AvatarStack items={PARTIES.slice(0, 3)} label={label} popover={popover} />);
      fireEvent.click(screen.getByRole("button", { name: label }));
      fireEvent.click(screen.getByRole("button", { name: "Zavřít" }));
      expect(screen.getByRole("button", { name: label })).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on Escape", () => {
      render(<AvatarStack items={PARTIES.slice(0, 3)} label={label} popover={popover} />);
      const trigger = screen.getByRole("button", { name: label });
      fireEvent.click(trigger);
      fireEvent.keyDown(trigger, { key: "Escape" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on a pointer-down outside, but not inside", () => {
      render(
        <>
          <AvatarStack items={PARTIES.slice(0, 3)} label={label} popover={popover} />
          <p>elsewhere</p>
        </>,
      );
      const trigger = screen.getByRole("button", { name: label });
      fireEvent.click(trigger);

      fireEvent.pointerDown(screen.getByText("ODS"));
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      fireEvent.pointerDown(screen.getByText("elsewhere"));
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("opens on a mouse hovering and closes when it leaves, ignoring touch", () => {
      render(<AvatarStack items={PARTIES.slice(0, 3)} label={label} popover={popover} />);
      const trigger = screen.getByRole("button", { name: label });
      const root = trigger.parentElement as HTMLElement;

      fireEvent.pointerEnter(root, { pointerType: "touch" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      fireEvent.pointerEnter(root, { pointerType: "mouse" });
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(root).toHaveClass("ko:z-6");

      fireEvent.pointerLeave(root, { pointerType: "mouse" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(root).not.toHaveClass("ko:z-6");
    });

    it("keeps a tapped-open popover open when the mouse wanders off", () => {
      render(<AvatarStack items={PARTIES.slice(0, 3)} label={label} popover={popover} />);
      const trigger = screen.getByRole("button", { name: label });
      const root = trigger.parentElement as HTMLElement;
      fireEvent.click(trigger);
      fireEvent.pointerLeave(root, { pointerType: "mouse" });
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });
});
