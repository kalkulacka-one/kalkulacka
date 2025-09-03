import type { IconProps } from "./types";

export function StarIcon({ className, title, titleId, decorative = true, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative ? "true" : undefined}
      aria-labelledby={!decorative && titleId ? titleId : undefined}
      role={!decorative ? "img" : undefined}
      {...props}
    >
      {title && !decorative && <title id={titleId}>{title}</title>}
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
