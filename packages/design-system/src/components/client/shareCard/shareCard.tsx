"use client";

// Ported from kalkulacka-2026/packages/ui/src/share-card/share-card.tsx and share-card.module.css
import { useEffect, useState } from "react";

import { VisuallyHidden } from "../../server/visuallyHidden";
import { CARD_SIZES, type CardFormat } from "./cardFormat";
import { type ShareCardContent, ShareCardLayout } from "./shareCardLayout";
import { type CardColorSet, type CardTheme, cardColorSet, css, readActiveColorSets } from "./themeColors";

export type ShareCardProps = {
  content: ShareCardContent;
  theme: CardTheme;
  format: CardFormat;
  /** CSS width of the preview, in px — height follows the format's own aspect ratio. */
  size?: number;
  /** Announced in place of the preview, which is otherwise a picture of a picture. */
  label: string;
};

/*
 * The rounding and shadow live here, on the preview's own frame — not on
 * `ShareCardLayout`'s root, which stays square-cornered because it is also
 * the thing that gets rasterised for the export.
 */
const frameClasses = "ko:relative ko:overflow-hidden ko:rounded-card ko:max-w-full ko:shadow-[0_0_0_1px_var(--ko-color-border),var(--ko-shadow-surface)]";

const scaledClasses = "ko:origin-top-left";

/**
 * The card as it will be exported, at preview size.
 *
 * A scaled-down instance of the exact same `ShareCardLayout` the export
 * rasterises — not an approximation of it. Scaling with a CSS `transform`
 * rather than re-rendering smaller keeps every size in `ShareCardLayout`
 * meaningful as a real, fixed pixel value instead of one that has to be
 * re-derived per preview size.
 */
export function ShareCard({ content, theme, format, size = 240, label }: ShareCardProps) {
  const [colors, setColors] = useState<CardColorSet | null>(null);

  // Reads the live theme off the DOM, so this can't run during the server
  // render — there is no document, and no theme to read yet.
  useEffect(() => {
    setColors(cardColorSet(theme, readActiveColorSets()));
  }, [theme]);

  const { width, height } = CARD_SIZES[format];
  const scale = size / width;

  return (
    <div className={frameClasses} style={{ width: size, height: height * scale }}>
      {/*
        The list inside is real, interactive `MatchRow` markup with
        `pointer-events` switched off — hidden from assistive tech entirely
        rather than left for a screen reader to discover as a row of buttons
        that do nothing.
      */}
      <div className={scaledClasses} style={{ width, height, transform: `scale(${scale})` }} aria-hidden="true">
        {colors ? <ShareCardLayout content={content} colors={colors} theme={theme} format={format} /> : null}
      </div>
      <VisuallyHidden>{label}</VisuallyHidden>
    </div>
  );
}

/**
 * A CSS gradient sampling each theme's page/surface pair, for the dialog's
 * picker circles.
 *
 * Built from the same colour sets the layout itself renders from, rather than
 * hand-tuned separately in CSS — the two neutral themes especially can't be
 * written as static CSS at all: they read whichever mode the app is currently
 * in, which this resolves once, in JS, the same way the card itself does.
 */
export function cardSwatches(): Record<CardTheme, string> {
  const live = readActiveColorSets();
  const sample = (theme: CardTheme) => {
    const colors = cardColorSet(theme, live);
    return `linear-gradient(135deg, ${css(colors.page)}, ${css(colors.surface)})`;
  };

  return {
    light: sample("light"),
    dark: sample("dark"),
    agree: sample("agree"),
    disagree: sample("disagree"),
  };
}
