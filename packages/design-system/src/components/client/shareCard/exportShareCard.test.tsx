import { act } from "@testing-library/react";
import { toBlob } from "html-to-image";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { canShareImages, copyShareCardImage, downloadImage, renderShareCard, shareImage } from "./exportShareCard";

vi.mock("html-to-image", () => ({ toBlob: vi.fn() }));

const toBlobMock = vi.mocked(toBlob);

const content = {
  brand: "Volební kalkulačka",
  title: "Moje shoda",
  entries: [{ rank: 1, name: "SPOLU", percentLabel: "87 %", matchPercentage: 87 }],
};

const png = () => new Blob(["png"], { type: "image/png" });

const createObjectURL = vi.fn(() => "blob:card");
const revokeObjectURL = vi.fn();

beforeEach(() => {
  vi.stubGlobal("URL", Object.assign(URL, { createObjectURL, revokeObjectURL }));
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
  toBlobMock.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

/** `navigator.share`/`canShare`/`clipboard` are absent in jsdom; each test says what the platform offers. */
function stubNavigator(overrides: Partial<Navigator>) {
  for (const [key, value] of Object.entries(overrides)) {
    Object.defineProperty(navigator, key, { value, configurable: true, writable: true });
  }
  return () => {
    for (const key of Object.keys(overrides)) {
      Reflect.deleteProperty(navigator, key);
    }
  };
}

describe("renderShareCard", () => {
  it("mounts the layout in an invisible host at real viewport coordinates, rasterises it at export size, and tears the host down", async () => {
    const blob = png();
    toBlobMock.mockImplementation(async (node) => {
      const host = node.parentElement;
      expect(host?.style.position).toBe("fixed");
      expect(host?.style.inset).toBe("0px");
      expect(host?.style.opacity).toBe("0");
      expect(node.dataset.format).toBe("landscape");
      return blob;
    });

    const result = await act(() => renderShareCard({ content, theme: "agree", format: "landscape" }));

    expect(result).toBe(blob);
    expect(toBlobMock).toHaveBeenCalledWith(expect.any(HTMLElement), { width: 1920, height: 1080, pixelRatio: 1 });
    expect(document.body.querySelector("[data-format]")).toBeNull();
  });

  it("reports a failed rasterisation as null rather than throwing, and still cleans up", async () => {
    toBlobMock.mockRejectedValue(new Error("no canvas"));
    await expect(act(() => renderShareCard({ content, theme: "light", format: "story" }))).resolves.toBeNull();
    expect(document.body.querySelector("[data-format]")).toBeNull();
  });
});

describe("downloadImage", () => {
  it("clicks a temporary link to the blob and revokes the URL only later, once Safari has started the download", () => {
    vi.useFakeTimers();
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe("shoda.png");
      expect(this.href).toBe("blob:card");
      expect(this.isConnected).toBe(true);
    });

    expect(downloadImage(png(), "shoda.png")).toBe(true);
    expect(click).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector("a[download]")).toBeNull();
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.advanceTimersByTime(60_000);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:card");
    click.mockRestore();
  });
});

describe("shareImage", () => {
  it("hands the file to the OS sheet with the caption and the address, where the platform takes files", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const restore = stubNavigator({ canShare: vi.fn(() => true), share });

    const result = await shareImage({ blob: png(), fileName: "shoda.png", title: "Moje shoda", text: "Moje shoda · Pardubice", url: "https://example.test/uvod" });

    expect(result).toBe("shared");
    expect(share).toHaveBeenCalledWith({ files: [expect.any(File)], title: "Moje shoda", text: "Moje shoda · Pardubice", url: "https://example.test/uvod" });
    expect(share.mock.calls[0]?.[0].files[0].name).toBe("shoda.png");
    restore();
  });

  it("treats a dismissed sheet as a finished interaction — no download behind the reader's back", async () => {
    const restore = stubNavigator({ canShare: vi.fn(() => true), share: vi.fn().mockRejectedValue(new DOMException("dismissed", "AbortError")) });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    expect(await shareImage({ blob: png(), fileName: "shoda.png" })).toBe("cancelled");
    expect(click).not.toHaveBeenCalled();
    click.mockRestore();
    restore();
  });

  it("falls back to a download where files cannot be shared, or when the sheet refuses the payload", async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    expect(await shareImage({ blob: png(), fileName: "shoda.png" })).toBe("downloaded");

    const restore = stubNavigator({ canShare: vi.fn(() => true), share: vi.fn().mockRejectedValue(new Error("busy")) });
    expect(await shareImage({ blob: png(), fileName: "shoda.png" })).toBe("downloaded");
    expect(click).toHaveBeenCalledTimes(2);
    click.mockRestore();
    restore();
  });
});

describe("copyShareCardImage", () => {
  it("starts the clipboard write synchronously with the render still pending behind it", async () => {
    toBlobMock.mockResolvedValue(png());
    const write = vi.fn().mockResolvedValue(undefined);
    class ClipboardItemStub {
      constructor(public readonly items: Record<string, Promise<Blob>>) {}
    }
    vi.stubGlobal("ClipboardItem", ClipboardItemStub);
    const restore = stubNavigator({ clipboard: { write } as unknown as Clipboard });

    const pending = act(() => copyShareCardImage({ content, theme: "light", format: "story", fileName: "shoda.png" }));
    // Called before the render's own promise could have resolved — that is the Safari rule.
    expect(write).toHaveBeenCalledTimes(1);
    const item = write.mock.calls[0]?.[0][0] as ClipboardItemStub;
    expect(item.items["image/png"]).toBeInstanceOf(Promise);

    expect(await pending).toBe("copied");
    restore();
  });

  it("downloads instead when there is no Clipboard API to write to", async () => {
    toBlobMock.mockResolvedValue(png());
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    expect(await act(() => copyShareCardImage({ content, theme: "light", format: "story", fileName: "shoda.png" }))).toBe("downloaded");
    expect(click).toHaveBeenCalledTimes(1);
    click.mockRestore();
  });

  it("reports failure when the render itself produced nothing", async () => {
    toBlobMock.mockResolvedValue(null);
    expect(await act(() => copyShareCardImage({ content, theme: "light", format: "story", fileName: "shoda.png" }))).toBe("failed");
  });
});

describe("canShareImages", () => {
  it("asks the platform about a PNG file rather than sniffing the browser", () => {
    expect(canShareImages()).toBe(false);

    const canShare = vi.fn((_data?: ShareData) => true);
    const restore = stubNavigator({ canShare });
    expect(canShareImages()).toBe(true);
    expect(canShare.mock.calls[0]?.[0]?.files?.[0]?.type).toBe("image/png");
    restore();
  });
});
