import { canShareImages, copyShareCardImage, downloadImage, renderShareCard, shareImage } from "@kalkulacka-one/design-system/client";

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";
import { copyText } from "@/utilities";

import { LocaleProvider } from "./providers";
import { ShareDialog } from "./share-dialog";

/* The export pipeline needs a canvas and a browser; here only the dialog's own choreography is under test. */
vi.mock("@kalkulacka-one/design-system/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@kalkulacka-one/design-system/client")>()),
  canShareImages: vi.fn(() => false),
  renderShareCard: vi.fn(),
  shareImage: vi.fn(),
  copyShareCardImage: vi.fn(),
  downloadImage: vi.fn(),
}));

vi.mock("@/utilities", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/utilities")>()),
  copyText: vi.fn(),
}));

const mocks = {
  canShareImages: vi.mocked(canShareImages),
  renderShareCard: vi.mocked(renderShareCard),
  shareImage: vi.mocked(shareImage),
  copyShareCardImage: vi.mocked(copyShareCardImage),
  downloadImage: vi.mocked(downloadImage),
  copyText: vi.mocked(copyText),
};

/* jsdom doesn't implement `<dialog>`'s `showModal()`/`close()` — the same minimum stub the design system's dialog tests use. */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

/** A fine, hovering pointer — the desktop — or a finger. */
function pointer(kind: "mouse" | "touch") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      matches: kind === "mouse" && query.includes("pointer: fine"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  });
}

const content = {
  brand: "Volební kalkulačka",
  electionName: "Sněmovní volby 2025",
  calculatorName: "Volební kalkulačka",
  title: "Moje shoda",
  winnerLabel: "Největší shoda",
  entries: [{ rank: 1, name: "Alfa", percentLabel: "67 %", matchPercentage: 67 }],
  url: "volebnikalkulacka.cz",
};

const png = new Blob(["png"], { type: "image/png" });

function renderDialog(props: Partial<React.ComponentProps<typeof ShareDialog>> = {}) {
  const onClose = vi.fn();
  render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <ShareDialog open onClose={onClose} content={content} fileName="shoda-abc" shareUrl="https://example.test/volby/uvod" {...props} />
    </LocaleProvider>,
  );
  return { onClose };
}

const dialog = () => screen.getByRole("dialog", { hidden: true });
const status = () => screen.getByRole("status");

