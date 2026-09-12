"use client";

// Ported from kalkulacka-2026/packages/ui/src/share-card/export-share-card.tsx
import { toBlob } from "html-to-image";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { CARD_SIZES, type CardFormat } from "./cardFormat";
import { type ShareCardContent, ShareCardLayout } from "./shareCardLayout";
import { type CardTheme, cardColorSet, readActiveColorSets } from "./themeColors";

export type RenderShareCardOptions = {
  content: ShareCardContent;
  theme: CardTheme;
  format: CardFormat;
};

/**
 * The card at export size, as a PNG blob.
 *
 * A real (if temporary) React tree, not the preview scaled back up: a fresh
 * root is mounted off-screen at true export pixels, painted, rasterised with
 * `html-to-image`, and torn down — so what is captured is pixel-for-pixel the
 * same DOM `ShareCardLayout` renders everywhere else, avatars and all.
 * Nothing is uploaded and nothing is stored; the blob exists only in memory
 * for as long as it takes to hand off to `shareImage`/`downloadImage`.
 *
 * `host` sits at real viewport coordinates with `opacity: 0` rather than off
 * in the far distance with a huge negative offset — `Avatar`'s image is
 * `loading="lazy"`, and a browser only starts that fetch once the element is
 * judged near the viewport. A large offset routinely never crosses that
 * threshold at all, which is what silently blanked every avatar the first
 * time this was tried with `left: -99999px`.
 */
export async function renderShareCard({ content, theme, format }: RenderShareCardOptions): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const { width, height } = CARD_SIZES[format];
  const colors = cardColorSet(theme, readActiveColorSets());

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.inset = "0";
  host.style.opacity = "0";
  host.style.zIndex = "-1";
  host.style.pointerEvents = "none";
  document.body.appendChild(host);

  const root = createRoot(host);

  try {
    /*
     * Nothing in here waits on an animation frame, and that is deliberate: a
     * browser stops servicing `requestAnimationFrame` in a tab that isn't
     * visible, and backgrounding this tab mid-export is the *normal* case on a
     * phone — the OS share sheet is another app. An earlier version waited two
     * frames here and simply never finished once that happened.
     *
     * So: commit synchronously, then yield twice through the task queue (which
     * keeps running when hidden, merely throttled) to let React flush the
     * passive effects behind the layout.
     */
    flushSync(() => {
      root.render(<ShareCardLayout content={content} colors={colors} theme={theme} format={format} />);
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const node = host.firstElementChild;
    if (!(node instanceof HTMLElement)) return null;

    if (document.fonts?.ready) await document.fonts.ready.catch(() => undefined);

    /*
     * The winner's bar grows in and every row rises into place, so a capture
     * taken now would freeze the export on a half-drawn frame.
     *
     * Seek each one to its end rather than awaiting `animation.finished`:
     * a browser does not advance animations in a tab that isn't visible, so
     * awaiting them means an export started and then backgrounded — switching
     * apps to pick a share target is the *normal* case on a phone — never
     * resolves at all. `finish()` is synchronous and doesn't care.
     *
     * `getAnimations` is optional-called: a document without the Web
     * Animations API (jsdom, for one) has nothing mid-flight to settle.
     */
    for (const animation of node.getAnimations?.({ subtree: true }) ?? []) {
      // Throws on an infinite animation, which has no end to seek to; such an
      // animation also has no "settled" frame to wait for, so skipping it is
      // the only option either way.
      try {
        animation.finish();
      } catch {}
    }

    return await toBlob(node, { width, height, pixelRatio: 1 });
  } catch {
    return null;
  } finally {
    root.unmount();
    host.remove();
  }
}

export type ShareImageResult = "shared" | "downloaded" | "cancelled" | "failed";

export type ShareImageOptions = {
  blob: Blob;
  fileName: string;
  /** Text offered alongside the image where the platform supports it. */
  title?: string;
  text?: string;
  url?: string;
};

/**
 * Hand the image to the phone, or fall back to saving it.
 *
 * `navigator.share` with a `files` array is what opens the OS sheet — Messages,
 * Instagram stories, AirDrop, Photos — so the picture reaches wherever it is
 * going without this app knowing about any of those destinations, and the
 * OS's own "Save Image" entry inside that sheet is what covers saving too:
 * this never needs a second, separate save action once that path is
 * available. Support is checked with `canShare({ files })` rather than by
 * sniffing the browser: the property exists in desktop Chrome too, where a
 * file share may still be refused, and the check is the only honest way to
 * ask. `navigator.share`/`canShare` are also secure-context-only — absent
 * entirely over a plain `http://` origin (a LAN dev server, for instance),
 * which is a second, unrelated reason this can fall through to a download.
 *
 * Two things a caller has to respect:
 *
 *  - It must be invoked from a user gesture. An `await` before it is fine on
 *    iOS *provided* the promise chain started in the handler, which is why the
 *    rendering above is awaited by the caller and not started here.
 *  - `AbortError` means someone dismissed the sheet. That is a completed
 *    interaction, not a failure, and must not fall through to a download —
 *    silently saving a file that was just cancelled is worse than doing nothing.
 */
export async function shareImage({ blob, fileName, title, text, url }: ShareImageOptions): Promise<ShareImageResult> {
  const file = new File([blob], fileName, { type: blob.type || "image/png" });

  if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        ...(title ? { title } : {}),
        ...(text ? { text } : {}),
        ...(url ? { url } : {}),
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // Anything else — a share already in progress, a platform that accepted
      // the `canShare` but refuses the payload — falls through to the download.
    }
  }

  return downloadImage(blob, fileName) ? "downloaded" : "failed";
}

