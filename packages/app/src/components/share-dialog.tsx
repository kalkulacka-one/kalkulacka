"use client";

// Ported from kalkulacka-2026/apps/web/components/share-dialog.tsx and share-dialog.module.css
import {
  Button,
  type CardFormat,
  type CardTheme,
  canShareImages,
  cardSwatches,
  copyShareCardImage,
  Dialog,
  downloadImage,
  renderShareCard,
  ShareCard,
  type ShareCardContent,
  shareImage,
} from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";
import { VisuallyHidden } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { usePointerKind } from "@/client/hooks";
import { chooseShareMode, copyText } from "@/utilities";

/** Which of the dialog's actions completed — how the result left the app. */
export type ShareMethod = "image" | "image-copy" | "image-download" | "link";

export type ShareDialog = {
  open: boolean;
  onClose: () => void;
  /** Everything printed on the card, already localized and formatted. */
  content: ShareCardContent;
  /** The downloaded file's stem — `<fileName>-<format>-<theme>.png`. */
  fileName: string;
  /**
   * The address offered alongside the picture in the OS share sheet: the
   * calculator's *intro*, never the results page the sender is standing on — a
   * recipient opening that page's own URL would see the sender's ranking, not
   * a blank calculator waiting for their own answers. Absolute, so it survives
   * leaving the tab.
   */
  shareUrl?: string;
  /**
   * What it takes to turn this result into a link somebody else can open:
   * mints the public link and resolves to its absolute address, or `null` when
   * it could not be made.
   *
   * Absent when there is no backend to mint one — a fork that configured none
   * gets exactly the dialog it had before public links existed, image and all,
   * with no dead button explaining what it cannot do.
   */
  onRequestShareLink?: () => Promise<string | null>;
  /**
   * An action completed: the OS sheet took the picture — or, where the sheet
   * fell through, the download that stood in for it — (`image`), the picture
   * landed on the clipboard (`image-copy`), the file was saved
   * (`image-download`), or the public link was copied (`link`). Nothing for a
   * dismissed sheet or a failure: the app's analytics hook counts hand-offs,
   * not attempts.
   */
  onShared?: (method: ShareMethod) => void;
};

/**
 * Every outcome any of the three image actions (sheet-share, copy, download)
 * can leave behind. One field for all three rather than one per action: only
 * one of them is ever mid-flight at a time (see the `disabled` props below),
 * so there is never a moment where two genuinely different outcomes need
 * showing at once.
 */
type Status = "idle" | "working" | "saved" | "copied" | "copyFailedSaved" | "failed";

/**
 * The link's own progress, kept apart from the image's.
 *
 * Two actions that can each be mid-flight, and each fail for its own reason —
 * one state for both would let a failed mint clear a successful save's
 * message, or disable the button that had nothing to do with it.
 */
type LinkStatus = "idle" | "working" | "copied" | "failed";

const bodyClasses = "koa:flex koa:flex-col koa:gap-4";

/*
 * A fixed box for the preview, so switching between portrait and landscape
 * changes the picture without the dialog jumping height and shoving the
 * share button off a phone's screen. Sized to leave room for the controls row
 * and the button beneath it within a typical phone viewport, rather than to
 * show the card as large as possible — this is a preview, not the artwork.
 */
const previewClasses = "koa:flex koa:items-center koa:justify-center koa:min-h-44 koa:p-3 koa:rounded-(--ko-radius-card) koa:bg-(--ko-color-surface-sunken)";

/*
 * Theme and format share one row — everything in it is identified by shape
 * or `aria-label` rather than by an on-screen word, which is what keeps this
 * one line tall instead of two stacked, labelled groups.
 */
const controlsClasses = "koa:flex koa:items-center koa:gap-3";

const groupClasses = "koa:m-0 koa:p-0 koa:border-none koa:min-w-0";

const dividerClasses = "koa:flex-none koa:w-px koa:h-6 koa:bg-(--ko-color-border)";

const optionsClasses = "koa:flex koa:gap-2";

/*
 * A colour circle, not a labelled chip — the fill *is* the label. The pressed
 * state is a ring one step out from the swatch rather than a border on it, so
 * the full circle keeps showing colour right up to its edge.
 */