beforeEach(() => {
  pointer("mouse");
  for (const mock of Object.values(mocks)) mock.mockReset();
  mocks.canShareImages.mockReturnValue(false);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ShareDialog", () => {
  it("names itself, previews the card and offers four themes and two formats with the first of each pressed", () => {
    renderDialog();
    expect(dialog()).toHaveAccessibleName("Sdílet výsledek");
    expect(screen.getByText("Náhled sdíleného obrázku")).toBeInTheDocument();

    const themes = ["Světlý", "Tmavý", "Souhlas", "Nesouhlas"].map((name) => screen.getByRole("button", { name }));
    expect(themes.map((button) => button.getAttribute("aria-pressed"))).toEqual(["true", "false", "false", "false"]);
    const formats = ["Na výšku", "Na šířku"].map((name) => screen.getByRole("button", { name }));
    expect(formats.map((button) => button.getAttribute("aria-pressed"))).toEqual(["true", "false"]);

    // The status line is there before it has anything to say, so it never shifts the layout when it does.
    expect(status()).toHaveTextContent("");
  });

  it("switches the preview's theme and format from the toggles", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Tmavý" }));
    expect(screen.getByRole("button", { name: "Tmavý" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Světlý" })).toHaveAttribute("aria-pressed", "false");

    await user.click(screen.getByRole("button", { name: "Na šířku" }));
    expect(screen.getByRole("button", { name: "Na šířku" })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector("[data-format='landscape']")).not.toBeNull();
  });

  describe("on a fine pointer", () => {
    it("offers download and copy, never the OS sheet — even when the platform claims to share files", () => {
      mocks.canShareImages.mockReturnValue(true);
      renderDialog();
      expect(screen.getByRole("button", { name: "Stáhnout" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Zkopírovat obrázek" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Sdílet obrázek" })).toBeNull();
    });

    it("downloads the rendered card under a name that says which card it is, and reports it", async () => {
      const user = userEvent.setup();
      mocks.renderShareCard.mockResolvedValue(png);
      mocks.downloadImage.mockReturnValue(true);
      renderDialog();

      await user.click(screen.getByRole("button", { name: "Tmavý" }));
      await user.click(screen.getByRole("button", { name: "Stáhnout" }));

      expect(mocks.renderShareCard).toHaveBeenCalledWith({ content, theme: "dark", format: "story" });
      expect(mocks.downloadImage).toHaveBeenCalledWith(png, "shoda-abc-story-dark.png");
      expect(status()).toHaveTextContent("Obrázek uložen");
    });

    it("says so when the card could not be made, in the failure tone", async () => {
      const user = userEvent.setup();
      mocks.renderShareCard.mockResolvedValue(null);
      renderDialog();

      await user.click(screen.getByRole("button", { name: "Stáhnout" }));
      expect(status()).toHaveTextContent("Obrázek se nepodařilo vytvořit. Zkuste to prosím znovu.");
      expect(status()).toHaveAttribute("data-failed");
    });

    it("copies the image without awaiting anything first, and names the download fallback when that is what happened", async () => {
      const user = userEvent.setup();
      mocks.copyShareCardImage.mockResolvedValue("copied");
      renderDialog();

      await user.click(screen.getByRole("button", { name: "Zkopírovat obrázek" }));
      expect(mocks.copyShareCardImage).toHaveBeenCalledWith({ content, theme: "light", format: "story", fileName: "shoda-abc-story-light.png" });
      expect(status()).toHaveTextContent("Obrázek zkopírován");

      mocks.copyShareCardImage.mockResolvedValue("downloaded");
      await user.click(screen.getByRole("button", { name: "Zkopírovat obrázek" }));
      expect(status()).toHaveTextContent("Obrázek se nepodařilo zkopírovat, byl stažen jako soubor.");
    });

    it("disables the image actions while one is in flight", async () => {
      const user = userEvent.setup();
      let finish: (blob: Blob | null) => void = () => {};
      mocks.renderShareCard.mockReturnValue(new Promise((resolve) => (finish = resolve)));
      mocks.downloadImage.mockReturnValue(true);
      renderDialog();

      await user.click(screen.getByRole("button", { name: "Stáhnout" }));
      expect(screen.getAllByRole("button", { name: "Připravujeme…" })).toHaveLength(2);
      for (const button of screen.getAllByRole("button", { name: "Připravujeme…" })) expect(button).toBeDisabled();

      await act(async () => finish(png));
      expect(screen.getByRole("button", { name: "Stáhnout" })).toBeEnabled();
    });
  });

  describe("on a touch device", () => {
    it("offers the OS sheet as the one full-width action when files can be shared", () => {
      pointer("touch");
      mocks.canShareImages.mockReturnValue(true);
      renderDialog();
      expect(screen.getByRole("button", { name: "Sdílet obrázek" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Stáhnout" })).toBeNull();
    });

    it("hands the sheet the picture, the caption and the intro address, and stays quiet whether it was sent or dismissed", async () => {
      const user = userEvent.setup();
      pointer("touch");
      mocks.canShareImages.mockReturnValue(true);
      mocks.renderShareCard.mockResolvedValue(png);
      mocks.shareImage.mockResolvedValue("cancelled");
      renderDialog();

      await user.click(screen.getByRole("button", { name: "Sdílet obrázek" }));
      expect(mocks.shareImage).toHaveBeenCalledWith({
        blob: png,
        fileName: "shoda-abc-story-light.png",
        title: "Moje shoda",
        text: "Moje shoda · Sněmovní volby 2025 · Volební kalkulačka",
        url: "https://example.test/volby/uvod",
      });
      expect(status()).toHaveTextContent("");
    });

    it("falls back to the desktop pair where files cannot be shared", () => {
      pointer("touch");
      renderDialog();
      expect(screen.getByRole("button", { name: "Stáhnout" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Sdílet obrázek" })).toBeNull();
    });
  });

  describe("the public link", () => {
    it("is not offered at all without a backend to mint it on", () => {
      renderDialog();
      expect(screen.queryByRole("button", { name: "Kopírovat odkaz" })).toBeNull();
    });

    it("mints the link, copies it, and reports the outcome ahead of the image's", async () => {
      const user = userEvent.setup();
      const onRequestShareLink = vi.fn().mockResolvedValue("https://example.test/volby/vysledek/abc");
      mocks.copyText.mockResolvedValue(true);
      renderDialog({ onRequestShareLink });

      await user.click(screen.getByRole("button", { name: "Kopírovat odkaz" }));
      expect(onRequestShareLink).toHaveBeenCalledTimes(1);
      expect(mocks.copyText).toHaveBeenCalledWith("https://example.test/volby/vysledek/abc");
      expect(status()).toHaveTextContent("Odkaz zkopírován");
    });

    it("reports a link that could not be made, whether the mint said no or threw", async () => {
      const user = userEvent.setup();
      const onRequestShareLink = vi.fn().mockResolvedValue(null);
      renderDialog({ onRequestShareLink });

      await user.click(screen.getByRole("button", { name: "Kopírovat odkaz" }));
      expect(status()).toHaveTextContent("Odkaz se nepodařilo vytvořit. Zkuste to prosím znovu.");
      expect(mocks.copyText).not.toHaveBeenCalled();

      onRequestShareLink.mockRejectedValue(new Error("offline"));
      await user.click(screen.getByRole("button", { name: "Kopírovat odkaz" }));
      expect(status()).toHaveTextContent("Odkaz se nepodařilo vytvořit. Zkuste to prosím znovu.");
    });
  });

  it("clears a message on its own, and sooner for good news than for bad", async () => {
    vi.useFakeTimers();
    mocks.renderShareCard.mockResolvedValue(png);
    mocks.downloadImage.mockReturnValue(true);
    renderDialog();

    /* `fireEvent` rather than user-event here: the latter paces itself on the very timers under test. */
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Stáhnout" }));
    });
    expect(status()).toHaveTextContent("Obrázek uložen");
    act(() => {
      vi.advanceTimersByTime(2400);
    });
    expect(status()).toHaveTextContent("");

    mocks.renderShareCard.mockResolvedValue(null);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Stáhnout" }));
    });
    act(() => {
      vi.advanceTimersByTime(2400);
    });
    expect(status()).toHaveTextContent("Obrázek se nepodařilo vytvořit. Zkuste to prosím znovu.");
    act(() => {
      vi.advanceTimersByTime(3600);
    });
    expect(status()).toHaveTextContent("");
  });

  it("dismisses from the corner", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();
    await user.click(screen.getByRole("button", { name: "Zavřít" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