/** Save the blob under `fileName`, via an object URL that is revoked straight after. */
export function downloadImage(blob: Blob, fileName: string): boolean {
  if (typeof document === "undefined") return false;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);

  try {
    link.click();
  } catch {
    URL.revokeObjectURL(url);
    link.remove();
    return false;
  }

  link.remove();
  // Not revoked synchronously: Safari has to have started the download before
  // the URL goes away, and a frame is enough.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}

export type CopyShareCardOptions = RenderShareCardOptions & {
  /** Used only if the clipboard write fails and this falls back to a download. */
  fileName: string;
};

export type CopyImageResult = "copied" | "downloaded" | "failed";

/**
 * Put the card on the system clipboard as a PNG, or fail down to a download.
 *
 * Safari's rule for `navigator.clipboard.write` is stricter than Chrome's: the
 * `ClipboardItem` must be constructed, and `write` called, inside the same
 * synchronous stretch of the click handler that started this call — before
 * anything here is `await`ed. Safari revokes the click's "this came from a
 * user gesture" standing the instant control returns through a microtask, so
 * an `await renderShareCard(...)` *before* building the `ClipboardItem` is
 * exactly the shape that fails there (Chrome accepts it fine, which is why
 * that ordering is tempting and easy to ship by accident). The fix is to
 * never resolve the render first: `renderShareCard`'s promise is handed to
 * `ClipboardItem` directly as its `image/png` value, so the write starts
 * synchronously while the (async) render is still in flight behind it.
 *
 * Whatever goes wrong — no Clipboard API, the write refused, the render
 * itself failing inside that promise — falls through to a plain download
 * rather than leaving the reader with nothing to show for the click.
 */
export async function copyShareCardImage({ content, theme, format, fileName }: CopyShareCardOptions): Promise<CopyImageResult> {
  // Not awaited: see the function comment above for why this has to stay a
  // pending promise until after `ClipboardItem` exists.
  const pngPromise = renderShareCard({ content, theme, format }).then((blob) => {
    if (!blob) throw new Error("share card render failed");
    return blob;
  });

  if (typeof navigator !== "undefined" && navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": pngPromise })]);
      return "copied";
    } catch {
      // Refused, no permission, or the render promise above rejected — any of
      // those lands here rather than a caught exception at the call site.
    }
  }

  const blob = await pngPromise.catch(() => null);
  return blob && downloadImage(blob, fileName) ? "downloaded" : "failed";
}

/** Whether the OS sheet is available for images at all — decides the dialog's wording. */
export function canShareImages(): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;
  try {
    return navigator.canShare({
      files: [new File([new Blob([], { type: "image/png" })], "probe.png", { type: "image/png" })],
    });
  } catch {
    return false;
  }
}
