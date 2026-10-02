import { cva, type VariantProps } from "class-variance-authority";

import { twMerge } from "../../utilities";

export type ImageUrls = {
  original: string;
  xs?: string;
  sm?: string;
  md?: string;
};

export type Avatar = {
  image: ImageUrls;
  backgroundColor?: string;
  shape: "circle" | "square";
  alignment?: "top" | "center";
  padding?: boolean;
  fit?: "cover" | "contain";
  className?: string;
} & VariantProps<typeof AvatarVariants>;

const AvatarVariants = cva("ko:relative ko:flex ko:items-center ko:justify-center ko:overflow-hidden ko:shrink-0", {
  variants: {
    size: {
      small: "ko:h-10 ko:w-10",
      medium: "ko:h-14 ko:w-14",
      large: "ko:h-20 ko:w-20",
      // Additive, alongside small/medium/large rather than replacing them: 2026's own
      // avatar sizes (match-row's 44px row avatar and 64px top-match avatar), which
      // land between our existing sizes rather than on top of any of them.
      compact: "ko:h-11 ko:w-11",
      prominent: "ko:h-16 ko:w-16",
    },
    shape: {
      circle: "ko:rounded-full",
      square: "ko:rounded-2xl",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

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

export function Avatar({ image, backgroundColor, shape, alignment = "center", padding = false, fit = "cover", size, className }: Avatar) {
  const sizeMap = {
    small: "40px",
    medium: "56px",
    large: "80px",
    compact: "44px",
    prominent: "64px",
  };

  const sizesAttr = sizeMap[size || "medium"];
  const alignmentClass = alignment === "top" ? "ko:object-top" : "ko:object-center";
  const paddingClass = padding ? "ko:p-2" : "";
  const fitClass = fit === "contain" ? "ko:object-contain" : "ko:object-cover";

  return (
    <div className={twMerge(AvatarVariants({ size, shape }), paddingClass, className)}>
      {backgroundColor && <div className="ko:absolute ko:inset-0" style={{ backgroundColor }} />}

      <img src={getSmallestImageUrl(image)} srcSet={buildSrcSet(image)} sizes={sizesAttr} alt="" loading="lazy" className={`ko:relative ko:z-10 ko:h-full ko:w-full ${fitClass} ${alignmentClass}`} />
    </div>
  );
}
