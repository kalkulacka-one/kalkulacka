import type { IconProps } from "./types";

export function ChevronRightIcon({ className, title, titleId, decorative = true, ...props }: IconProps) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
