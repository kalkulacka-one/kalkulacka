import type { IconProps } from "./types";

export function DoubleChevronLeftIcon({ className, title, titleId, decorative = true, ...props }: IconProps) {
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
      <path d="M11 18l-6-6 6-6" />
      <path d="M19 18l-6-6 6-6" />
    </svg>
  );
}