const swatchClasses = [
  "koa:flex-none koa:size-9 koa:p-0 koa:rounded-full koa:cursor-pointer",
  "koa:border koa:border-solid koa:border-(--ko-color-border) koa:bg-(--ko-color-surface-sunken)",
  "koa:transition-[box-shadow,border-color] koa:duration-(--ko-duration-fast) koa:ease-(--ko-ease-exit)",
  "koa:hover:border-(--ko-color-border-strong)",
  "koa:aria-pressed:border-(--ko-color-focus) koa:aria-pressed:shadow-[0_0_0_2px_var(--ko-color-surface),0_0_0_4px_var(--ko-color-focus)]",
].join(" ");

const formatClasses = [
  "koa:flex koa:items-center koa:justify-center koa:flex-none koa:size-9 koa:p-0 koa:cursor-pointer",
  "koa:bg-(--ko-color-surface) koa:border koa:border-solid koa:border-(--ko-color-border) koa:rounded-(--ko-radius-chip)",
  "koa:transition-[border-color,background-color] koa:duration-(--ko-duration-fast) koa:ease-(--ko-ease-exit)",
  "koa:hover:border-(--ko-color-border-strong) koa:hover:bg-(--ko-color-surface-hover)",
  "koa:aria-pressed:border-(--ko-color-focus) koa:aria-pressed:shadow-[inset_0_0_0_1px_var(--ko-color-focus)]",
].join(" ");

/* A page shape at icon scale — the fastest read of what portrait vs landscape means. */
const formatShapeClasses: Record<CardFormat, string> = {
  story: "koa:rounded-[2px] koa:bg-(--ko-color-text-subtle) koa:w-2.5 koa:h-[1.0625rem]",
  landscape: "koa:rounded-[2px] koa:bg-(--ko-color-text-subtle) koa:w-[1.0625rem] koa:h-2.5",
};

/*
 * Always in the DOM so assistive tech is already watching it, and holding its
 * line of space so the share button above doesn't jump when a message arrives.
 */
const statusClasses = "koa:m-0 koa:min-h-5 koa:font-(family-name:--ko-font-sans) koa:text-sm koa:leading-5 koa:text-(--ko-color-text-muted) koa:data-failed:text-(--ko-color-disagree)";

/**
 * Turn the result into a picture someone can post.
 *
 * Two different UIs, chosen by pointer kind (`chooseShareMode`) rather than
 * by feature-sniffing alone:
 *
 *  - On a touch device that can share files, the OS sheet is the single
 *    action — Messages, Instagram, AirDrop, Photos are all destinations this
 *    app has no business knowing about, and the sheet's own "Save Image"
 *    entry already covers saving, so there is no separate save action beside
 *    it. The address handed to the sheet alongside the picture is the
 *    calculator's *intro*, not this results page — a recipient opening this
 *    page's own URL would see the sender's ranking, not a blank calculator
 *    waiting for their own answers.
 *  - On a fine pointer, the sheet is never offered at all, even where
 *    `navigator.share` claims to support files: macOS Safari answers that
 *    claim honestly and then opens a sheet whose own "Copy" entry pastes the
 *    exported PNG's *temp-file path* as text into whatever the reader pasted
 *    into, not the image. Desktop gets two plain actions instead — copy the
 *    image to the clipboard, or download it — neither of which routes
 *    through that sheet.
 */
