// Ported from kalkulacka-2026/packages/ui/src/avatar/avatar.tsx and avatar.module.css
import { cva, type VariantProps } from "class-variance-authority";

import { twMerge } from "../../utilities";

export type ImageUrls = {
  original: string;
  xs?: string;
  sm?: string;
  md?: string;
};

export type AvatarSize = NonNullable<VariantProps<typeof AvatarVariants>["size"]>;

export type Avatar = {
  /**
   * Full name — the initials fallback behind the picture. Optional only for
   * the legacy match card, which passes `image` alone; every 2026 consumer
   * passes it, and an avatar without it has nothing to show when its picture
   * fails to load.
   */
  name?: string;
  /** A single picture URL. */
  src?: string;
  /** The legacy responsive set — rendered as a `srcset`. `src` wins when both are given. */
  image?: ImageUrls;
  /**
   * The candidate's accent colour: a ring around the face and a wash behind
   * it, pre-mixed here at fixed alphas from the same colour the match bar
   * uses. Unset, the avatar keeps the plain neutral look — a value handed
   * down as `--avatar-ring` / `--avatar-wash` from an ancestor (the way 2026's
   * `MatchRow` did it) still applies.
   */
  accent?: string;
  /**
   * The retired design's fill behind a padded logo. Kept for the legacy
   * match card; when set, the picture sits transparent over it as it always
   * did rather than painting its own surface.
   *
   * @deprecated Removed with the cleanup PR together with the legacy match card.
   */
  backgroundColor?: string;
  /** @deprecated Every 2026 avatar is a circle; `square` stays for the legacy match card's organisations. */
  shape?: "circle" | "square" | null;
  /** @deprecated Legacy match card only: crops a portrait to its top edge. */
  alignment?: "top" | "center";
  /** @deprecated Legacy match card only: insets a logo from the edge. */
  padding?: boolean;
  /** @deprecated Legacy match card only: `contain` for a logo, `cover` for a face. */
  fit?: "cover" | "contain";
  className?: string;
} & VariantProps<typeof AvatarVariants>;

/*
 * `--avatar-wash` / `--avatar-ring` are read with the plain neutral look as
 * the fallback rather than derived from a fallback colour here, because
 * applying the same alpha to the fallback too would quietly wash out every
 * avatar with no accent at all (Storybook's, chiefly). The ring lives on a
 * pseudo-element rather than the avatar's own box-shadow: a logo image sits
 * `inset: 0`, flush with the same edge, and an absolutely positioned child
 * paints over its parent's box-shadow — so the ring vanished on every avatar
 * that actually had a picture and only survived on the initials fallback.
 * `after` is generated last, which is what keeps it on top of the image.
 */
export const AvatarVariants = cva(
  [
    "ko:relative ko:inline-flex ko:flex-none ko:items-center ko:justify-center ko:overflow-hidden",
    "ko:bg-[var(--avatar-wash,var(--ko-color-neutral-soft))]",
    "ko:after:content-[''] ko:after:absolute ko:after:inset-0 ko:after:rounded-[inherit] ko:after:pointer-events-none",
    "ko:after:shadow-[inset_0_0_0_1.5px_var(--avatar-ring,var(--ko-color-border))]",
  ],
  {
    variants: {
      /* The 2026 pixel sizes, with the initials' type scaled to each. */
      size: {
        small: "ko:size-8 ko:text-xs",
        medium: "ko:size-11 ko:text-[0.9375rem]",
        large: "ko:size-16 ko:text-xl",
      },
      shape: {
        circle: "ko:rounded-pill",
        square: "ko:rounded-2xl",
      },
    },
    defaultVariants: {
      size: "medium",
      shape: "circle",
    },
  },
);

/* The `sizes` hint for the legacy `srcset`, in the same pixels as the variants above. */
const sizesAttr: Record<AvatarSize, string> = {
  small: "32px",
  medium: "44px",
  large: "64px",
};

/**
 * Take at most two initials, skipping the punctuation that party names are full
 * of ("ANO 2011" -> "A2", "KDU-ČSL" -> "K"). The first two *words*, whatever
 * they are: "Piráti a Starostové" is "PA". (The 2026 source's own comment
 * promised "PS", which its code never produced; the code is ported as it ran.)
 */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function getSmallestImageUrl(imageUrls: ImageUrls): string {
  return imageUrls.xs || imageUrls.sm || imageUrls.md || imageUrls.original;
}

function buildSrcSet(imageUrls: ImageUrls): string {
  const entries: string[] = [];
  if (imageUrls.xs) entries.push(`${imageUrls.xs} 100w`);
  if (imageUrls.sm) entries.push(`${imageUrls.sm} 200w`);
  if (imageUrls.md) entries.push(`${imageUrls.md} 400w`);
  return entries.join(", ");
}

/**
 * A candidate's picture, with initials behind it.
 *
 * The initials are rendered as a sibling rather than swapped in on error: a
 * transparent logo sitting over its own initials looks wrong, so the picture
 * carries an opaque surface of its own and covers them when it loads. The 2026
 * source also expected a picture that *fails* to reveal them — "no JavaScript
 * involved" — but that is not what browsers do: an absolutely positioned
 * `<img alt="">` that errors keeps its full box and still paints its
 * background (verified in Chrome), so a 404 logo shows a blank surface disc,
 * not the initials. Without an `onError` handler — which a server component
 * cannot carry — the two wishes cannot both be met in CSS, and the opaque
 * backing serves every transparent archive logo where the fallback would serve
 * only broken ones. Ported as the source ran; see the report for the follow-up.
 *
 * A `<span>`, not a `<div>`: the match row puts one of these inside a
 * `<button>`, which admits phrasing content only.
 */
export function Avatar({ name, src, image, accent, backgroundColor, shape, alignment = "center", padding = false, fit = "cover", size, className }: Avatar) {
  const style = accent
    ? ({
        "--avatar-wash": `oklch(from ${accent} l c h / 0.16)`,
        "--avatar-ring": `oklch(from ${accent} l c h / 0.6)`,
      } as React.CSSProperties)
    : undefined;

  /*
   * Absolutely positioned over the initials, so a picture that fails leaves
   * them in view. Its own surface fill is what covers them opaquely when it
   * loads — unless the legacy card has painted a fill of its own underneath,
   * in which case the picture stays transparent over it as it always did.
   * The legacy `padding` is an inset on the picture rather than padding on
   * the box, which an absolute child would ignore.
   */
  const imageClasses = twMerge(
    "ko:absolute ko:inset-0 ko:size-full",
    backgroundColor ? "" : "ko:bg-surface",
    padding && "ko:inset-2",
    fit === "contain" ? "ko:object-contain" : "ko:object-cover",
    alignment === "top" ? "ko:object-top" : "ko:object-center",
  );

  return (
    <span className={twMerge(AvatarVariants({ size, shape }), className)} style={style}>
      {backgroundColor && <span className="ko:absolute ko:inset-0" style={{ backgroundColor }} />}

      {/* Positioned, so it paints above the legacy fill (a positioned sibling before it) and below the picture. */}
      {name && (
        <span className="ko:relative ko:font-sans ko:font-bold ko:tracking-[0.01em] ko:text-text-muted" aria-hidden="true">
          {initialsOf(name)}
        </span>
      )}

      {src ? (
        <img className={imageClasses} src={src} alt="" loading="lazy" />
      ) : image ? (
        <img className={imageClasses} src={getSmallestImageUrl(image)} srcSet={buildSrcSet(image)} sizes={sizesAttr[size ?? "medium"]} alt="" loading="lazy" />
      ) : null}
    </span>
  );
}
