import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarVariants, initialsOf } from "./avatar";

describe("initialsOf", () => {
  it("takes the first letter of the first two words, whatever they are", () => {
    expect(initialsOf("Žijeme Pardubice")).toBe("ŽP");
    expect(initialsOf("Piráti a Starostové")).toBe("PA");
  });

  it("keeps digits and skips punctuation", () => {
    expect(initialsOf("ANO 2011")).toBe("A2");
    expect(initialsOf("KDU-ČSL")).toBe("K");
    expect(initialsOf("Piráti: 42projektu.cz")).toBe("P4");
  });

  it("upper-cases and copes with an empty name", () => {
    expect(initialsOf("zelení")).toBe("Z");
    expect(initialsOf("")).toBe("");
  });
});

describe("Avatar", () => {
  it("renders the initials, hidden from assistive tech, as a span", () => {
    const { container } = render(<Avatar name="Žijeme Pardubice" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("SPAN");
    const initials = root.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(initials).toHaveTextContent("ŽP");
    expect(root.querySelector("img")).not.toBeInTheDocument();
  });

  it("is a medium circle by default", () => {
    const { container } = render(<Avatar name="ODS" />);
    expect(container.firstElementChild).toHaveClass("ko:size-11", "ko:rounded-pill");
    expect(AvatarVariants().split(" ")).toEqual(expect.arrayContaining(["ko:bg-[var(--avatar-wash,var(--ko-color-neutral-soft))]", "ko:after:rounded-[inherit]"]));
  });

  it("scales to the 2026 sizes", () => {
    const { container } = render(
      <>
        <Avatar name="ODS" size="small" />
        <Avatar name="ODS" size="large" />
      </>,
    );
    expect(container.children[0]).toHaveClass("ko:size-8");
    expect(container.children[1]).toHaveClass("ko:size-16");
  });

  it("keeps the picture as a sibling after the initials, with an empty alt", () => {
    const { container } = render(<Avatar name="ODS" src="https://example.test/ods.png" />);
    const root = container.firstElementChild as HTMLElement;
    const image = root.querySelector("img") as HTMLImageElement;
    expect(image).toHaveAttribute("src", "https://example.test/ods.png");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveClass("ko:absolute", "ko:inset-0", "ko:bg-surface", "ko:object-cover");
    expect(root.lastElementChild).toBe(image);
    expect(root.firstElementChild).toHaveTextContent("O");
  });

  it("pre-mixes the accent into the ring and wash variables", () => {
    const { container } = render(<Avatar name="ODS" accent="light-dark(#2563eb, #3b82f6)" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--avatar-ring")).toBe("oklch(from light-dark(#2563eb, #3b82f6) l c h / 0.6)");
    expect(root.style.getPropertyValue("--avatar-wash")).toBe("oklch(from light-dark(#2563eb, #3b82f6) l c h / 0.16)");
  });

  it("sets no variables without an accent, so an ancestor's still apply", () => {
    const { container } = render(<Avatar name="ODS" />);
    expect((container.firstElementChild as HTMLElement).getAttribute("style")).toBeNull();
  });

  describe("legacy match card", () => {
    const image = { original: "https://example.test/original.png", xs: "https://example.test/xs.png", md: "https://example.test/md.png" };

    it("renders the responsive set as a srcset with the smallest source", () => {
      const { container } = render(<Avatar image={image} shape="circle" size="large" />);
      const element = container.querySelector("img") as HTMLImageElement;
      expect(element).toHaveAttribute("src", "https://example.test/xs.png");
      expect(element).toHaveAttribute("srcset", "https://example.test/xs.png 100w, https://example.test/md.png 400w");
      expect(element).toHaveAttribute("sizes", "64px");
    });

    it("keeps square, padded, contained logos over a fill of their own", () => {
      const { container } = render(<Avatar image={image} backgroundColor="#e2e8f0" shape="square" fit="contain" padding alignment="top" size="large" />);
      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveClass("ko:rounded-2xl");
      const fill = root.firstElementChild as HTMLElement;
      expect(fill.style.backgroundColor).toBe("rgb(226, 232, 240)");
      const element = root.querySelector("img") as HTMLImageElement;
      expect(element).toHaveClass("ko:inset-2", "ko:object-contain", "ko:object-top");
      expect(element).not.toHaveClass("ko:inset-0", "ko:bg-surface");
    });

    it("prefers src over the responsive set when both are given", () => {
      const { container } = render(<Avatar name="ODS" src="https://example.test/ods.png" image={image} />);
      const element = container.querySelector("img") as HTMLImageElement;
      expect(element).toHaveAttribute("src", "https://example.test/ods.png");
      expect(element).not.toHaveAttribute("srcset");
    });
  });
});