export function ShareDialog({ open, onClose, content, fileName, shareUrl, onRequestShareLink, onShared }: ShareDialog) {
  const t = useTranslations("koa.components.shareDialog");
  const [theme, setTheme] = useState<CardTheme>("light");
  const [cardFormat, setCardFormat] = useState<CardFormat>("story");
  const [status, setStatus] = useState<Status>("idle");
  const [linkStatus, setLinkStatus] = useState<LinkStatus>("idle");
  const pointerKind = usePointerKind();
  /*
   * Resolved on the client, after mount: `navigator.canShare` is absent during
   * the server render, and deciding the dialog's layout from that would ship
   * one shape into the HTML and then swap it on hydration. `null` until known
   * — `usePointerKind` starts at its own hydration-safe default ('touch') for
   * the same reason, so the pair agrees with the server on every render up to
   * the point the effects below correct them, and `mode` below falls back to
   * the sheet layout for that one frame, which is what the app already showed
   * before this dialog could tell touch and mouse apart.
   */
  const [canShareFiles, setCanShareFiles] = useState<boolean | null>(null);
  /** Sampled once the dialog is up: reading them needs the themed DOM. */
  const [swatches, setSwatches] = useState<Record<CardTheme, string> | null>(null);

  useEffect(() => setCanShareFiles(canShareImages()), []);

  useEffect(() => {
    if (open) setSwatches(cardSwatches());
  }, [open]);

  const mode = canShareFiles === null ? "sheet" : chooseShareMode(pointerKind, canShareFiles);

  // Clearing on close as well as on a timer: reopening the dialog should not
  // still be showing the outcome of the last visit.
  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setLinkStatus("idle");
    }
  }, [open]);

  useEffect(() => {
    if (status === "idle" || status === "working") return;
    const isError = status === "failed" || status === "copyFailedSaved";
    const timer = window.setTimeout(() => setStatus("idle"), isError ? 6000 : 2400);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (linkStatus === "idle" || linkStatus === "working") return;
    const timer = window.setTimeout(() => setLinkStatus("idle"), linkStatus === "failed" ? 6000 : 2400);
    return () => window.clearTimeout(timer);
  }, [linkStatus]);

  const exportName = useMemo(() => `${fileName}-${cardFormat}-${theme}.png`, [fileName, cardFormat, theme]);

  const onShare = useCallback(async () => {
    setStatus("working");
    try {
      const blob = await renderShareCard({ content, theme, format: cardFormat });
      if (!blob) {
        setStatus("failed");
        return;
      }

      // The sheet's own caption, where the platform offers one — the card's
      // headline and which calculator it came from, joined here rather than
      // held on `content` (which keeps them apart so the lockup can weight
      // them separately).
      const caption = [content.title, content.electionName, content.calculatorName].filter(Boolean).join(" · ");

      const result = await shareImage({
        blob,
        fileName: exportName,
        title: content.title,
        text: caption,
        // The intro, not `window.location.href`: a recipient who opens this
        // page's own address would render the sender's result, not a blank
        // calculator waiting for their own answers.
        url: shareUrl,
      });

      // A dismissed share sheet is a finished interaction, not a failure —
      // nothing to report, and nothing to undo.
      if (result === "cancelled" || result === "shared") setStatus("idle");
      else setStatus(result === "downloaded" ? "saved" : "failed");

      // Both the OS share sheet and the direct-download fallback are a
      // completed hand-off of the image — a cancelled sheet or a failed
      // export is not.
      if (result === "shared" || result === "downloaded") onShared?.("image");
    } catch {
      setStatus("failed");
    }
  }, [content, theme, cardFormat, exportName, shareUrl, onShared]);

  /**
   * Copy the card straight onto the clipboard, as a PNG.
   *
   * The gesture-timing constraint that makes this work in Safari lives in
   * `copyShareCardImage` itself (see its own comment) — this callback's only
   * job is to stay out of that function's way, which is why it does not
   * `await` anything before calling it.
   */
  const onCopyImage = useCallback(() => {
    setStatus("working");
    copyShareCardImage({ content, theme, format: cardFormat, fileName: exportName })
      .then((result) => {
        if (result === "copied") setStatus("copied");
        else if (result === "downloaded") setStatus("copyFailedSaved");
        else setStatus("failed");

        // The download the copy fell back to is still the picture leaving
        // the app: reported as the image, as 2026 does, not as a copy.
        if (result === "copied") onShared?.("image-copy");
        else if (result === "downloaded") onShared?.("image");
      })
      .catch(() => setStatus("failed"));
  }, [content, theme, cardFormat, exportName, onShared]);

  const onDownload = useCallback(async () => {
    setStatus("working");
    try {
      const blob = await renderShareCard({ content, theme, format: cardFormat });
      const ok = blob ? downloadImage(blob, exportName) : false;
      setStatus(ok ? "saved" : "failed");
      if (ok) onShared?.("image-download");
    } catch {
      setStatus("failed");
    }
  }, [content, theme, cardFormat, exportName, onShared]);

  /**
   * Turn the result into an address, and put it on the clipboard.
   *
   * Two steps that can each fail, reported as one outcome because the reader
   * asked for one thing: minting the public link (the app's job — it owns the
   * session and the routes), then copying — through `copyText`, which is the
   * path that still works on a phone without a secure context, where
   * `navigator.clipboard` does not exist at all.
   */
  const onCopyLink = useCallback(async () => {
    if (!onRequestShareLink) return;
    setLinkStatus("working");

    const publicUrl = await onRequestShareLink().catch(() => null);
    if (!publicUrl) {
      setLinkStatus("failed");
      return;
    }

    const copied = await copyText(publicUrl);
    setLinkStatus(copied ? "copied" : "failed");
    if (copied) onShared?.("link");
  }, [onRequestShareLink, onShared]);

  /*
   * One line for every action. They cannot be mid-flight and finished at the
   * same time in any way worth reporting twice, and the link's outcome wins
   * because it is the more recent press whenever both have one.
   */
  const statusText = (() => {
    if (linkStatus === "copied") return t("linkCopied");
    if (linkStatus === "failed") return t("linkFailed");
    if (status === "saved") return t("saved");
    if (status === "copied") return t("imageCopied");
    if (status === "copyFailedSaved") return t("imageCopyFailedSaved");
    if (status === "failed") return t("failed");
    return "";
  })();

  const failed = status === "failed" || status === "copyFailedSaved" || linkStatus === "failed";
  const imageBusy = status === "working";

  const themes: readonly { id: CardTheme; label: string }[] = [
    { id: "light", label: t("themeLight") },
    { id: "dark", label: t("themeDark") },
    { id: "agree", label: t("themeAgree") },
    { id: "disagree", label: t("themeDisagree") },
  ];

  const formats: readonly { id: CardFormat; label: string }[] = [
    { id: "story", label: t("formatStory") },
    { id: "landscape", label: t("formatLandscape") },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t("title")}
      closeLabel={t("close")}
      size="wide"
      actions={
        <>
          {/*
            First, and quieter: the picture is what this dialog is for. The
            link is the thing you reach for when you want somebody to see the
            whole result rather than the top five.
          */}
          {onRequestShareLink ? (
            <Button variant="surface" onClick={onCopyLink} iconStart={icons.link} disabled={linkStatus === "working"}>
              {linkStatus === "working" ? t("copyingLink") : t("copyLink")}
            </Button>
          ) : null}

          {mode === "sheet" ? (
            <Button variant="solid" color="neutral" onClick={onShare} iconStart={icons.share} disabled={imageBusy} fullWidth={!onRequestShareLink}>
              {imageBusy ? t("working") : t("shareImage")}
            </Button>
          ) : (
            <>
              <Button variant="surface" onClick={onDownload} iconStart={icons.download} disabled={imageBusy}>
                {imageBusy ? t("working") : t("download")}
              </Button>
              <Button variant="solid" color="neutral" onClick={onCopyImage} iconStart={icons.copy} disabled={imageBusy}>
                {imageBusy ? t("working") : t("copyImage")}
              </Button>
            </>
          )}
        </>
      }
    >
      <div className={bodyClasses}>
        <div className={previewClasses} data-format={cardFormat}>
          <ShareCard content={content} theme={theme} format={cardFormat} size={cardFormat === "story" ? 172 : 260} label={t("preview")} />
        </div>

        {/*
          One row: four theme circles, then the two format toggles — labels
          live in `aria-label`/a hidden legend instead of on-screen text, which
          is what keeps this compact enough to leave the share button above the
          fold on a phone.
        */}
        <div className={controlsClasses}>
          <fieldset className={groupClasses}>
            <legend>
              <VisuallyHidden>{t("themeLabel")}</VisuallyHidden>
            </legend>
            <div className={optionsClasses}>
              {themes.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={swatchClasses}
                  aria-pressed={theme === option.id}
                  aria-label={option.label}
                  title={option.label}
                  onClick={() => setTheme(option.id)}
                  style={swatches ? { background: swatches[option.id] } : undefined}
                />
              ))}
            </div>
          </fieldset>

          <div className={dividerClasses} aria-hidden="true" />

          <fieldset className={groupClasses}>
            <legend>
              <VisuallyHidden>{t("formatLabel")}</VisuallyHidden>
            </legend>
            <div className={optionsClasses}>
              {formats.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={formatClasses}
                  aria-pressed={cardFormat === option.id}
                  aria-label={option.label}
                  title={option.label}
                  onClick={() => setCardFormat(option.id)}
                >
                  <span className={formatShapeClasses[option.id]} aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/*
          Always in the DOM so assistive tech is already watching it, and
          holding its line of space so the button above doesn't jump when a
          message arrives.
        */}
        <p className={statusClasses} role="status" data-failed={failed ? "" : undefined}>
          {statusText}
        </p>
      </div>
    </Dialog>
  );
}
