import type { IconProps } from "./types";

export function CheckIcon({ className, title, titleId, decorative = true, ...props }: IconProps) {
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
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}
