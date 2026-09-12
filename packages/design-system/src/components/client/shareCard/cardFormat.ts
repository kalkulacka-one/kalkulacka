// Ported from kalkulacka-2026/packages/ui/src/share-card/card-format.ts

/** The formats a share image can be exported in. */
export const CARD_FORMATS = ["story", "landscape"] as const;
export type CardFormat = (typeof CARD_FORMATS)[number];

/**
 * Export sizes. Story is Instagram/TikTok's 9:16; landscape is 16:9, which is
 * what every other surface — a tweet, a Telegram preview, a slide — crops
 * least badly. Both are the sizes those platforms upscale *to*, so exporting
 * at them means nothing is resampled on the way in.
 */
export const CARD_SIZES: Record<CardFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  landscape: { width: 1920, height: 1080 },
};
